import { vi } from 'vitest'
import { mockBaseStoreCore } from './utils'

vi.mock('../../../../src/helpers/base-permissions', () => ({
  basePermissions: vi.fn(() => ({
    canCreateSeo: true,
    canUpdate: true,
    canUpdateSeo: false,
    canRemove: false,
    canViewSeo: true,
  })),
}))

vi.mock('../../../../src/components/templates/BaseSection/composables/tabs', () => ({
  setTabError: vi.fn(),
}))

vi.mock('../../../../src/stores/baseStoreCore', () => ({
  useBaseStoreCore: () => mockBaseStoreCore,
}))

vi.mock('path/to/generateEntityUrl', () => ({
  generateEntityUrl: vi.fn(() => '/mock-entity-url'),
}))
