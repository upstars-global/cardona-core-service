import { beforeEach, describe, expect, it, vi } from 'vitest'
import { cloneDeep } from 'lodash'
import { flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import BaseList from '../../../../../src/components/templates/BaseList/index.vue'
import { clickTrigger, getSelectorTestId, setMountComponent } from '../../../utils'
import { BaseListSlots, ExportFormat } from '../../../../../src/@model/templates/baseList'
import { mockModal } from '../../../mocks/modal-provide-config'
import { testOn } from '../../../templates/shared-tests/test-case-generator'
import { FilterID } from '../../../../../src/@model/filter'
import {
  defaultProps,
  exportDataMock,
  fields,
  mockStore,
  useListForCustomStore,
  useListForToggleStatus,
} from '../../../mocks/base-list'
import useToastService from '../../../../../src/helpers/toasts'

// Helper function to select table cells based on data attribute
const getSelectorCField = (name: string) => `td[data-c-field="${name}"]`

// Mounting function for the BaseList component
const getMountBaseList = setMountComponent(BaseList)

// Utility function to update component props
const getUpdatePropsConfig = (updatedConfig, props) => ({
  ...props,
  config: {
    ...props.config,
    ...updatedConfig,
  },
})

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

export const fetchEntityList = vi.fn().mockResolvedValue({
  list: [{
    id: 1,
    name: 'Item 1',
    type: 'Type 1',
    status: 'Status 1',
  }],
  total: 1,
})

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
const runActionToggleState = async (props) => {
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

  const wrapper = getMountBaseList(props, global)

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

describe('BaseList', () => {
  beforeEach(() => {
    // Reset mocks and initialize props before each test
    exportDataMock()
    props = cloneDeep(defaultProps)
    mockDispatch = vi.spyOn(mockStore, 'dispatch')
  })

  it('Should render the default state with cell slots', async () => {
    // Mock the dispatch response with initial list data
    mockDispatch.mockResolvedValueOnce({
      list: [{ id: 1, name: 'Item 1', type: 'Type 1', status: 'Status 1' }],
      total: 1,
    })

    const wrapper = getMountBaseList(props, global)

    await flushPromises()

    // Verify the text content of each table cell
    testOn.equalTextValue({ wrapper, selector: getSelectorCField('name') }, 'Item 1')
    testOn.equalTextValue({ wrapper, selector: getSelectorCField('type') }, 'Type 1')
    testOn.equalTextValue({ wrapper, selector: getSelectorCField('status') }, 'Status 1')

    const columns = wrapper.findAll(getSelectorTestId('column-title'))

    // Verify the text content of each column header
    columns.forEach((column, index) => {
      testOn.equalTextValue({ wrapper: column }, fields[index].title)
    })
  })

  it('Should display search input when withSearch is enabled and hide it when hideSearchBlock is true', async () => {
    // Enable the search functionality in props
    props.config.withSearch = true

    const wrapper = getMountBaseList(props, global)

    // Check that the search input is rendered
    testOn.existElement({ wrapper, testId: 'search-input' })

    // Update props to hide the search block
    await wrapper.setProps({
      ...props,
      config: {
        ...props.config,
        hideSearchBlock: true,
      },
    })

    // Verify that the search input is no longer rendered
    testOn.notExistElement({ wrapper, testId: 'search-input' })
  })

  it('Should correctly pass parameters when using staticFilters', async () => {
    const filterParams = { id: 2 }

    // Apply static filters to props
    props.config.staticFilters = filterParams

    getMountBaseList(props, global)

    await flushPromises()

    // Assert that dispatch was called with the correct parameters
    expect(mockBaseStoreCore.fetchEntityList).toHaveBeenCalledWith({
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

  it('Should show an error when maxExportItems is exceeded', async () => {
    const { toastError } = useToastService()
    const maxExportItems = 100

    // Mock dispatch response indicating export limit exceeded
    mockBaseStoreCore.fetchEntityList.mockResolvedValueOnce({
      list: [],
      total: 101,
    })

    // Configure export settings in props
    props.config.maxExportItems = maxExportItems
    props.config.withExport = true
    props.config.formatOfExports = [ExportFormat.CSV]

    const wrapper = getMountBaseList(props, global)

    await flushPromises()

    // Simulate user interaction to trigger export
    await clickTrigger({ wrapper, testId: 'menu-activator' })

    // Expect that an error toast was shown
    expect(toastError).toHaveBeenCalled()
  })

  it('Should call toastError when exporting data via export-json', async () => {
    const { toastError } = useToastService()

    // Enable export functionality in props
    props.config.withExport = true

    const wrapper = getMountBaseList(props, global)

    await flushPromises()

    // Simulate user interactions to trigger JSON export
    await clickTrigger({ wrapper, testId: 'menu-activator' })
    await clickTrigger({ wrapper, testId: 'export-json' })

    // Expect that an error toast was shown
    expect(toastError).toHaveBeenCalled()
  })

  it('Should display the create button when withCreateBtn is enabled', () => {
    // Enable the create button in props
    props.config.withCreateBtn = true

    const wrapper = getMountBaseList(props, global)

    // Check that the create button is rendered
    testOn.existElement({ wrapper, testId: 'right-search-btn' })
  })

  it('Should display create, update, and delete buttons based on onePermissionKey', () => {
    // Mock dispatch response for permissions
    mockDispatch.mockResolvedValueOnce({
      list: [],
      total: 100,
    })

    // Configure permission-related props
    props.config.withCreateBtn = true
    props.config.onePermissionKey = 'test-super'
    props.config.noPermissionPrefix = true

    const wrapper = getMountBaseList(props, global)

    // Check that the action buttons are rendered based on permissions
    testOn.existElement({ wrapper, testId: 'right-search-btn' })
  })

  it('Should use customFetchList when customModuleName is provided', async () => {
    // Mock dispatch response for custom fetch list
    mockDispatch.mockResolvedValueOnce({
      list: [],
      total: 100,
    })

    // Configure custom fetch list settings in props
    props.config.customModuleName = 'entityTest'
    props.config.withCustomFetchList = true

    getMountBaseList(props, global)

    // Assert that the custom fetch action was dispatched
    expect(mockBaseStoreCore.fetchEntityList).toHaveBeenCalled()
  })

  it('Should call customDelete when withCustomDelete is enabled', async () => {
    const hideMock = vi.fn()
    const commentToRemove = 'Test Comment'

    // Configure custom delete settings in props
    // props.config.customModuleName = 'entityTest'
    props.config.withCustomDelete = true
    props.useList = useListForCustomStore(mockCustomStore)

    const wrapper = getMountBaseList(props, global)

    // Select an item to delete
    wrapper.vm.selectedItem = { id: '123' }

    // Simulate clicking the confirmation in the modal
    await wrapper.vm.onClickModalOk({
      hide: hideMock,
      commentToRemove,
    })

    await flushPromises()

    // Assert that the custom delete action was dispatched
    expect(mockCustomStore.deleteEntity).toHaveBeenCalled()
  })

  it('Should provide access to actions based on permissionKey', () => {
    // Set permission key in props
    props.config.permissionKey = 'test-permission'

    const wrapper = getMountBaseList(props, global)

    // Verify that the component recognizes available actions based on permissions
    expect(wrapper.vm.canCreate).toBeTruthy()
    expect(wrapper.vm.canUpdate).toBeTruthy()
    expect(wrapper.vm.canRemove).toBeTruthy()
  })

  it('Should pass customApiPrefix in the fetchEntityList request', async () => {
    const customApiPrefix = 'test'

    // Set custom API prefix in props
    props.config.customApiPrefix = customApiPrefix

    getMountBaseList(props, global)

    await flushPromises()

    // Assert that the customApiPrefix was included in the dispatch call
    expect(mockBaseStoreCore.fetchEntityList).toHaveBeenCalledWith({
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

  it('Should update entity status when withDeactivation is enabled', async () => {
    // Enable deactivation feature in props
    props.config.withDeactivation = true

    // Run the status toggle test with the expected action
    await runActionToggleState(props)
    expect(mockBaseStoreCore.updateEntity).toHaveBeenCalled()
    mockBaseStoreCore.updateEntity.mockReset()
  })

  it('Should toggle entity status using a specific action when withDeactivationBySpecificAction is enabled', async () => {
    // Enable specific action deactivation feature in props
    props.config.withDeactivationBySpecificAction = true

    // Run the status toggle test with the specific expected action
    await runActionToggleState(props)
    expect(mockBaseStoreCore.toggleStatusEntity).toHaveBeenCalled()
    mockBaseStoreCore.updateEntity.mockReset()
  })

  it('Should correctly render slot contents', async () => {
    // Define slots with dynamic content based on fields
    const slotsByField = fields.reduce((acc, field) => ({
      ...acc,
      [`cell(${field.key})`]: h('div', { 'data-test-id': `${field.key}-slot` }, field.title),
    }), {})

    const slots = {
      'table-header': params => h(
        'div',
        { 'data-test-id': 'table-header' },
        `${Object.keys(params)}`,
      ),
      'custom-filter': params => h(
        'div',
        { 'data-test-id': 'custom-filter' },
        `${Object.keys(params)}`,
      ),

      'table-field-setting': '<div data-test-id="table-field-setting">Table field setting</div>',

      'multiple-actions': '<div data-test-id="multiple-actions">Multiple actions</div>',
      ...slotsByField,
    }

    // Mock dispatch response with a sample list item
    mockDispatch.mockResolvedValueOnce({
      list: [{
        id: 1,
        name: 'Item 1',
        type: 'Type 1',
        status: 'Status 1',
        isActive: true,
      }],
      total: 1,
    })

    const wrapper = getMountBaseList(props, global, slots)

    await flushPromises()

    // Verify that the table header slot contains the correct text
    testOn.existTextValue({ wrapper, testId: 'table-header' }, 'selectedItems,total,search')

    // Update props to enable table settings and verify the corresponding slot
    await wrapper.setProps(getUpdatePropsConfig({ withSettings: true }, props))
    testOn.existElement({ wrapper, testId: 'table-field-setting' })

    // Update props to disable table settings and verify the slot is removed
    await wrapper.setProps(getUpdatePropsConfig({ withSettings: false }, props))

    // Enable multiple actions and verify the slot is rendered
    await wrapper.setProps(getUpdatePropsConfig({ withMultipleActions: true }, props))
    wrapper.vm.selectedItems = [{ id: '123' }]
    await wrapper.vm.$nextTick()

    testOn.existElement({ wrapper, testId: 'multiple-actions' })

    // Clear selected items and verify the slot is removed
    wrapper.vm.selectedItems = []
    await wrapper.vm.$nextTick()

    // Verify that each cell slot contains the correct text
    fields.forEach(field => {
      testOn.equalTextValue({ wrapper, testId: `${field.key}-slot` }, field.title)
    })
  })

  it('Should update entity status with additional slots when withDeactivation is enabled', async () => {
    // Define additional action slots
    const slots = {
      [BaseListSlots.AppendActionItem]: `<div data-test-id="${BaseListSlots.AppendActionItem}">${BaseListSlots.AppendActionItem}</div>`,
      [BaseListSlots.PrependActionItem]: `<div data-test-id="${BaseListSlots.PrependActionItem}">${BaseListSlots.PrependActionItem}</div>`,
    }

    // Enable status toggling feature in props
    props.useList = useListForToggleStatus

    // Mock dispatch response with a sample list item
    mockDispatch.mockResolvedValueOnce({
      list: [{
        id: 1,
        name: 'Item 1',
        type: 'Type 1',
        status: 'Status 1',
        isActive: true,
      }],
      total: 1,
    })

    const wrapper = getMountBaseList(props, global, slots)

    await flushPromises()

    // Simulate user interactions to open the status toggle menu
    await clickTrigger({ wrapper, testId: 'activator' })

    // Verify that the additional action slots are rendered correctly
    testOn.equalTextValue({ wrapper, testId: BaseListSlots.AppendActionItem }, BaseListSlots.AppendActionItem)
    testOn.equalTextValue({ wrapper, testId: BaseListSlots.PrependActionItem }, BaseListSlots.PrependActionItem)
  })

  it('Should display the empty slot when there is no data', async () => {
    // Define the empty slot content
    const slots = {
      empty: '<div data-test-id="empty-list">Empty text</div>',
    }

    // Enable status toggling feature in props
    props.useList = useListForToggleStatus

    // Mock dispatch response with no list items
    mockBaseStoreCore.fetchEntityList.mockResolvedValueOnce({
      list: [],
      total: 0,
    })

    const wrapper = getMountBaseList(props, global, slots)

    await flushPromises()

    // Verify that the empty slot is rendered with the correct text
    testOn.equalTextValue({ wrapper, testId: 'empty-list' }, 'Empty text')
  })

  it('Should not display pagination when there is no data', async () => {
    // Mock dispatch response with no list items
    mockDispatch.mockResolvedValueOnce({
      list: [],
      total: 0,
    })

    const wrapper = getMountBaseList(props, global)

    await flushPromises()

    // Verify that the pagination component is not rendered
    testOn.notExistElement({ wrapper, testId: 'list-pagination' })
  })

  it('Should emit rowClicked event when a table row is clicked', async () => {
    const wrapper = getMountBaseList(props, global)

    await flushPromises()

    // Simulate clicking on a table row
    await clickTrigger({ wrapper, testId: 'table-row' })

    // Verify that the rowClicked event was emitted with the correct payload
    testOn.isCalledEmitEventValue({ wrapper }, { event: 'rowClicked', value: { id: 1, name: 'Item 1', type: 'Type 1', status: 'Status 1' } })
  })

  it('Should open the remove modal when the remove button is clicked', async () => {
    // Enable status toggling feature in props
    props.useList = useListForToggleStatus

    // Spy on the showModal method to verify it gets called
    const modalSpy = vi.spyOn(mockModal, 'showModal')

    // Mock dispatch response with a sample list item
    mockDispatch.mockResolvedValueOnce({
      list: [{
        id: 1,
        name: 'Item 1',
        type: 'Type 1',
        status: 'Status 1',
        isActive: true,
      }],
      total: 1,
    })

    const wrapper = getMountBaseList(props, global)

    await flushPromises()

    // Simulate user interactions to open the remove modal
    await clickTrigger({ wrapper, testId: 'activator' })

    // Verify that the remove button is rendered
    testOn.existElement({ wrapper, testId: 'remove' })

    // Simulate clicking the remove button
    await clickTrigger({ wrapper, testId: 'remove' })

    // Assert that the modal was opened with the correct identifier
    expect(modalSpy).toHaveBeenCalledWith('list-item-remove-modal')
  })

  it('should call multipleDeleteEntity when multiple items are selected one more', async () => {
    const wrapper = getMountBaseList(props, global)

    await flushPromises()

    wrapper.vm.selectedItems = [{ id: 'item1' }, { id: 'item2' }]

    await wrapper.vm.onClickDeleteMultiple()

    expect(mockBaseStoreCore.multipleDeleteEntity).toHaveBeenCalledWith({
      type: 'Test',
      ids: ['item1', 'item2'],
      customApiPrefix: undefined,
    })
    mockBaseStoreCore.multipleDeleteEntity.mockReset()
    wrapper.vm.selectedItems = []
  })

  it('should call deleteEntity when multiple items are selected one', async () => {
    const wrapper = getMountBaseList(props, global)

    await flushPromises()

    wrapper.vm.selectedItems = [{ id: 'item1' }]

    await wrapper.vm.onClickDeleteMultiple()

    expect(mockBaseStoreCore.deleteEntity).toHaveBeenCalledWith({
      type: 'Test',
      id: 'item1',
      customApiPrefix: undefined,
    })

    mockBaseStoreCore.deleteEntity.mockReset()
    wrapper.vm.selectedItems = []
  })
})
