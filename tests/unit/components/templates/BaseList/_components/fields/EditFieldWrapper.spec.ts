import { beforeEach, describe, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import EditFieldWrapper from '../../../../../../../src/components/templates/BaseList/_components/EditFieldWrapper.vue'
import { clickTrigger, getSelectorTestId, setMountComponent } from '../../../../../utils'
import { testOn } from '../../../../../templates/shared-tests/test-case-generator'

const getMountEditFieldWrapper = setMountComponent(EditFieldWrapper)

const defaultProps = {
  value: 'Some text',
  isEdit: false,
  canEdit: true,
  disableAcceptUpdate: false,
}

const testIds = {
  wrapper: 'editable-wrapper',
  readableValue: 'readable-value',
  editIcon: 'edit-icon',
  actionButtons: 'action-buttons',
  acceptUpdateButton: 'accept-update-button',
  cancelUpdateButton: 'cancel-update-button',
}

let props

const isActiveReadMode = (wrapper: VueWrapper) => {
  testOn.existElement({ wrapper, testId: testIds.editIcon })
  testOn.notExistElement({ wrapper, testId: testIds.actionButtons })
}

const isActiveEditMode = (wrapper: VueWrapper) => {
  testOn.notExistElement({ wrapper, testId: testIds.editIcon })
  testOn.existElement({ wrapper, testId: testIds.actionButtons })
}

describe('EditFieldWrapper.vue', () => {
  beforeEach(() => {
    props = { ...defaultProps }
  })

  it('Renders content by default state', () => {
    const wrapper = getMountEditFieldWrapper(props)

    testOn.equalTextValue({ wrapper, testId: testIds.readableValue }, props.value)

    isActiveReadMode(wrapper)
  })

  it('Renders elements when is active edit', () => {
    props.isEdit = true

    const wrapper = getMountEditFieldWrapper(props)

    isActiveEditMode(wrapper)
  })

  it('Check switch between read and edit mode', async () => {
    const wrapper = getMountEditFieldWrapper(props)

    /// Check started state
    isActiveReadMode(wrapper)

    /// Activate edit mode
    await clickTrigger({ wrapper, testId: testIds.editIcon })

    /// Check on call event change-mode with value true
    testOn.isCalledEmitEventValueToBe(wrapper, { event: 'change-mode', value: true })

    /// Check that edit mode is active
    isActiveEditMode(wrapper)

    /// Deactivate edit mode
    await clickTrigger({ wrapper, testId: testIds.cancelUpdateButton })

    /// Check on call event change-mode with value false

    testOn.isCalledEmitEventValueToBe(wrapper, { event: 'change-mode', value: false, index: 1 })

    /// Check that read mode is active
    isActiveReadMode(wrapper)
  })

  it('Check update value from edit mode and set read mode after accept', async () => {
    props.isEdit = true

    const global = {}

    const slot = {
      input: `<template #input="{ inputValue, updateValue }">
        <input
          data-test-id="input-in-slot"
          :value="inputValue"
          @input="updateValue($event.target.value)"
        />
      </template>`,
    }

    const updatedValue = 'New value'
    const wrapper = getMountEditFieldWrapper(props, global, slot)

    /// Find input in slot
    const inputWrapper: VueWrapper = wrapper.find(getSelectorTestId('input-in-slot'))

    /// Check that input has value from props
    testOn.inputAttributeValueToBe({ wrapper: inputWrapper }, props.value)

    /// Update value in input
    await inputWrapper.setValue(updatedValue)

    /// Check that input is updated
    testOn.inputAttributeValueToBe({ wrapper: inputWrapper }, updatedValue)

    /// Accept update
    await clickTrigger({ wrapper, testId: testIds.acceptUpdateButton })

    /// Check that input is updated in parent component
    testOn.isCalledEmitEventValue(wrapper, { event: 'accept-change', value: updatedValue })

    /// Check that read mode is active and edit is deactivate
    isActiveReadMode(wrapper)
  })
  it('Check on call event and value after cancel ', async () => {
    props.isEdit = true

    const global = {}

    const slot = {
      input: `<template #input="{ inputValue, updateValue }">
        <input
          data-test-id="input-in-slot"
          :value="inputValue"
          @input="updateValue($event.target.value)"
        />
      </template>`,
    }

    const updatedValue = 'New value'
    const wrapper = getMountEditFieldWrapper(props, global, slot)

    /// Find input in slot
    const inputWrapper: VueWrapper = wrapper.find(getSelectorTestId('input-in-slot'))

    /// Check that input has value from props
    testOn.inputAttributeValueToBe({ wrapper: inputWrapper }, props.value)

    /// Update value in input
    await inputWrapper.setValue(updatedValue)

    /// Check that input is updated
    testOn.inputAttributeValueToBe({ wrapper: inputWrapper }, updatedValue)

    /// Accept update
    await clickTrigger({ wrapper, testId: testIds.cancelUpdateButton })

    /// Check that input is updated in parent component
    testOn.isCalledEmitEventValue(wrapper, { event: 'reject-change', value: props.value })

    /// Check that read mode is active and edit is deactivate
    isActiveReadMode(wrapper)
  })
})
