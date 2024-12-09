import { beforeEach, describe, it, vi } from 'vitest'
import { cloneDeep } from 'lodash'
import { createStore } from 'vuex'
import { flushPromises } from '@vue/test-utils'
import BaseList from '../../../../../src/components/templates/BaseList/index.vue'
import { getSelectorTestId, setMountComponent } from '../../../utils'
import { TableField } from '../../../../../src/@model/templates/tableFields'
import type { UseListType } from '../../../../../src/@model/templates/baseList'
import { mockModal } from '../../../mocks/modal-provide-config'
import { testOn } from '../../../templates/shared-tests/test-case-generator'

// class ListItemModel {
//   constructor(data) {
//
//   }
// }
// class ListFilterModel {
//   constructor(data) {
//
//   }
// }

const getMountBaseList = setMountComponent(BaseList)

const mockStore = createStore({
  actions: {
    fetchEntityList: vi.fn(),
  },
  getters: {
    isLoadingEndpoint: () => () => false,
  },
})

const fields = [
  new TableField({
    key: 'name',
    title: 'Name Column',
  }),
  new TableField({
    key: 'type',
    title: 'Type Column',
  }),
  new TableField({
    key: 'status',
    title: 'Status Column',
  }),
]

export const useList = (): UseListType => {
  return {
    entityName: 'TestList',
    fields,
  }
}

vi.mock('vue-router', async importOriginal => {
  const actual = await importOriginal()

  return {
    ...actual,
    useRouter: vi.fn(() => ({
      push: vi.fn(),
      replace: vi.fn(),
    })),
    useRoute: vi.fn(() => ({
      params: {},
      name: 'TestRoute',
      query: { page: '1' },
    })),
  }
})

const valueOfList = [{ id: 1, name: 'Item 1', type: 'Type 1', status: 'Status 1' }]

const defaultProps = {
  useList,
  config: {
    filterList: [],
    loadingEndpointArr: [],
    loadingOnlyByList: true,
  },
}

const global = {
  provide: { modal: mockModal },
  plugins: [mockStore],
}

let props

describe('BaseList', () => {
  beforeEach(() => {
    props = cloneDeep(defaultProps)
  })

  it('Render default state of component with slots of cell', async () => {
    const mockDispatch = vi.spyOn(mockStore, 'dispatch')

    mockDispatch.mockResolvedValueOnce({
      list: valueOfList,
      total: 1,
    })

    const wrapper = getMountBaseList(props, global)

    await flushPromises()

    /// TD value of table
    testOn.equalTextValue({ wrapper, selector: 'td[data-c-field="name"]' }, 'Item 1')
    testOn.equalTextValue({ wrapper, selector: 'td[data-c-field="type"]' }, 'Type 1')
    testOn.equalTextValue({ wrapper, selector: 'td[data-c-field="status"]' }, 'Status 1')

    const columns = wrapper.findAll(getSelectorTestId('column-title'))

    /// COL value of table
    columns.forEach((column, index) => {
      testOn.equalTextValue({ wrapper: column }, fields[index].title)
    })
  })
})
