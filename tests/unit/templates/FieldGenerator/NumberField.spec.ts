import { beforeEach, describe, it } from 'vitest'
import NumberField from '../../../../src/components/templates/FieldGenerator/_components/NumberField.vue'
import { setMountComponentSelect } from '../shared-tests/select-field'
import { testOn } from '../shared-tests/test-case-generator'
import { IconsList } from '../../../../src/@model/enums/icons'

const getMountNumberField = setMountComponentSelect(NumberField)

let props

const field = {
  // withPositiveNumbers: true,
  // isIntegerNumbers: true,
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
})
