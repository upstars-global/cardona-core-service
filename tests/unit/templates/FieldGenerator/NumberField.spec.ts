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

  describe('Max value limit', () => {
    const limitField = (extra = {}) => ({
      validationRules: { max_value: 999_999_999_999 },
      isIntegerNumbers: true,
      ...extra,
    })

    const typeValue = async (modelValue: string | number, nextValue: string, extra = {}) => {
      const wrapper = getMountNumberField({ modelValue, field: limitField(extra) })
      const input = wrapper.find('input')

      input.element.value = nextValue
      await input.trigger('input')

      return { wrapper, input }
    }

    it('Rejects a digit over the limit and rolls the input back', async () => {
      const { wrapper, input } = await typeValue('123456789012', '1234567890123')

      expect(wrapper.emitted(EventEmittersNames.UpdateVModel)).toBeUndefined()
      expect(input.element.value).toBe('123456789012')
    })

    it('Allows a digit up to the limit', async () => {
      const { wrapper } = await typeValue('12345678901', '123456789012')

      expect(wrapper.emitted(EventEmittersNames.UpdateVModel)?.[0]).toEqual(['123456789012'])
    })

    it('Rejects a paste over the limit', async () => {
      const { wrapper, input } = await typeValue('', '12345678901234567890')

      expect(wrapper.emitted(EventEmittersNames.UpdateVModel)).toBeUndefined()
      expect(input.element.value).toBe('')
    })

    it('Lets an over-limit value from props be shortened only', async () => {
      const shortened = await typeValue(12100000000000, '1210000000000')

      expect(shortened.wrapper.emitted(EventEmittersNames.UpdateVModel)?.[0]).toEqual(['1210000000000'])

      const replaced = await typeValue(12100000000000, '12100000000001')

      expect(replaced.wrapper.emitted(EventEmittersNames.UpdateVModel)).toBeUndefined()
      expect(replaced.input.element.value).toBe('12100000000000')
    })

    it('Does not count the fractional part and the sign', async () => {
      const fractional = await typeValue('123456789012', '123456789012.5', { isIntegerNumbers: false })

      expect(fractional.wrapper.emitted(EventEmittersNames.UpdateVModel)?.[0]).toEqual(['123456789012.5'])

      const negative = await typeValue('-12345678901', '-123456789012', { isIntegerNumbers: false })

      expect(negative.wrapper.emitted(EventEmittersNames.UpdateVModel)?.[0]).toEqual(['-123456789012'])
    })

    it('Rejects a digit added to the integer part of a fractional value', async () => {
      const { wrapper } = await typeValue('123456789012.5', '1234567890123.5', { isIntegerNumbers: false })

      expect(wrapper.emitted(EventEmittersNames.UpdateVModel)).toBeUndefined()
    })

    describe('Numeric max_value', () => {
      const maxField = { validationRules: { max_value: 100 }, isIntegerNumbers: true }

      it('Allows a value up to max_value and rejects a greater one with the same length', async () => {
        const allowed = await typeValue('10', '100', maxField)

        expect(allowed.wrapper.emitted(EventEmittersNames.UpdateVModel)?.[0]).toEqual(['100'])

        const rejected = await typeValue('10', '101', maxField)

        expect(rejected.wrapper.emitted(EventEmittersNames.UpdateVModel)).toBeUndefined()
        expect(rejected.input.element.value).toBe('10')
      })

      it('Rejects a value that exceeds both max_value and its length', async () => {
        const { wrapper } = await typeValue('100', '1000', maxField)

        expect(wrapper.emitted(EventEmittersNames.UpdateVModel)).toBeUndefined()
      })

      it('Lets an initial value over max_value only decrease', async () => {
        const decreased = await typeValue(150, '149', maxField)

        expect(decreased.wrapper.emitted(EventEmittersNames.UpdateVModel)?.[0]).toEqual(['149'])

        const increased = await typeValue(150, '151', maxField)

        expect(increased.wrapper.emitted(EventEmittersNames.UpdateVModel)).toBeUndefined()
      })
    })
  })

  describe('Validate request', () => {
    // The composable behind it is covered in tests/unit/composables/useNumberMaxValue.spec.ts
    const mountWith = (modelValue: string | number, max_value = 100) =>
      getMountNumberField({ modelValue, field: { validationRules: { max_value } } })

    it('Emits validate when the value from props is over max_value', () => {
      const wrapper = mountWith(150)

      expect(wrapper.emitted('validate')).toHaveLength(1)
    })

    it('Does not emit validate for a value within max_value or an empty value', () => {
      expect(mountWith(100).emitted('validate')).toBeUndefined()
      expect(mountWith('').emitted('validate')).toBeUndefined()
    })

    it('Emits validate when max_value is lowered under the current value', async () => {
      const wrapper = mountWith(50)

      expect(wrapper.emitted('validate')).toBeUndefined()

      await wrapper.setProps({ field: { validationRules: { max_value: 10 } } })

      expect(wrapper.emitted('validate')).toHaveLength(1)
    })

    it('Does not emit validate for a value over max_value typed by the user', async () => {
      const wrapper = mountWith(10)
      const input = wrapper.find('input')

      input.element.value = '500'
      await input.trigger('input')

      expect(wrapper.emitted('validate')).toBeUndefined()
    })

    it('Emits validate when props change to a value over max_value', async () => {
      const wrapper = mountWith(10)

      await wrapper.setProps({ modelValue: 500 })

      expect(wrapper.emitted('validate')).toHaveLength(1)
    })
  })
})
