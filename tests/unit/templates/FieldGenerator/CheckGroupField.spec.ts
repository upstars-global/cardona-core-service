import { describe, it } from 'vitest'

import CheckGroupField from '../../../../src/components/templates/FieldGenerator/_components/CheckGroupField.vue'

import { getWrapperElement, setMountComponent } from '../../utils'

import {
  selectorInput,
  testEmitData,
} from '../shared-tests/checkbox-field'
import { testOn } from '../shared-tests/test-case-generator'
import { onDisabledInput } from '../shared-tests/text-input-fields'

const getMountCheckGroupField = setMountComponent(CheckGroupField)

describe('CheckFieldGroup.vue', () => {
  const options = [
    { id: 1, name: 'Option 1', disabled: false },
    { id: 2, name: 'Option 2', disabled: true },
    { id: 3, name: 'Option 3', disabled: false },
  ]

  const defaultProps = {
    modelValue: [],
    field: {
      key: 'group-field',
      options,
    },
    disabled: false,
  }

  it('Render correct length', () => {
    const wrapper = getMountCheckGroupField(defaultProps)

    testOn.checkLengthElements({
      wrapper,
      selector: selectorInput,
      all: true,
    }, defaultProps.field.options.length)
  })

  it('Renders the checkboxes with the correct label', () => {
    const wrapper = getMountCheckGroupField(defaultProps)
    const labels = getWrapperElement({ wrapper, selector: 'label', all: true })

    Array.from(labels).forEach((labelWrapper, index) => {
      testOn.existTextValue({ wrapper: labelWrapper }, `Option ${index + 1}`)
    })
  })

  it('Check disabled state', async () => {
    const wrapper = getMountCheckGroupField(defaultProps)

    testOn.isNotDisabledElement({ wrapper, selector: selectorInput })

    await wrapper.setProps({ disabled: true })

    onDisabledInput({ wrapper, selector: selectorInput })
  })

  it('Emits an update event when a checkbox is selected', async () => {
    const wrapper = getMountCheckGroupField(defaultProps)

    testEmitData(wrapper, [[defaultProps.field.options[0].id]])
  })

  it('Correct selected checkbox by props modelValue', async () => {
    const modelValue = [1, 3]
    const wrapper = getMountCheckGroupField({ ...defaultProps, modelValue })

    const inputs = getWrapperElement({ wrapper, selector: selectorInput, all: true })

    Array.from(inputs).forEach((input, index) => {
      testOn.isEqual({ wrapper: input.element.checked }, modelValue.includes(index + 1))
    })
  })
})
