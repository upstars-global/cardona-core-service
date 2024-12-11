import { beforeEach, describe, expect, it, vi } from 'vitest'
import { cloneDeep } from 'lodash'
import { flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import BaseList from '../../../../../src/components/templates/BaseList/index.vue'
import { clickTrigger, getSelectorTestId, setMountComponent } from '../../../utils'
import { BaseListActionsSlots, ExportFormat } from '../../../../../src/@model/templates/baseList'
import { mockModal } from '../../../mocks/modal-provide-config'
import { testOn } from '../../../templates/shared-tests/test-case-generator'
import { FilterID } from '../../../../../src/@model/filter'
import { defaultProps, exportDataMock, fields, mockStore, useListForToggleStatus } from '../../../mocks/base-list'
import useToastService from '../../../../../src/helpers/toasts'

const getSelectorCField = (name: string) => `td[data-c-field="${name}"]`

const getMountBaseList = setMountComponent(BaseList)

const getUpdatePropsConfig = (updatedtConfig, props) => ({
  ...props,
  config: {
    ...props.config,
    ...updatedtConfig,
  },
})

const runTestOnToggleStatus = async (props, expectedAction: string) => {
  props.useList = useListForToggleStatus

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

  testOn.existElement({ wrapper, testId: 'pill-status' })

  await clickTrigger({ wrapper, testId: 'activator' })

  await clickTrigger({ wrapper, testId: 'status-toggle' })

  expect(mockDispatch.mock.calls[1][0]).toBe(expectedAction)
}

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

  it('Toggle status by props withDeactivation', async () => {
    props.config.withDeactivation = true
    await runTestOnToggleStatus(props, 'baseStoreCore/updateEntity')
  })

  it('Toggle status by props withDeactivationBySpecificAction', async () => {
    props.config.withDeactivationBySpecificAction = true
    await runTestOnToggleStatus(props, 'baseStoreCore/toggleStatusEntity')
  })

  it('Check correct render slots content', async () => {
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

    /// Test on render slot content and params
    testOn.existTextValue({ wrapper, testId: 'table-header' }, 'selectedItems,total,search')

    /// Test on render slot content and params

    await wrapper.setProps(getUpdatePropsConfig({ withSettings: true }, props))

    testOn.existElement({ wrapper, testId: 'table-field-setting' })

    await wrapper.setProps(getUpdatePropsConfig({ withSettings: false }, props))

    /// Check on render slot "multiple-actions"

    await wrapper.setProps(getUpdatePropsConfig({ withMultipleActions: true }, props))

    wrapper.vm.selectedItems = [{ id: '123' }]
    await wrapper.vm.$nextTick()

    testOn.existElement({ wrapper, testId: 'multiple-actions' })

    wrapper.vm.selectedItems = []
    await wrapper.vm.$nextTick()

    /// Test slot of cell content

    fields.forEach(field => {
      testOn.equalTextValue({ wrapper, testId: `${field.key}-slot` }, field.title)
    })
  })

  it('Toggle status by props withDeactivation ', async () => {
    const slots = {
      [BaseListActionsSlots.AppendActionItem]: `<div data-test-id="${BaseListActionsSlots.AppendActionItem}">${BaseListActionsSlots.AppendActionItem}</div>`,
      [BaseListActionsSlots.PrependActionItem]: `<div data-test-id="${BaseListActionsSlots.PrependActionItem}">${BaseListActionsSlots.PrependActionItem}</div>`,
    }

    props.useList = useListForToggleStatus

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
    await clickTrigger({ wrapper, testId: 'activator' })

    testOn.equalTextValue({ wrapper, testId: BaseListActionsSlots.AppendActionItem }, BaseListActionsSlots.AppendActionItem)
    testOn.equalTextValue({ wrapper, testId: BaseListActionsSlots.PrependActionItem }, BaseListActionsSlots.PrependActionItem)
  })

  it('Render empty slot', async () => {
    const slots = {
      empty: '<div data-test-id="empty-list">Empty text</div>',
    }

    props.useList = useListForToggleStatus

    mockDispatch.mockResolvedValueOnce({
      list: [],
      total: 0,
    })

    const wrapper = getMountBaseList(props, global, slots)

    await flushPromises()

    testOn.equalTextValue({ wrapper, testId: 'empty-list' }, 'Empty text')
  })

  it('Check that list  has not render pagination', async () => {
    mockDispatch.mockResolvedValueOnce({
      list: [],
      total: 0,
    })

    const wrapper = getMountBaseList(props, global)

    await flushPromises()

    testOn.notExistElement({ wrapper, testId: 'list-pagination' })
  })

  it('Check on call event rowClicked', async () => {
    const wrapper = getMountBaseList(props, global)

    await flushPromises()

    await clickTrigger({ wrapper, testId: 'table-row' })

    testOn.isCalledEmitEventValue(wrapper, { event: 'rowClicked', value: { id: 1, name: 'Item 1', type: 'Type 1', status: 'Status 1' } })
  })
  it('Check open modal remove of item list', async () => {
    props.useList = useListForToggleStatus

    const modalSpy = vi.spyOn(mockModal, 'showModal')

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
    await clickTrigger({ wrapper, testId: 'activator' })

    testOn.existElement({ wrapper, testId: 'remove' })

    await clickTrigger({ wrapper, testId: 'remove' })

    expect(modalSpy).toHaveBeenCalledWith('list-item-remove-modal')
  })
})
