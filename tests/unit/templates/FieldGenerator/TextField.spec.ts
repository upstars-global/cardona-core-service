import { describe, it } from 'vitest'
import TextField from '../../../../src/components/templates/FieldGenerator/_components/TextField.vue'
import { getWrapperElement, setMountComponent } from '../../utils'
import { testOnValidPlaceholder } from '../shared-tests/text-input-fields'

const getMountTextField = setMountComponent(TextField)

describe('TextField.vue', () => {
  const defaultProps = {
    modelValue: '',
    field: {
      label: 'Test Label',
      placeholder: 'Test Placeholder',
      prepend: 'Prepend Text',
      append: 'Append Text',
    },
    errors: false,
    disabled: false,
  }

  it('Renders the text field with the correct placeholder', () => {
    const wrapper = getWrapperElement({
      wrapper: getMountTextField(defaultProps),
      testId: 'text-field',
    })

    testOnValidPlaceholder(wrapper, defaultProps.field.placeholder)
  })
})
