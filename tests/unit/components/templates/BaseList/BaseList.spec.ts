import { beforeEach, describe, expect, it, vi } from 'vitest'
import { cloneDeep } from 'lodash'
import { createStore } from 'vuex'
import { flushPromises } from '@vue/test-utils'
import BaseList from '../../../../../src/components/templates/BaseList/index.vue'
import { clickTrigger, getSelectorTestId, setMountComponent } from '../../../utils'
import { TableField } from '../../../../../src/@model/templates/tableFields'
import type { UseListType } from '../../../../../src/@model/templates/baseList'
import { ExportFormat } from '../../../../../src/@model/templates/baseList'
import { mockModal } from '../../../mocks/modal-provide-config'
import { testOn } from '../../../templates/shared-tests/test-case-generator'
import { FilterID } from '../../../../../src/@model/filter'
import type { PermissionLevel } from '../../../../../src/@model/permission'
import { AllPermission, Permission } from '../../../../../src/@model/permission'
import useToastService from '../../../../../src/helpers/toasts'
import { exportDataMock } from '../../../mocks/base-list'

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
  modules: {
    baseStoreCore: {
      namespaced: true,
      actions: {
        fetchEntityList: vi.fn(),
        fetchReport: vi.fn(),
      },
    },
  },
  state: {
    accessLevels: ['noaccess', 'view', 'create', 'update', 'delete'],
    userInfo: {
      permissions: [
        {
          target: 'demo-demo',
          access: 4,
        },
        {
          target: 'demo-demo-report',
          access: 1,
        },
        {
          target: 'demo-demo-seo',
          access: 3,
        },
      ].map((permission: any) => new Permission(permission)),
    },
    permissions: new AllPermission(),
    selectedProduct: null,
    selectedProject: null,
  },
  getters: {
    isLoadingEndpoint: () => () => false,
    userInfo: state => state.userInfo,
    selectedProject: state => state.selectedProject,
    selectedProduct: state => state.selectedProduct,
    accessLevels: state => state.accessLevels,
    abilityCan:
      ({ accessLevels, userInfo }) =>
        (target: string, access: number | PermissionLevel) => {
          if (typeof access === 'string')
            access = accessLevels.indexOf(access.toLowerCase())

          const permission = userInfo.permissions.find(permission => permission.target === target)

          return permission && permission.access >= access
        },
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
    ListFilterModel: FilterID,
    entityName: 'Demo',
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
      getRoutes: vi.fn(() => [
        { name: 'DemoCreate', path: '/demo/create' }, // Добавляем маршрут
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

/// demo-test-list-report
vi.mock('@permissions', () => ({
  default: {
    demoPage: [
      {
        type: 'table',
        target: 'test',
      },
      {
        type: 'switch',
        target: 'demo-test-list-report',
      },
      {
        type: 'table',
        target: 'test-seo',
        notAccessLevel: [4],
      },
    ],
  },
}))

vi.mock('../../../../../src/helpers/toasts', () => {
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
    exportDataMock()
    props = cloneDeep(defaultProps)
  })

  //
  // afterEach(() => {
  //   vi.restoreAllMocks() // Очистка моков
  // })

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

  it('Test on render search input by props:  withSearch,hideSearchBlock ', async () => {
    const mockDispatch = vi.spyOn(mockStore, 'dispatch')

    mockDispatch.mockResolvedValueOnce({
      list: [],
      total: 1,
    })

    props.config.withSearch = true

    const wrapper = getMountBaseList(props, global)

    testOn.existElement({ wrapper, testId: 'search-input' })

    await wrapper.setProps({
      ...props,
      config: {
        ...props.config,
        hideSearchBlock: true,
      },
    })

    testOn.notExistElement({ wrapper, testId: 'search-input' })
  })

  /// TODO Add test on withDeactivationBySpecificAction for ItemActions

  it('Check params for using staticFilters ', async () => {
    const filterParams = { id: 2 }
    const mockDispatch = vi.spyOn(mockStore, 'dispatch')

    mockDispatch.mockResolvedValueOnce({
      list: [],
      total: 1,
    })

    props.config.staticFilters = filterParams

    getMountBaseList(props, global)

    await flushPromises()
    expect(mockDispatch).toHaveBeenCalledWith('baseStoreCore/fetchEntityList', {
      data: {
        filter: new FilterID(filterParams),
        page: 1,
        perPage: 10,
        sort: null,
      },
      options: {
        customApiPrefix: undefined,
        listItemModel: undefined,
      },
      type: 'Demo',
    })
  })

  /// TODO try make check on call await store.dispatch(fetchReportActionName when not exist maxExportItems and when exist
  /// TODO: Add tests for the following props:
  /// - withCreateBtn
  /// - onePermissionKey
  /// - withCustomFetchList
  /// - withCustomDelete
  /// - noPermissionPrefix
  /// - permissionKey
  /// - customModuleName
  /// - customApiPrefix
  /// - customPermissionPrefix
  /// - loadingOnlyByList
  /// - loadingEndpointArr

  it('Check params for using maxExportItems ', async () => {
    const { toastError } = useToastService()
    const maxExportItems = 100
    const mockDispatch = vi.spyOn(mockStore, 'dispatch')

    mockDispatch.mockResolvedValueOnce({
      list: [],
      total: 101,
    })

    props.config.maxExportItems = maxExportItems
    props.config.withExport = true
    props.config.formatOfExports = [ExportFormat.CSV]

    const wrapper = getMountBaseList(props, global)

    await flushPromises()

    await clickTrigger({ wrapper, testId: 'menu-activator' })

    expect(toastError).toHaveBeenCalled()
  })

  it('Check event on export data list', async () => {
    const { toastError } = useToastService()
    const mockDispatch = vi.spyOn(mockStore, 'dispatch')

    mockDispatch.mockResolvedValueOnce({
      list: [],
      total: 100,
    })

    props.config.withExport = true

    const wrapper = getMountBaseList(props, global)

    await flushPromises()

    await clickTrigger({ wrapper, testId: 'menu-activator' })
    await clickTrigger({ wrapper, testId: 'export-json' })

    expect(toastError).toHaveBeenCalled()
  })

  it('Check event on export data list', () => {
    const mockDispatch = vi.spyOn(mockStore, 'dispatch')

    mockDispatch.mockResolvedValueOnce({
      list: [],
      total: 100,
    })

    props.config.withCreateBtn = true

    const wrapper = getMountBaseList(props, global)

    testOn.existElement({ wrapper, testId: 'right-search-btn' })
  })
})
