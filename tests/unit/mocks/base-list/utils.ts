import { vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import type { UseListType } from '../../../../src/@model/templates/baseList'
import { FilterID } from '../../../../src/@model/filter'
import { ListFieldType, TableField } from '../../../../src/@model/templates/tableFields'
import { mockModal } from '../modal-provide-config'
import { clickTrigger, setMountComponent } from '../../utils'
import BaseList from '../../../../src/components/templates/BaseList/index.vue'
import { testOn } from '../../templates/shared-tests/test-case-generator'

export const exportDataMock = () => {
  if (!window.URL.createObjectURL) {
    Object.defineProperty(window.URL, 'createObjectURL', {
      writable: true,
      configurable: true,
      value: vi.fn(() => 'mocked-url'),
    })
  }
  else {
    vi.spyOn(window.URL, 'createObjectURL').mockImplementation(() => 'mocked-url')
  }

  // Мокаем `document.createElement` только для элементов <a>
  const originalCreateElement = document.createElement

  vi.spyOn(document, 'createElement').mockImplementation(tagName => {
    if (tagName === 'a') {
      const anchorElement = originalCreateElement.call(document, 'a')

      vi.spyOn(anchorElement, 'click').mockImplementation(() => {})

      return anchorElement
    }

    return originalCreateElement.call(document, tagName)
  })
}

export const useList = (): UseListType => {
  return {
    ListFilterModel: FilterID,
    entityName: 'Test',
    fields,
  }
}

export const defaultProps = {
  useList,
  config: {
    filterList: [],
    loadingEndpointArr: [],
    loadingOnlyByList: false,
  },
}

export const fields = [
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

export const useListForToggleStatus = () => {
  return {
    ListFilterModel: FilterID,
    entityName: 'Test',
    fields: [
      ...fields,
      new TableField({
        key: 'isActive',
        title: 'Toggle status',
        type: ListFieldType.PillStatus,
      }),
      new TableField({
        key: 'actions',
        title: '',
      }),
    ],
  }
}

export const useListForCustomStore = customStore => () => {
  return {
    useStore: () => customStore,
    ListFilterModel: FilterID,
    entityName: 'Test',
    fields: [
      ...fields,
      new TableField({
        key: 'isActive',
        title: 'Toggle status',
        type: ListFieldType.PillStatus,
      }),
      new TableField({
        key: 'actions',
        title: '',
      }),
    ],
  }
}

export const updateEntity = vi.fn()
export const fetchReport = vi.fn()
export const toggleStatusEntity = vi.fn()
export const deleteEntity = vi.fn()
export const multipleDeleteEntity = vi.fn()

export const fetchEntityList = vi.fn().mockResolvedValue({
  list: [{
    id: 1,
    name: 'Item 1',
    type: 'Type 1',
    status: 'Status 1',
  }],
  total: 1,
})

export const mockBaseStoreCore = {
  fetchEntityList,
  updateEntity,
  multipleDeleteEntity,
  fetchReport,
  toggleStatusEntity,
  deleteEntity,
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
export const modalSpy = vi.spyOn(mockModal, 'showModal')

export const global = {
  provide: { modal: mockModal },
  components: {
    VueSelect: {
      template: '<select><slot /></select>',
    },
  },
}

// Helper function to select table cells based on data attribute
export const getSelectorCField = (name: string) => `td[data-c-field="${name}"]`

// Mounting function for the BaseList component
export const getMountComponent = setMountComponent(BaseList)

// Utility function to update component props
export const getUpdatePropsConfig = (updatedConfig, props) => ({
  ...props,
  config: {
    ...props.config,
    ...updatedConfig,
  },
})

// Function to test toggling the status of an entity
export const runActionToggleState = async props => {
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
