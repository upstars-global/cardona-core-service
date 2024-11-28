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

const positionTextTestId = 'position-read-text'
const editIconTestId = 'position-edit-icon'
const positionInputTestId = 'position-input'
const savePositionTestId = 'position-save-button'
const cancelPositionTestId = 'position-cancel-button'

const testOnSavePosition = async (wrapper: VueWrapper, { newPosition, actionForSave }: { newPosition: number; actionForSave: () => void }) => {
  await clickTrigger({ wrapper, testId: editIconTestId })

  await wrapper.find(`${getSelectorTestId(positionInputTestId)} input`).setValue(newPosition)

  await actionForSave()

  testOn.isCalledEmitEventValue(wrapper, { event: 'editPosition', value: newPosition })

  await wrapper.setProps({ position: newPosition })

  testOn.existTextValue({ wrapper, testId: positionTextTestId }, newPosition.toString())
}

const setTestFormEditElements = (testOnMethod: Function) => (wrapper: VueWrapper) => {
  const editModeElements = [positionInputTestId, savePositionTestId, cancelPositionTestId]

  editModeElements.forEach(testId => {
    testOnMethod({ wrapper, testId })
  })
}

const existElementsForEditMode = setTestFormEditElements(testOn.existElement)

const absentElementsForEditMode = setTestFormEditElements(testOn.notExistElement)

describe('PositionField.vue', () => {
  beforeEach(() => {
    props = { ...defaultProps }
  })

  it('Renders correctly base elements by default states ', () => {
    const wrapper = getMountPositionField(props)

    testOn.existClass({ wrapper, testId: editIconTestId, selector: 'i' }, IconsList.EditIcon)
    testOn.existTextValue({ wrapper, testId: positionTextTestId }, props.position.toString())

    absentElementsForEditMode(wrapper)
  })

  it('Check on click edit position', async () => {
    const wrapper = getMountPositionField(props)

    await clickTrigger({ wrapper, testId: editIconTestId })

    existElementsForEditMode(wrapper)
  })

  it('Check on change position and save', async () => {
    const wrapper = getMountPositionField(props)

    await testOnSavePosition(wrapper, {
      newPosition: 2,
      actionForSave: async () => await clickTrigger({ wrapper, testId: savePositionTestId }),
    })
  })

  it('Check on change position and cancel', async () => {
    const wrapper = getMountPositionField(props)

    await clickTrigger({ wrapper, testId: editIconTestId })

    const newPosition = 2

    await wrapper.find(`${getSelectorTestId(positionInputTestId)} input`).setValue(newPosition)

    await clickTrigger({ wrapper, testId: cancelPositionTestId })

    /// Not exists elements
    absentElementsForEditMode(wrapper)
  })

  it('Check on change position and save by click "Enter" ', async () => {
    const wrapper = getMountPositionField(props)

    await testOnSavePosition(wrapper, {
      newPosition: 2,
      actionForSave: async () => {
        await wrapper.find(`${getSelectorTestId(positionInputTestId)} input`).trigger('keyup.enter')
      },
    })
  })

  it('Check on change position and cancel', async () => {
    const wrapper = getMountPositionField(props)

    await clickTrigger({ wrapper, testId: editIconTestId })

    const newPosition = 2

    const input = wrapper.find(`${getSelectorTestId(positionInputTestId)} input`)

    await input.setValue(newPosition)

    await input.trigger('keyup.esc')

    /// Not exists elements
    absentElementsForEditMode(wrapper)
  })

  it('Render component when cant update position', () => {
    props.canUpdate = false

    const wrapper = getMountPositionField(props)

    testOn.notExistElement({ wrapper, testId: editIconTestId })
  })
  it('Render element with props size: small', async () => {
    props.size = ListSize.SM

    const wrapper = getMountPositionField(props)

    await clickTrigger({ wrapper, testId: editIconTestId })

    testOn.existClass({ wrapper, selector: '.app-text-field' }, 'app-text-field--small')
  })

  /// TODO decompose dublicated logic and rename test titles
})
