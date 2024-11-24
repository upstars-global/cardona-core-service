import { beforeAll, beforeEach, describe, it, vi } from 'vitest'
import TableFields from '../../../../../../src/components/templates/BaseList/_components/TableFields.vue'
import { clickTrigger, setMountComponent } from '../../../../utils'
import { testOn } from '../../../../templates/shared-tests/test-case-generator'

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

beforeEach(() => {
  props = defaultProps
})

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})
describe('MultipleActions.vue', () => {
  it('Renders correctly base elements', async () => {
    const wrapper = getMountTableFields(props)

    testOn.existElement({ wrapper, testId: 'activator' })

    await clickTrigger({ wrapper, testId: 'activator' })

    defaultProps.list.forEach(item => {
      testOn.existTextValue({ wrapper, testId: item.key }, item.title)
    })
  })
})
