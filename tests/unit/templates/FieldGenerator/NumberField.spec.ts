import { beforeEach, describe, it } from 'vitest'
import NumberField from '../../../../src/components/templates/FieldGenerator/_components/NumberField.vue'
import { setMountComponentSelect } from '../shared-tests/select-field'
import { testOn } from '../shared-tests/test-case-generator'
import { expectedEmitValue } from '../shared-tests/general'
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

    expectedEmitValue(wrapper, testValue)

    await wrapper.setProps({ modelValue: testValue })

    testOn.inputAttributeValueToBe({ wrapper, selector: 'input' }, testValue)
  })

  it('Check on only integer numbers ', async () => {
    const testValue = '123.12'

    props.field.isIntegerNumbers = true

    const wrapper = getMountNumberField(props)

    await wrapper.find('input').setValue(testValue)
    expectedEmitValue(wrapper, removeDot(testValue))
  })

  it('Check on only positive numbers ', async () => {
    const testValue = '-123'

    props.field.withPositiveNumbers = true

    const wrapper = getMountNumberField(props)

    await wrapper.find('input').setValue(testValue)
    expectedEmitValue(wrapper, removeMinus(testValue))
  })
})
