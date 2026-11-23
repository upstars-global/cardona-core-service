import { beforeEach, describe, expect, it } from 'vitest'
import NumberField from '../../../../src/components/templates/FieldGenerator/_components/NumberField.vue'
import { setMountComponentSelect } from '../shared-tests/select-field'
import { EventEmittersNames, testOn } from '../shared-tests/test-case-generator'
import {
  removeDot,
  removeMinus,
  testActiveErrorAndDisabled,
  testDefaultStateErrorAndDisabled,
  testRenderContentItems,
} from '../shared-tests/number-field'

const getMountNumberField = setMountComponentSelect(NumberField)

let props

const field = {
  placeholder: 'Some number value',
  append: '%',
  validationRules: { required: true, max_value: 100 },
}

const defaultProps = {
  modelValue: '',
  field,
}

beforeEach(() => {
  props = defaultProps
})

describe('NumberField', () => {
  it('Check render content items ', async () => {
    const wrapper = getMountNumberField(props)

    testRenderContentItems(wrapper, { props, placeholder: field.placeholder })

    testDefaultStateErrorAndDisabled(wrapper)

    await wrapper.setProps({
      disabled: true,
      errors: true,
    })

    testActiveErrorAndDisabled(wrapper)
  })

  it('Is working update model value ', async () => {
    const testValue = '123'
    const wrapper = getMountNumberField(props)

    await wrapper.setValue(testValue)

    testOn.isCalledEmitEventValue({ wrapper }, { event: EventEmittersNames.UpdateVModel, value: testValue })

    await wrapper.setProps({ modelValue: testValue })

    testOn.inputAttributeValueToBe({ wrapper, selector: 'input' }, testValue)
  })

  it('Check on update integer value with coma', async () => {
    const testValue = '1.1'

    props.field.isIntegerNumbers = true

    const wrapper = getMountNumberField(props)

    await wrapper.find('input').setValue(testValue)

    testOn.isNotDisabledElement({ wrapper })
  })

  it('Check on update integer value with dot', async () => {
    const testValue = '1.1'

    props.field.isIntegerNumbers = true

    const wrapper = getMountNumberField(props)

    await wrapper.find('input').setValue(testValue)

    testOn.isCalledEmitEventValue({ wrapper }, { event: EventEmittersNames.UpdateVModel, value: removeDot(testValue) })
  })

  it('Check on only positive numbers ', async () => {
    const testValue = '-12'

    props.field.withPositiveNumbers = true

    const wrapper = getMountNumberField(props)

    await wrapper.find('input').setValue(testValue)
    testOn.isCalledEmitEventValue({ wrapper }, { event: EventEmittersNames.UpdateVModel, value: removeMinus(testValue) })
  })

  describe('max_value rule', () => {
    // The limit is enforced only by validation rules (vee-validate), the component itself never blocks input
    const typeValue = async (modelValue: string | number, nextValue: string, extra = {}) => {
      const wrapper = getMountNumberField({
        modelValue,
        field: { validationRules: { max_value: 100 }, ...extra },
      })

      await wrapper.find('input').setValue(nextValue)

      return wrapper
    }

    it('Emits a value over max_value as is', async () => {
      const wrapper = await typeValue('10', '1000')

      expect(wrapper.emitted(EventEmittersNames.UpdateVModel)?.[0]).toEqual(['1000'])
    })

    it('Emits a value that is longer than max_value', async () => {
      const wrapper = await typeValue('', '12345678901234567890')

      expect(wrapper.emitted(EventEmittersNames.UpdateVModel)?.[0]).toEqual(['12345678901234567890'])
    })

    it('Allows to change an over-limit value from props to a greater one', async () => {
      const wrapper = await typeValue(150, '151')

      expect(wrapper.emitted(EventEmittersNames.UpdateVModel)?.[0]).toEqual(['151'])
    })

    it('Does not emit validate', async () => {
      const wrapper = getMountNumberField({ modelValue: 150, field: { validationRules: { max_value: 100 } } })

      await wrapper.setProps({ modelValue: 500, field: { validationRules: { max_value: 10 } } })
      await wrapper.find('input').setValue('1000')

      expect(wrapper.emitted('validate')).toBeUndefined()
    })
  })
})
