import { beforeEach, describe, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import PositionField from '../../../../../../../src/components/templates/BaseList/_components/fields/PositionField.vue'
import { clickTrigger, getSelectorTestId, setMountComponent } from '../../../../../utils'
import { testOn } from '../../../../../templates/shared-tests/test-case-generator'
import { IconsList } from '../../../../../../../src/@model/enums/icons'
import { ListSize } from '../../../../../../../src/@model/templates/tableFields'

const getMountPositionField = setMountComponent(PositionField)

const defaultProps = {
  position: 1,
  canUpdate: true,

  /// Size
}

let props

const testIds = {
  positionText: 'position-read-text',
  editIcon: 'position-edit-icon',
  positionInput: 'position-input',
  savePosition: 'position-save-button',
  cancelPosition: 'position-cancel-button',
}

const positionInputSelector = `${getSelectorTestId(testIds.positionInput)} input`

const testOnSavePosition = async (wrapper: VueWrapper, { newPosition, actionForSave }: { newPosition: number; actionForSave: () => void }) => {
  await clickTrigger({ wrapper, testId: testIds.editIcon })

  await wrapper.find(positionInputSelector).setValue(newPosition)

  await actionForSave()

  testOn.isCalledEmitEventValue({ wrapper }, { event: 'editPosition', value: newPosition })

  await wrapper.setProps({ position: newPosition })

  testOn.existTextValue({ wrapper, testId: testIds.positionText }, newPosition.toString())
}

const setTestFormEditElements = (testOnMethod: Function) => (wrapper: VueWrapper) => {
  const editModeElements = [testIds.positionInput, testIds.savePosition, testIds.cancelPosition]

  editModeElements.forEach(testId => {
    testOnMethod({ wrapper, testId })
  })
}

const renderElementsForEditMode = setTestFormEditElements(testOn.existElement)

const notRenderedElementsForEditMode = setTestFormEditElements(testOn.notExistElement)

describe('PositionField.vue', () => {
  beforeEach(() => {
    props = { ...defaultProps }
  })

  it('Rendered elements in default state ', () => {
    const wrapper = getMountPositionField(props)

    testOn.existClass({ wrapper, testId: testIds.editIcon, selector: 'i' }, IconsList.EditIcon)
    testOn.existTextValue({ wrapper, testId: testIds.positionText }, props.position.toString())

    notRenderedElementsForEditMode(wrapper)
  })

  it('Check activation edit mode ', async () => {
    const wrapper = getMountPositionField(props)

    await clickTrigger({ wrapper, testId: testIds.editIcon })

    /// Check that exist input for edit position
    renderElementsForEditMode(wrapper)
  })

  it('Check on change position and save', async () => {
    const wrapper = getMountPositionField(props)

    await testOnSavePosition(wrapper, {
      newPosition: 2,
      actionForSave: async () => {
        /// Save position by click on button
        await clickTrigger({ wrapper, testId: testIds.savePosition })
      },
    })
  })

  it('Check on change position and cancel', async () => {
    const wrapper = getMountPositionField(props)

    await clickTrigger({ wrapper, testId: testIds.editIcon })

    const newPosition = 2

    /// Update position input value
    await wrapper.find(positionInputSelector).setValue(newPosition)

    /// Cancel by click on button
    await clickTrigger({ wrapper, testId: testIds.cancelPosition })

    notRenderedElementsForEditMode(wrapper)
  })

  it('Check on change position and save by click "Enter" ', async () => {
    const wrapper = getMountPositionField(props)

    await testOnSavePosition(wrapper, {
      newPosition: 2,
      actionForSave: async () => {
        /// Save position  by "Enter"
        await wrapper.find(positionInputSelector).trigger('keyup.enter')
      },
    })
  })

  it('Check on cancel saving position and by click "Esc"', async () => {
    const wrapper = getMountPositionField(props)

    await clickTrigger({ wrapper, testId: testIds.editIcon })

    const newPosition = 2

    const input = wrapper.find(positionInputSelector)

    await input.setValue(newPosition)

    /// Cancel by "Esc"
    await input.trigger('keyup.esc')

    notRenderedElementsForEditMode(wrapper)
  })

  it('Render component when update position is forbidden', async () => {
    props.canUpdate = false

    const wrapper = getMountPositionField(props)

    /// Check that not exist icon for action edit
    testOn.notExistElement({ wrapper, testId: testIds.editIcon })
  })

  it('Render element with active small size', async () => {
    props.size = ListSize.SM

    const wrapper = getMountPositionField(props)

    await clickTrigger({ wrapper, testId: testIds.editIcon })

    /// Check that exist class on Size.SM
    testOn.existClass({ wrapper, selector: '.app-text-field' }, 'app-text-field--small')
  })
})
