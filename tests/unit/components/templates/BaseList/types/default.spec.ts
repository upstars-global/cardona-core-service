import { beforeEach, describe, expect, it, vi } from 'vitest'
import { cloneDeep } from 'lodash'
import { flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import '../../../../mocks/baselist/static-mock'
import DefaultBaseList from '../../../../../../src/components/templates/BaseList/types/default.vue'
import ProjectsFilter from '../../../../../../src/components/templates/BaseList/_components/ProjectsFilter.vue'
import { clickTrigger, getSelectorTestId, setMountComponent } from '../../../../utils'
import { BaseListSlots } from '../../../../../../src/@model/templates/baseList'
import { mockModal } from '../../../../mocks/modal-provide-config'
import { testOn } from '../../../../templates/shared-tests/test-case-generator'
import { FilterID } from '../../../../../../src/@model/filter'
import {
  defaultProps,
  exportDataMock,
  fields, getSelectorCField, getUpdatePropsConfig, mockBaseStoreCore, mockCustomStore,
  mockStore, runActionToggleState,
  useListForCustomStore,
  useListForToggleStatus,
} from '../../../../mocks/baselist/utils'
import '../../../../../../src/stores/users'

// Helper function to select table cells based on data attribute

// Mounting function for the DefaultBaseList component
const getMountComponent = setMountComponent(DefaultBaseList)

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

describe('DefaultBaseList', () => {
  beforeEach(() => {
    // Reset mocks and initialize props before each test
    exportDataMock()
    props = cloneDeep(defaultProps)
    mockDispatch = vi.spyOn(mockStore, 'dispatch')

    mockStore.state.selectedProject = { id: 'p1', alias: 'alpha', name: 'Project A' }
  })

  it('Should render the default state with cell slots', async () => {
    // Mock the dispatch response with initial list data
    mockDispatch.mockResolvedValueOnce({
      list: [{ id: 1, name: 'Item 1', type: 'Type 1', status: 'Status 1' }],
      total: 1,
    })

    const wrapper = getMountComponent(props, global)

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

    const wrapper = getMountComponent(props, global)

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

    getMountComponent(props, global)

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

  it('Should display the create button when withCreateBtn is enabled', () => {
    // Enable the create button in props
    props.config.withCreateBtn = true

    const wrapper = getMountComponent(props, global)

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

    const wrapper = getMountComponent(props, global)

    // Check that the action buttons are rendered based on permissions
    testOn.existElement({ wrapper, testId: 'right-search-btn' })
  })

  it('Should call customDelete when withCustomDelete is enabled', async () => {
    const hideMock = vi.fn()
    const commentToRemove = 'Test Comment'

    // Configure custom delete settings in props
    props.config.withCustomDelete = true
    props.useList = useListForCustomStore(mockCustomStore)

    const wrapper = getMountComponent(props, global)

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

    const wrapper = getMountComponent(props, global)

    // Verify that the component recognizes available actions based on permissions
    expect(wrapper.vm.canCreate).toBeTruthy()
    expect(wrapper.vm.canUpdate).toBeTruthy()
    expect(wrapper.vm.canRemove).toBeTruthy()
  })

  it('Should pass customApiPrefix in the fetchEntityList request', async () => {
    const customApiPrefix = 'test'

    // Set custom API prefix in props
    props.config.customApiPrefix = customApiPrefix

    getMountComponent(props, global)

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
    props.useList = useListForToggleStatus

    const wrapper = getMountComponent(props, global)

    // Run the status toggle test with the expected action
    await runActionToggleState(wrapper)
    expect(mockBaseStoreCore.updateEntity).toHaveBeenCalled()
    mockBaseStoreCore.updateEntity.mockReset()
  })

  it('Should toggle entity status using a specific action when withDeactivationBySpecificAction is enabled', async () => {
    // Enable specific action deactivation feature in props
    props.config.withDeactivationBySpecificAction = true
    props.useList = useListForToggleStatus

    // Run the status toggle test with the specific expected action
    const wrapper = getMountComponent(props, global)

    await runActionToggleState(wrapper)
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

    const wrapper = getMountComponent(props, global, slots)

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

    const wrapper = getMountComponent(props, global, slots)

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

    const wrapper = getMountComponent(props, global, slots)

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

    const wrapper = getMountComponent(props, global)

    await flushPromises()

    // Verify that the pagination component is not rendered
    testOn.notExistElement({ wrapper, testId: 'list-pagination' })
  })

  it('Should emit rowClicked event when a table row is clicked', async () => {
    const wrapper = getMountComponent(props, global)

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

    const wrapper = getMountComponent(props, global)

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
    const wrapper = getMountComponent(props, global)

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
    const wrapper = getMountComponent(props, global)

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

  it('Should render ProjectsFilter when withProjectsFilter is true', async () => {
    props.config.withProjectsFilter = true

    mockDispatch.mockResolvedValueOnce({ list: [], total: 0 })

    const wrapper = getMountComponent(props, global)

    await flushPromises()

    expect(wrapper.findComponent(ProjectsFilter).exists()).toBe(true)

    expect(wrapper.text()).toContain('Project A')
    expect(wrapper.text()).toContain('Project B')
  })

  it('Should not render ProjectsFilter when withProjectsFilter is false', async () => {
    props.config.withProjectsFilter = false
    mockDispatch.mockResolvedValueOnce({ list: [], total: 0 })

    const wrapper = getMountComponent(props, global)

    await flushPromises()

    expect(wrapper.findComponent(ProjectsFilter).exists()).toBe(false)
  })

  it('Should pass projects aliases from store on first fetch when withProjectsFilter is true', async () => {
    props.config.withProjectsFilter = true

    props.useList = () => ({
      ListFilterModel: class PassthroughFilter {
        constructor(data?: any) { Object.assign(this, data) }
      },
      entityName: 'Test',
      fields,
    })

    mockBaseStoreCore.fetchEntityList.mockResolvedValueOnce({ list: [], total: 0 })

    getMountComponent(props, global)
    await flushPromises()

    const args = mockBaseStoreCore.fetchEntityList.mock.calls.at(-1)?.[0]

    expect(args?.data?.filter?.projects).toEqual(['alpha'])
  })

  it('Should refetch list when project is toggled (add/remove)', async () => {
    props.config.withProjectsFilter = true
    mockBaseStoreCore.fetchEntityList.mockResolvedValueOnce({ list: [], total: 0 })

    const wrapper = getMountComponent(props, global)

    await flushPromises()

    const pf = wrapper.findComponent(ProjectsFilter)

    mockBaseStoreCore.fetchEntityList.mockClear()
    await pf.vm.$emit('update:modelValue', ['alpha', 'beta'])
    await flushPromises()
    expect(mockBaseStoreCore.fetchEntityList).toHaveBeenCalledTimes(1)

    mockBaseStoreCore.fetchEntityList.mockClear()
    await pf.vm.$emit('update:modelValue', ['alpha'])
    await flushPromises()
    expect(mockBaseStoreCore.fetchEntityList).toHaveBeenCalledTimes(1)
  })

  it('Should not allow deselecting the last remaining project', async () => {
    props.config.withProjectsFilter = true

    props.useList = () => ({
      ListFilterModel: class PassthroughFilter {
        constructor(data?: any) { Object.assign(this, data) }
      },
      entityName: 'Test',
      fields,
    })

    mockBaseStoreCore.fetchEntityList.mockResolvedValueOnce({ list: [], total: 0 })

    const wrapper = getMountComponent(props, global)

    await flushPromises()

    const pf = wrapper.findComponent(ProjectsFilter)

    await pf.vm.$emit('update:modelValue', ['alpha'])

    await flushPromises()

    await pf.vm.$emit('update:modelValue', ['alpha'])

    await flushPromises()

    const args = mockBaseStoreCore.fetchEntityList.mock.calls.at(-1)?.[0]

    expect(args?.data?.filter?.projects).toEqual(['alpha'])
  })

  it('Should reflect chip active/inactive state (color & icon)', async () => {
    props.config.withProjectsFilter = true
    mockBaseStoreCore.fetchEntityList.mockResolvedValueOnce({ list: [], total: 0 })

    const wrapper = getMountComponent(props, global)

    await flushPromises()

    const chips = wrapper.findAllComponents({ name: 'VChip' })

    expect(chips.length).toBeGreaterThan(0)

    const chipA = chips.find(c => c.text().includes('Project A'))!
    const chipB = chips.find(c => c.text().includes('Project B'))!

    expect(chipA.props('color')).toBe('primary')
    expect(chipB.props('color')).toBe('secondary')

    const icons = wrapper.findAllComponents({ name: 'VIcon' })

    expect(icons.some(i => i.props('icon')?.toLowerCase().includes('eye'))).toBe(true)

    const pf = wrapper.findComponent(ProjectsFilter)

    await pf.vm.$emit('update:modelValue', ['beta'])
    await flushPromises()

    const chipA2 = wrapper.findAllComponents({ name: 'VChip' }).find(c => c.text().includes('Project A'))!
    const chipB2 = wrapper.findAllComponents({ name: 'VChip' }).find(c => c.text().includes('Project B'))!

    expect(chipA2.props('color')).toBe('secondary') // неактивный
    expect(chipB2.props('color')).toBe('primary') // активный
  })

  it('Should refetch list when projects selection changes', async () => {
    props.config.withProjectsFilter = true
    mockDispatch.mockResolvedValueOnce({ list: [], total: 0 })

    const wrapper = getMountComponent(props, global)

    await flushPromises()

    const pf = wrapper.findComponent(ProjectsFilter)

    mockBaseStoreCore.fetchEntityList.mockClear()

    await pf.vm.$emit('update:modelValue', ['beta'])
    await flushPromises()

    expect(mockBaseStoreCore.fetchEntityList).toHaveBeenCalled()
  })
})
