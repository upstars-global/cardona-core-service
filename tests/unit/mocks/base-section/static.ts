import { vi } from 'vitest'
import { goMock, mockBaseStoreCore, pushMock } from './utils'

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

const routes = [
  { path: '/mock-form-list', name: 'mock-formList', component: { template: '<div>Mock Form List</div>' } },
]

vi.mock('vue-router', async importOriginal => {
  const actual = await importOriginal()

  return {
    ...actual,
    useRoute: vi.fn(() => ({
      params: { id: '123' },
      routes,
      name: 'TestRoute',
      options: {
        history: {
          state: {
            back: true,
          },
        },
      },
    })),
    useRouter: vi.fn(() => ({
      push: pushMock,
      go: goMock,
      options: {
        history: {
          state: {
            back: true,
          },
        },
      },
    })),
  }
})
