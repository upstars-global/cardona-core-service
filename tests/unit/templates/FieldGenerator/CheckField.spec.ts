import { describe, it } from 'vitest'
import CheckField from '../../../../src/components/templates/FieldGenerator/_components/CheckField.vue'
import { CheckGroupBaseField } from '../../../../src/@model/templates/baseField'
import { setMountComponent } from '../../utils'
import { testOn } from '../shared-tests/test-case-generator'
import {
  getCheckBoxElement,
  isActiveDisabledState, testEmitData,
  testOnValidLabel,
} from '../shared-tests/checkbox-field'

const getMountCheckField = setMountComponent(CheckField)

describe('CheckField.vue', () => {
  const field = new CheckGroupBaseField({
    label: 'Test Checkbox',
    value: false,
    key: 'test-check',
  })

  const defaultProps = {
    modelValue: false,
    disabled: false,
    field,
  }

  it('Renders the checkbox with the correct label', () => {
    const wrapper = getMountCheckField(defaultProps)

    testOnValidLabel(wrapper, field.label)
  })
  it('Binds modelValue to checkbox and emits update on change', async () => {
    const wrapper = getMountCheckField(defaultProps)

    await testEmitData(wrapper, [true])
  })

  it('Exist is disabled state', async () => {
    const wrapper = getMountCheckField({ ...defaultProps, disabled: true })

    const checkbox = getCheckBoxElement(wrapper)

    isActiveDisabledState(checkbox)
  })

  it('Updates modelValue correctly when the prop changes', async () => {
    const wrapper = getMountCheckField(defaultProps)

    testOn.isEqualValueOfCheckBox(wrapper, false)

    await wrapper.setProps({ modelValue: true })

    testOn.isEqualValueOfCheckBox(wrapper, true)
  })
})
