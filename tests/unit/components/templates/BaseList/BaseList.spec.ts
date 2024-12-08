import { beforeEach, describe, it, vi } from 'vitest'
import { cloneDeep } from 'lodash'
import { createStore } from 'vuex'
import BaseList from '../../../../../src/components/templates/BaseList/index.vue'
import { setMountComponent } from '../../../utils'
import { TableField } from '../../../../../src/@model/templates/tableFields'
import type { UseListType } from '../../../../../src/@model/templates/baseList'
import { mockModal } from '../../../mocks/modal-provide-config'

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

export const useList = (): UseListType => {
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

const defaultProps = {
  useList,
  config: {
    filterList: [],
    loadingEndpointArr: [],
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
      list: [{ id: 1, name: 'Item 1', type: 'Some type', status: 'Some Status' }],
      total: 2,
    })

    const wrapper = getMountBaseList(props, global)

    console.log(wrapper.html())
  })
})
