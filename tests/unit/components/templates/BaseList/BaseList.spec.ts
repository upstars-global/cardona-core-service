import { beforeEach, describe, expect, it, vi } from 'vitest'
import { cloneDeep } from 'lodash'
import { flushPromises } from '@vue/test-utils'
import BaseList from '../../../../../src/components/templates/BaseList/index.vue'
import { clickTrigger, getSelectorTestId, setMountComponent } from '../../../utils'
import { ExportFormat } from '../../../../../src/@model/templates/baseList'
import { mockModal } from '../../../mocks/modal-provide-config'
import { testOn } from '../../../templates/shared-tests/test-case-generator'
import { FilterID } from '../../../../../src/@model/filter'
import useToastService from '../../../../../src/helpers/toasts'
import { defaultProps, exportDataMock, fields, mockStore } from '../../../mocks/base-list'

// class ListItemModel {
//   constructor(data) {
//
//   }
// }

const getSelectorCField = (name: string) => `td[data-c-field="${name}"]`

const getMountBaseList = setMountComponent(BaseList)

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

const global = {
  provide: { modal: mockModal },
  plugins: [mockStore],
}

let props
let mockDispatch

describe('BaseList', () => {
  beforeEach(() => {
    exportDataMock()
    props = cloneDeep(defaultProps)
    mockDispatch = vi.spyOn(mockStore, 'dispatch')
  })

  it('Render default state of component with slots of cell', async () => {
    mockDispatch.mockResolvedValueOnce({
      list: [{ id: 1, name: 'Item 1', type: 'Type 1', status: 'Status 1' }],
      total: 1,
    })

    const wrapper = getMountBaseList(props, global)

    await flushPromises()

    /// TD value of table
    testOn.equalTextValue({ wrapper, selector: getSelectorCField('name') }, 'Item 1')
    testOn.equalTextValue({ wrapper, selector: getSelectorCField('type') }, 'Type 1')
    testOn.equalTextValue({ wrapper, selector: getSelectorCField('status') }, 'Status 1')

    const columns = wrapper.findAll(getSelectorTestId('column-title'))

    /// COL value of table
    columns.forEach((column, index) => {
      testOn.equalTextValue({ wrapper: column }, fields[index].title)
    })
  })

  it('Test on render search input by props: withSearch and hideSearchBlock ', async () => {
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

  /// TODO Add test on withDeactivation BySpecificAction for ItemActions

  it('Check params for using staticFilters ', async () => {
    const filterParams = { id: 2 }

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
      type: 'Test',
    })
  })

  it('Check params for using maxExportItems ', async () => {
    const { toastError } = useToastService()
    const maxExportItems = 100

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

    props.config.withExport = true

    const wrapper = getMountBaseList(props, global)

    await flushPromises()

    await clickTrigger({ wrapper, testId: 'menu-activator' })
    await clickTrigger({ wrapper, testId: 'export-json' })

    expect(toastError).toHaveBeenCalled()
  })

  it('Check event on export data list', () => {
    props.config.withCreateBtn = true

    const wrapper = getMountBaseList(props, global)

    testOn.existElement({ wrapper, testId: 'right-search-btn' })
  })

  it('Checking for valid using onePermissionKey', () => {
    mockDispatch.mockResolvedValueOnce({
      list: [],
      total: 100,
    })

    props.config.withCreateBtn = true
    props.config.onePermissionKey = 'test-super'
    props.config.noPermissionPrefix = true

    const wrapper = getMountBaseList(props, global)

    testOn.existElement({ wrapper, testId: 'right-search-btn' })
  })
  it('Using props withCustomFetchList', async () => {
    mockDispatch.mockResolvedValueOnce({
      list: [],
      total: 100,
    })

    props.config.customModuleName = 'entityTest'
    props.config.withCustomFetchList = true

    getMountBaseList(props, global)

    expect(mockDispatch.mock.calls[0][0]).toBe('entityTest/fetchTestList')
  })

  it('Using props withCustomDelete', async () => {
    const hideMock = vi.fn()
    const commentToRemove = 'Test Comment'

    props.config.customModuleName = 'entityTest'

    props.config.withCustomDelete = true

    const wrapper = getMountBaseList(props, global)

    wrapper.vm.selectedItem = { id: '123' }

    await wrapper.vm.onClickModalOk({
      hide: hideMock,
      commentToRemove,
    })

    await flushPromises()

    expect(mockDispatch.mock.calls[1][0]).toBe('entityTest/deleteEntity')
  })

  it('Check access to list by prop permissionKey', () => {
    props.config.permissionKey = 'test-permission'

    const wrapper = getMountBaseList(props, global)

    /// Check access to list from permissionKey
    expect(wrapper.vm.canCreate).toBeTruthy()
    expect(wrapper.vm.canUpdate).toBeTruthy()
    expect(wrapper.vm.canRemove).toBeTruthy()
  })

  it('Check param of customApiPrefix ', async () => {
    const customApiPrefix = 'test'

    props.config.customApiPrefix = customApiPrefix

    getMountBaseList(props, global)

    await flushPromises()
    expect(mockDispatch).toHaveBeenCalledWith('baseStoreCore/fetchEntityList', {
      data: {
        filter: new FilterID({}),
        page: 1,
        perPage: 10,
        sort: null,
      },
      options: {
        customApiPrefix,
        listItemModel: undefined,
      },
      type: 'Test',
    })
  })
})
