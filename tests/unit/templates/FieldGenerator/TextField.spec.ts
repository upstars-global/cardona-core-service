import { describe, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import TextField from '../../../../src/components/templates/FieldGenerator/_components/TextField.vue'
import { getWrapperElement, setMountComponent } from '../../utils'
import {
  getPropsWithDisabledTrue,
  onDisabledInput,
  testOnCalledEmittedEvent,
  testOnValidPlaceholder,
} from '../shared-tests/text-input-fields'
import { testOn } from '../shared-tests/test-case-generator'
import { IconsList } from '../../../../src/@model/enums/icons'

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
      selector: 'input',
    }) as VueWrapper

    testOnValidPlaceholder(wrapper, defaultProps.field.placeholder)
  })
  it('Updates the modelValue when the input changes', async () => {
    const newValue = 'New Value'
    const wrapper = getMountTextField(defaultProps)

    await testOnCalledEmittedEvent({ wrapper, selector: 'input' }, newValue)
  })

  it('Disables the input field when the disabled prop is true', async () => {
    const wrapper = getMountTextField(getPropsWithDisabledTrue(defaultProps))

    onDisabledInput({ wrapper, selector: 'input' })
  })

  it('Shows the error icon when errors prop is true and when is false', async () => {
    const selector = '.v-field__append-inner i'

    const wrapper = getMountTextField({ ...defaultProps, errors: true })

    const appendInnerBlockIcon = getWrapperElement({ wrapper, selector }) as VueWrapper

    testOn.existClass({ wrapper: appendInnerBlockIcon }, IconsList.InfoIcon)

    await wrapper.setProps({ ...defaultProps, errors: false })

    testOn.notExistElement({ wrapper, selector })
  })
})
