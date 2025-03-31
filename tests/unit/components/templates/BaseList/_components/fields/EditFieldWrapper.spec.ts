import { beforeEach, describe, expect, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import EditFieldWrapper from '../../../../../../../src/components/templates/BaseList/_components/EditFieldWrapper.vue'
import { clickTrigger, getSelectorTestId, getWrapperElement, setMountComponent } from '../../../../../utils'
import { testOn } from '../../../../../templates/shared-tests/test-case-generator'

const getMountEditFieldWrapper = setMountComponent(EditFieldWrapper)

const defaultProps = {
  value: 'Some text',
  isEdit: false,
  canEdit: true,
  disableAcceptUpdate: false,
  hovered: false,
  editIconOnHover: false,
}

const testIds = {
  readableValue: 'readable-value',
  editIcon: 'edit-icon',
  actionButtons: 'action-buttons',
  acceptUpdateButton: 'accept-update-button',
  cancelUpdateButton: 'cancel-update-button',
}

let props

const mockedSlot = {
  input: `<template #input="{ inputValue, updateValue }">
        <input
          data-test-id="input-in-slot"
          :value="inputValue"
          @input="updateValue($event.target.value)"
        />
      </template>`,
}

const isActiveReadMode = (wrapper: VueWrapper) => {
  testOn.existElement({ wrapper, testId: testIds.editIcon })
  testOn.notExistElement({ wrapper, testId: testIds.actionButtons })
}

const isActiveEditMode = (wrapper: VueWrapper) => {
  testOn.notExistElement({ wrapper, testId: testIds.editIcon })
  testOn.existElement({ wrapper, testId: testIds.actionButtons })
}

const updateValueSlotInEditMode = async (props, action: CallableFunction) => {
  props.isEdit = true

  const wrapper = getMountEditFieldWrapper(props, {}, mockedSlot)

  const updatedValue = 'New value'

  /// Find input in slot
  const inputWrapper: VueWrapper = wrapper.find(getSelectorTestId('input-in-slot'))

  /// Check that input has value from props
  testOn.inputAttributeValueToBe({ wrapper: inputWrapper }, props.value)

  /// Update value in input
  await inputWrapper.setValue(updatedValue)

  /// Check that input is updated
  testOn.inputAttributeValueToBe({ wrapper: inputWrapper }, updatedValue)

  action({ wrapper, updatedValue })
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
    testOn.isCalledEmitEventValueToBe({ wrapper }, { event: 'change-mode', value: true })

    /// Check that edit mode is active
    isActiveEditMode(wrapper)

    /// Deactivate edit mode
    await clickTrigger({ wrapper, testId: testIds.cancelUpdateButton })

    /// Check on call event change-mode with value false

    testOn.isCalledEmitEventValueToBe({ wrapper }, { event: 'change-mode', value: false, index: 1 })

    /// Check that read mode is active
    isActiveReadMode(wrapper)
  })

  it('Check update value from edit mode and set read mode after accept', async () => {
    await updateValueSlotInEditMode(props, async ({ wrapper, updatedValue }) => {
      /// Click on accept update
      await clickTrigger({ wrapper, testId: testIds.acceptUpdateButton })

      /// Check that input is updated in parent component
      testOn.isCalledEmitEventValue({ wrapper }, { event: 'accept-change', value: updatedValue })

      /// Check that read mode is active and edit is deactivate
      isActiveReadMode(wrapper)
    })
  })
  it('Check on call event and value after cancel ', async () => {
    await updateValueSlotInEditMode(props, async ({ wrapper }) => {
      /// Click on  cancel update
      await clickTrigger({ wrapper, testId: testIds.cancelUpdateButton })

      /// Check that input is updated in parent component
      testOn.isCalledEmitEventValue({ wrapper }, { event: 'reject-change', value: props.value })

      /// Check that read mode is active and edit is deactivate
      isActiveReadMode(wrapper)
    })
  })
  it('Check possibility to edit and canEdit is false', async () => {
    props.canEdit = false

    const wrapper = getMountEditFieldWrapper(props)

    /// Check that edit icon is not exist
    testOn.notExistElement({ wrapper, testId: testIds.editIcon })
  })

  it('Disable accept update by props disableAcceptUpdate', async () => {
    props.disableAcceptUpdate = true

    await updateValueSlotInEditMode(props, async ({ wrapper, updatedValue }) => {
      /// Click on accept update
      await clickTrigger({ wrapper, testId: testIds.acceptUpdateButton })

      /// Check that input is updated in parent component
      testOn.isCalledEmitEventValue({ wrapper }, { event: 'accept-change', value: updatedValue })

      /// Check that edit mode is active because accept update is disabled
      isActiveEditMode(wrapper)
    })
  })

  it('Using show edit icon on hover', async () => {
    props.editIconOnHover = true
    props.hovered = false

    const wrapper = getMountEditFieldWrapper(props, {}, mockedSlot)

    /// Check that edit icon is not exist because hovered is false
    testOn.notExistElement({ wrapper, testId: testIds.editIcon })

    /// Set hovered to true
    await wrapper.setProps({ hovered: true })

    /// Check that edit icon is exist because hovered is true
    testOn.existElement({ wrapper, testId: testIds.editIcon })

    /// Check that edit icon is not exist because canEdit is false but  hovered is true
    await wrapper.setProps({ canEdit: false })

    testOn.notExistElement({ wrapper, testId: testIds.editIcon })

    /// Check that edit icon is exist because canEdit is true and  hovered is true
    await wrapper.setProps({ canEdit: true })

    testOn.existElement({ wrapper, testId: testIds.editIcon })
  })

  it('On "isEdit" with value false is called action "reject-change"', async () => {
    props.isEdit = true

    const wrapper = getMountEditFieldWrapper(props, {}, mockedSlot)

    const input = getWrapperElement({ wrapper, testId: 'input-in-slot' })

    input.setValue('New value')

    await wrapper.setProps({ isEdit: false })

    testOn.isCalledEmitEventValue({ wrapper }, { event: 'reject-change', value: props.value })
  })

  it('Update internal value state when "isEdit" equal false and props value was updated ', async () => {
    /// Init value for updating state
    const updatedValue = 'Some updated value'

    props.isEdit = false

    const wrapper = getMountEditFieldWrapper(props, {}, mockedSlot)

    /// Update value in props
    await wrapper.setProps({ value: updatedValue })

    /// Turn on edit mode
    await wrapper.setProps({ isEdit: true })

    /// Check that editableValue is updated
    expect(wrapper.vm.editableValue).includes(updatedValue)
  })
})
