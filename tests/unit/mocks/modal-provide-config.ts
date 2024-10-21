import { vi } from 'vitest'

export const mockModal = {
  showModal: vi.fn(),
  hideModal: vi.fn(),
  registerModal: vi.fn(),
  unregisterModal: vi.fn(),
  modals: {},
}
