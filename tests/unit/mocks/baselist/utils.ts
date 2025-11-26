import { vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { FilterID } from '../../../../src/@model/filter'
import { ListFieldType, TableField } from '../../../../src/@model/templates/tableFields'
import { testOn } from '../../templates/shared-tests/test-case-generator'
import { clickTrigger } from '../../utils'
import { fields } from './mock'

export const fetchEntityList = vi.fn().mockResolvedValue({
  list: [{
    id: 1,
    name: 'Item 1',
    type: 'Type 1',
    status: 'Status 1',
  }],
  total: 1,
})
export const updateEntity = vi.fn()
export const fetchReport = vi.fn()
export const toggleStatusEntity = vi.fn()
export const deleteEntity = vi.fn()
export const multipleDeleteEntity = vi.fn()

export const mockBaseStoreCore = {
  fetchEntityList,
  updateEntity,
  fetchReport,
  toggleStatusEntity,
  deleteEntity,
  multipleDeleteEntity,
}

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

export const runActionToggleState = async wrapper => {
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

  await flushPromises()

  // Verify that the pill-status element exists
  testOn.existElement({ wrapper, testId: 'pill-status' })

  // Simulate user interactions to toggle status
  await clickTrigger({ wrapper, testId: 'activator' })
  await clickTrigger({ wrapper, testId: 'status-toggle' })
}

export const getUpdatePropsConfig = (updatedConfig, props) => ({
  ...props,
  config: {
    ...props.config,
    ...updatedConfig,
  },
})

export const getSelectorCField = (name: string) => `td[data-c-field="${name}"]`
