import { beforeEach, describe, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import EditFieldWrapper from '../../../../../../../src/components/templates/BaseList/_components/EditFieldWrapper.vue'
import { setMountComponent } from '../../../../../utils'
import { testOn } from '../../../../../templates/shared-tests/test-case-generator'

const getMountEditFieldWrapper = setMountComponent(EditFieldWrapper)

const defaultProps = {
  value: 'Some text',
  isEdit: false,
  canEdit: true,
  disableAcceptUpdate: true,
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

  it('Renders by default state', () => {
    const wrapper = getMountEditFieldWrapper(props)

    testOn.equalTextValue({ wrapper, testId: testIds.readableValue }, props.value)

    isActiveReadMode(wrapper)
  })
  it('Renders when is active edit', () => {
    props.isEdit = true

    const wrapper = getMountEditFieldWrapper(props)

    isActiveEditMode(wrapper)
  })
})
