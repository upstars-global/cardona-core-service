import { vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { testOn } from '../../templates/shared-tests/test-case-generator'
import { clickTrigger } from '../../utils'
import { mockStore, useListForToggleStatus } from './base-list'
import { mockModal } from '../modal-provide-config'

// ------------------ toasts ------------------
export const toastErrorMock = vi.fn()

vi.mock('@/helpers/toasts', () => ({
  default: vi.fn(() => ({
    toastError: toastErrorMock,
    toastSuccess: vi.fn(),
    toastErrorMessageString: vi.fn(),
  })),
  toastErrorMock,
}))

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

export const mockUseBaseStoreCore = () => {
  vi.mock('@/stores/baseStoreCore', () => ({
    useBaseStoreCore: () => ({
      ...mockBaseStoreCore,
      isLoading: false,
      selectedItems: [],
    }),
  }))
}

// ------------------ global config for mount() ------------------
export const globalConfig = {
  provide: { modal: mockModal },
  plugins: [mockStore],
  components: {
    VueSelect: {
      template: '<select><slot /></select>',
    },
  },
}

export const runActionToggleState = wrapper => async props => {
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

  await flushPromises()

  // Verify that the pill-status element exists
  testOn.existElement({ wrapper, testId: 'pill-status' })

  // Simulate user interactions to toggle status
  await clickTrigger({ wrapper, testId: 'activator' })
  await clickTrigger({ wrapper, testId: 'status-toggle' })
}
