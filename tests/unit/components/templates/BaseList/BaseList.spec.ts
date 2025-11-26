import { beforeEach, describe, it, vi } from 'vitest'
import { cloneDeep } from 'lodash'
import { flushPromises } from '@vue/test-utils'
import BaseList from '../../../../../src/components/templates/BaseList/index.vue'
import { defaultProps as defaultPropsBaseList, fields, mockStore, useListForToggleStatus } from '../../../mocks/base-list'
import { clickTrigger, setMountComponent } from '../../../utils'
import { ListTypes } from '../../../../../src/@model/templates/baseList'
import DefaultBaseList from '../../../../../src/components/templates/BaseList/types/default.vue'
import { testOn } from '../../../templates/shared-tests/test-case-generator'
import { mockModal } from '../../../mocks/modal-provide-config'

vi.mock('../../../../../src/stores/users', () => {
  return {
    useUsersStore: () => ({
      fetchUsersList: vi.fn(),
      fetchEntityList: vi.fn(),
      updateUserPassword: vi.fn(),
    }),
  }
})

//
// // Helper function to select table cells based on data attribute
// const getSelectorCField = (name: string) => `td[data-c-field="${name}"]`
//
// // Mounting function for the DefaultBaseList component
//
// // Utility function to update component props
// const getUpdatePropsConfig = (updatedConfig, props) => ({
//   ...props,
//   config: {
//     ...props.config,
//     ...updatedConfig,
//   },
// })

// Mock vue-router before importing components that depend on it
vi.mock('vue-router', async importOriginal => {
  const actual = await importOriginal()

  return {
    ...actual,
    useRouter: vi.fn(() => ({
      push: vi.fn(),
      replace: vi.fn(),
      getRoutes: vi.fn(() => [
        { name: 'TestCreate', path: '/test/create' },
        { name: 'TestRoute', path: '/test-route' },
      ]),
    })),
    useRoute: vi.fn(() => ({
      params: {},
      name: 'TestRoute',
      query: { page: '1' },
    })),
  }
})

// Mock the toast service to control and inspect toast notifications
vi.mock('../../../../../../src/helpers/toasts', () => {
  const toastErrorMock = vi.fn()

  return {
    default: vi.fn(() => ({
      toastError: toastErrorMock,
      toastSuccess: vi.fn(),
      toastErrorMessageString: vi.fn(),
    })),
    toastErrorMock,
  }
})

export const fetchEntityList = vi.fn().mockResolvedValue({
  list: [{
    id: 1,
    name: 'Item 1',
    type: 'Type 1',
    status: 'Status 1',
  }],
  total: 1,
})
vi.mock('../../../../../../src/stores/users', () => ({
  useUsersStore: () => ({
    fetchUsersList: vi.fn(),
  }),
}))

const updateEntity = vi.fn()
const fetchReport = vi.fn()
const toggleStatusEntity = vi.fn()
const deleteEntity = vi.fn()
const multipleDeleteEntity = vi.fn()

const mockBaseStoreCore = {
  fetchEntityList,
  updateEntity,
  multipleDeleteEntity,
  fetchReport,
  toggleStatusEntity,
  deleteEntity,
}

// Function to test toggling the status of an entity
const runActionToggleState = async props => {
  props.useList = useListForToggleStatus

  // Mock the dispatch response with a sample list item
  mockBaseStoreCore.fetchEntityList.mockResolvedValueOnce({
    list: [{
      id: 1,
      name: 'Item 1',
      type: 'Type 1',
      status: 'Status 1',
      isActive: true,
    }],
    total: 1,
  })

  const wrapper = getMountComponent(props, global)

  await flushPromises()

  // Verify that the pill-status element exists
  testOn.existElement({ wrapper, testId: 'pill-status' })

  // Simulate user interactions to toggle status
  await clickTrigger({ wrapper, testId: 'activator' })
  await clickTrigger({ wrapper, testId: 'status-toggle' })
}

export const mockCustomStore = {
  fetchEntityList: vi.fn().mockResolvedValue({
    list: [],
    total: 101,
  }),
  updateEntity: vi.fn(),
  fetchReport: vi.fn(),
  toggleStatusEntity: vi.fn(),
  deleteEntity: vi.fn(),
}

export const mockUseBaseStoreCore = () => {
  vi.mock('@/stores/baseStoreCore', () => ({
    useBaseStoreCore: () => ({
      ...mockBaseStoreCore,
      isLoading: false,
      selectedItems: [],
    }),
  }))
}

// Global configuration for mounting the component, including plugins and providers
const global = {
  provide: { modal: mockModal },
  plugins: [mockStore],
  components: {
    VueSelect: {
      template: '<select><slot /></select>',
    },
  },
}

let props
let mockDispatch

vi.mock('vue', async importOriginal => {
  const vue = await importOriginal()

  return {
    ...vue,
    defineAsyncComponent: loader => {
      return DefaultBaseList
    },
  }
})

const getMountComponent = setMountComponent(BaseList)

const defaultProps = {
  config: defaultPropsBaseList.config,
  useList: () => ({
    ListFilterModel: class PassthroughFilter {
      constructor(data?: any) { Object.assign(this, data) }
    },
    entityName: 'Test',
    fields,
  }),
  type: ListTypes.Default,
}

describe('BaseList.vue (with mocked dynamic import)', () => {
  beforeEach(() => {
    props = cloneDeep(defaultProps)
    mockDispatch = vi.spyOn(mockStore, 'dispatch')
  })
  it('Should display create, update, and delete buttons based on onePermissionKey', () => {
    mockDispatch.mockResolvedValueOnce({
      list: [{ id: 1, name: 'Item 1', type: 'Type 1', status: 'Status 1' }],
      total: 1,
    })

    // Configure permission-related props
    props.config.withCreateBtn = true
    props.config.onePermissionKey = 'test-super'
    props.config.noPermissionPrefix = true

    const wrapper = getMountComponent(props, global)

    console.log(wrapper.html(), '11')
  })

  // it('Should display create, update, and delete buttons based on onePermissionKey', () => {
  //   mockDispatch.mockResolvedValueOnce({
  //     list: [{ id: 1, name: 'Item 1', type: 'Type 1', status: 'Status 1' }],
  //     total: 1,
  //   })
  //
  //   // Configure permission-related props
  //   props.config.withCreateBtn = true
  //   props.config.onePermissionKey = 'test-super'
  //   props.config.noPermissionPrefix = true
  //
  //   const wrapper = getMountComponent(props, global)
  //
  //   // Check that the action buttons are rendered based on permissions
  //   testOn.existElement({ wrapper, testId: 'right-search-btn' })
  // })
})
