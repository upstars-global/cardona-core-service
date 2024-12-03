import { beforeEach, describe, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import TableFields from '../../../../../../src/components/templates/BaseList/_components/TableFields.vue'
import { clickTrigger, getWrapperElement, setMountComponent } from '../../../../utils'
import { testOn } from '../../../../templates/shared-tests/test-case-generator'
import { IconsList } from '../../../../../../src/@model/enums/icons'

const getMountTableFields = setMountComponent(TableFields)

// Mock the vue-router
vi.mock('vue-router', async importOriginal => {
  const actual = await importOriginal()

  return {
    ...actual,
    useRoute: vi.fn(() => ({
      name: 'TestRoute',
    })),
  }
})

// Mock data for the table fields
const mockDataList = [
  { key: 'id', title: 'some ID' },
  { key: 'name', title: 'some Name' },
  { key: 'status', title: 'some Status' },
]

const defaultProps = {
  list: mockDataList,
  entityName: 'MockEntity',
  modelValue: [],
}

const findSelectItem = (wrapper: VueWrapper, key: string) =>
  getWrapperElement({ wrapper, testId: `select-item-${key}` })

const checkSelectedIcon = (wrapper, key, shouldExist) => {
  const wrapperSelectedItem = findSelectItem(wrapper, key)
  const assertion = shouldExist ? testOn.existClass : testOn.notExistElement

  assertion({ wrapper: wrapperSelectedItem, selector: 'i' }, IconsList.CheckIcon)
}

let props

describe('TableFields.vue', () => {
  // Reset props before each test
  beforeEach(() => {
    props = { ...defaultProps }
  })

  it('Renders correctly base elements', async () => {
    const wrapper = getMountTableFields(props)

    // Verify the activator button exists
    testOn.existElement({ wrapper, testId: 'activator' })

    // Trigger the activator to open the dropdown
    await clickTrigger({ wrapper, testId: 'activator' })

    // Verify all items in the list are rendered with correct titles
    mockDataList.forEach(item => {
      testOn.existTextValue({ wrapper, testId: `select-item-${item.key}` }, item.title)
    })
  })

  it('Renders correctly selected elements', async () => {
    props.modelValue = [mockDataList[0]]

    const wrapper = getMountTableFields(props)

    await clickTrigger({ wrapper, testId: 'activator' })

    // Check the selected item has an icon
    checkSelectedIcon(wrapper, 'id', true)

    // Verify other items do not have icons
    mockDataList.slice(1).forEach(item => {
      checkSelectedIcon(wrapper, item.key, false)
    })
  })

  it('Check on call event update:modelValue with correct params', async () => {
    const wrapper = getMountTableFields(props)

    // Open the dropdown
    await clickTrigger({ wrapper, testId: 'activator' })

    // Select an item
    await clickTrigger({ wrapper, testId: 'select-item-id' })

    // Verify that the event is emitted with the correct value
    testOn.isCalledEmitEventValue(wrapper, {
      event: 'update:modelValue',
      value: mockDataList[0],
    })
  })

  it('Updated modelValue with correct render', async () => {
    const wrapper = getMountTableFields(props)

    // Open the dropdown
    await clickTrigger({ wrapper, testId: 'activator' })

    // Verify no icons exist initially
    mockDataList.forEach(item => {
      checkSelectedIcon(wrapper, item.key, false)
    })

    // Update modelValue with a new selection
    await wrapper.setProps({ modelValue: [mockDataList[2]] })

    // Verify the newly selected item has an icon
    checkSelectedIcon(wrapper, mockDataList[2].key, true)
  })
})
