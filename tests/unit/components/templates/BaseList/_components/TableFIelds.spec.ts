import { beforeAll, beforeEach, describe, it, vi } from 'vitest'
import TableFields from '../../../../../../src/components/templates/BaseList/_components/TableFields.vue'
import { clickTrigger, getWrapperElement, setMountComponent } from '../../../../utils'
import { testOn } from '../../../../templates/shared-tests/test-case-generator'
import { IconsList } from '../../../../../../src/@model/enums/icons'

const getMountTableFields = setMountComponent(TableFields)

vi.mock('vue-router', async importOriginal => {
  const actual = await importOriginal()

  return {
    ...actual,
    useRoute: vi.fn(() => ({
      name: 'TestRoute',
    })),
  }
})

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

let props

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})
describe('TableFields.vue', () => {
  beforeEach(() => {
    props = defaultProps
  })
  it('Renders correctly base elements', async () => {
    const wrapper = getMountTableFields(props)

    testOn.existElement({ wrapper, testId: 'activator' })

    await clickTrigger({ wrapper, testId: 'activator' })

    defaultProps.list.forEach(item => {
      testOn.existTextValue({ wrapper, testId: `select-item-${item.key}` }, item.title)
    })
  })
  it('Renders correctly selected elements', async () => {
    props.modelValue = [mockDataList[0]]

    const wrapper = getMountTableFields(props)

    await clickTrigger({ wrapper, testId: 'activator' })

    /// Find selected item
    const wrapperSelectedItem = getWrapperElement({ wrapper, testId: 'select-item-id' })

    /// Check that selected item has icon
    testOn.existClass({ wrapper: wrapperSelectedItem, selector: 'i' }, IconsList.CheckIcon)

    /// Check that in other items there is no icon
    props.list.slice(1).forEach(item => {
      const wrapperSelectedItem = getWrapperElement({ wrapper, testId: `select-item-${item.key}` })

      testOn.notExistElement({ wrapper: wrapperSelectedItem, selector: 'i' })
    })

    /// Reset props
    props.modelValue = []
  })
  it('Check on call event update:modelValue with correct params', async () => {
    const wrapper = getMountTableFields(props)

    await clickTrigger({ wrapper, testId: 'activator' })

    await clickTrigger({ wrapper, testId: 'select-item-id' })

    testOn.isCalledEmitEventValue(wrapper, { event: 'update:modelValue', value: mockDataList[0] })
  })

  it('Updated modelValue with correct render', async () => {
    const wrapper = getMountTableFields(props)

    await clickTrigger({ wrapper, testId: 'activator' })

    /// Check that in other items there is no icon
    props.list.forEach(item => {
      const wrapperSelectedItem = getWrapperElement({ wrapper, testId: `select-item-${item.key}` })

      testOn.notExistElement({ wrapper: wrapperSelectedItem, selector: 'i' })
    })

    const wrapperSelectedItem = getWrapperElement({ wrapper, testId: `select-item-${mockDataList[2].key}` })

    await wrapper.setProps({ modelValue: [mockDataList[2]] })

    /// Check that selected item has icon
    testOn.existClass({ wrapper: wrapperSelectedItem, selector: 'i' }, IconsList.CheckIcon)
  })

  /// TODO Create methods for the test cases which are duplicated
})
