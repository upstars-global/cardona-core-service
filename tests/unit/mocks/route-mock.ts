import { vi } from 'vitest'
import {mockBaseStoreCore} from "./base-list-config";

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


vi.mock('@/stores/users', () => ({
  useUsersStore: () => ({
    fetchUsersList: vi.fn(),
    fetchEntityList: vi.fn(),
    updateUserPassword: vi.fn(),
  }),
}))

vi.mock('@/stores/baseStoreCore', () => ({
  useBaseStoreCore: () => ({
    ...mockBaseStoreCore,
    isLoading: false,
    selectedItems: [],
  }),
}))

vi.mock('../../../../../src/stores/users', () => {
  return {
    useUsersStore: () => ({
      fetchUsersList: vi.fn(),
      fetchEntityList: vi.fn(),
      updateUserPassword: vi.fn(),
    }),
  }
})
