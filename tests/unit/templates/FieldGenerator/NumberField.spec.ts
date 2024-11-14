import { beforeEach, describe, it } from 'vitest'
import NumberField from '../../../../src/components/templates/FieldGenerator/_components/NumberField.vue'
import { setMountComponentSelect } from '../shared-tests/select-field'
import { testOn } from '../shared-tests/test-case-generator'
import { IconsList } from '../../../../src/@model/enums/icons'
import { expectedEmitValue } from '../shared-tests/general'

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

    testOn.isEqualPlaceholder({ wrapper, selector: 'input' }, props.field.placeholder)
    testOn.equalTextValue({ wrapper, selector: '.v-text-field__suffix__text' }, props.field.append)

    testOn.notExistClasses({ wrapper, selector: '.v-field' }, 'v-field--disabled')
    testOn.notExistElement({ wrapper, selector: '.v-field__append-inner i' })

    // Make input disabled and with error

    await wrapper.setProps({
      disabled: true,
      errors: true,
    })

    // Check render elements with updated props
    testOn.existClass({ wrapper, selector: '.v-field' }, 'v-field--disabled')
    testOn.existClass({ wrapper, selector: '.v-field__append-inner i' }, IconsList.InfoIcon)
  })

  it('Is working update model value ', async () => {
    const testValue = 123
    const wrapper = getMountNumberField(props)

    await wrapper.setValue(testValue)

    expectedEmitValue(wrapper, testValue)

    await wrapper.setProps({ modelValue: testValue })

    testOn.inputAttributeValueToBe({ wrapper, selector: 'input' }, testValue.toString())
  })

  it('Check on only integer numbers ', async () => {
    const testValue = '123.12'

    props.field.isIntegerNumbers = true

    const wrapper = getMountNumberField(props)

    await wrapper.find('input').setValue(testValue)
    expectedEmitValue(wrapper, testValue.replace('.', ''))
  })

  it('Check on only positive numbers ', async () => {
    const testValue = '-123'

    props.field.withPositiveNumbers = true

    const wrapper = getMountNumberField(props)

    await wrapper.find('input').setValue(testValue)
    expectedEmitValue(wrapper, testValue.replace('-', ''))
  })
})
