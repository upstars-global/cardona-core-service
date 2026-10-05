import { vi } from 'vitest'
import { createLoaderStoreMock } from '../shared/createLoaderStoreMock'
import { mockBaseStoreCore } from './utils'

// vi.hoisted guarantees this runs as part of the same hoisting pass as the vi.mock calls below,
// in declaration order — a plain `const` here raced a transitive consumer that calls
// useUserStore() this early (e.g. a Pinia store module whose state() factory calls it eagerly),
// throwing "Cannot access 'projects' before initialization" in real-world import graphs.
// (vi.hoisted's result can't be exported directly — Vitest rejects `export const x = vi.hoisted(...)`.)
const projects = vi.hoisted(() => [
  { id: 'p1', alias: 'alpha', name: 'Project A' },
  { id: 'p2', alias: 'beta', name: 'Project B' },
])

export { projects }

export const loaderStoreMock = createLoaderStoreMock()

vi.mock('../../../../src/stores/appConfigCore', () => {
  return {
    useAppConfigCoreStore: () => ({
      verifiedProjects: projects,
    }),
  }
})

vi.mock('../../../../src/stores/loader', () => ({
  useLoaderStore: () => loaderStoreMock.mock,
}))

vi.mock('../../../../src/stores/user', () => {
  return {
    useUserStore: () => ({
      getSelectedProject: projects[0],
    }),
  }
})

vi.mock('../../../../src/stores/users', () => {
  return {
    useUsersStore: () => ({
      fetchUsersList: vi.fn(),
      fetchEntityList: vi.fn(),
      updateUserPassword: vi.fn(),
    }),
  }
})

export const permissionsMock = {
  canCreate: true,
  canUpdate: true,
  canUpdateSeo: true,
  canRemove: true,
  canExport: true,
}

vi.mock('../../../../src/helpers/base-permissions', () => ({
  basePermissions: () => ({ ...permissionsMock }),
}))

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
vi.mock('../../../../src/helpers/toasts', () => {
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

vi.mock('../../../../src/stores/baseStoreCore', () => ({
  useBaseStoreCore: () => ({
    ...mockBaseStoreCore,
    isLoading: false,
    selectedItems: [],
  }),
}))
