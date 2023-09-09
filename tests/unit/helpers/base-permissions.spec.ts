import { basePermissions } from '../../../src/helpers/base-permissions'
import store from '../../../src/store'

const accessLevels = ['noaccess', 'view', 'create', 'update', 'delete']

const userInfoVariants = [
  {
    id: 1,
    fullName: 'John Doe',
    username: 'johndoe',
    password: 'admin',
    email: 'admin@demo.com',
    role: 'admin',
    permissions: [
      {
        target: 'demo-demo',
        access: 4,
      },
      {
        target: 'demo-demo-report',
        access: 4,
      },
      {
        target: 'demo-demo-seo',
        access: 4,
      },
    ],
  },
  {
    id: 2,
    fullName: 'Jane Smith',
    username: 'janesmith',
    password: 'user',
    email: 'user@demo.com',
    role: 'user',
    permissions: [
      {
        target: 'demo-demo',
        access: 2,
      },
      {
        target: 'demo-demo-report',
        access: 2,
      },
      {
        target: 'demo-demo-seo',
        access: 1,
      },
    ],
  },
]

const expectedResults = [
  {
    canCreate: true,
    canUpdate: true,
    canUpdateSeo: true,
    canCreateSeo: true,
    canViewSeo: true,
    canRemove: true,
    canExport: true,
  },
  {
    canCreate: true,
    canUpdate: false,
    canUpdateSeo: false,
    canCreateSeo: false,
    canViewSeo: true,
    canRemove: false,
    canExport: true,
  },
]

jest.mock('../../../src/store', () => {
  const initialState = {
    userInfo: userInfoVariants[0],
    accessLevels,
  }

  return {
    state: { ...initialState },
    getters: {
      abilityCan: jest.fn((key, action) => {
        const state = require('../../../src/store').state
        const permission = state.userInfo.permissions.find((p) => p.target === key)
        console.log('!!!!', permission, permission.access, action)
        return permission && permission.access >= action
      }),
    },
  }
})

jest.mock('../../../src/helpers', () => ({
  getPermissionKeys: jest.fn(() => ({
    permissionKey: 'demo-demo',
    permissionKeySeo: 'demo-demo-seo',
    permissionKeyReport: 'demo-demo-report',
  })),
}))

describe('basePermissions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  userInfoVariants.forEach((userInfoVariant, index) => {
    it(`should return permissions correctly for userInfo${index + 1}`, () => {
      const mockedStore = require('../../../src/store')
      mockedStore.state = { userInfo: userInfoVariant, accessLevels }

      const mockAbilityCan = mockedStore.getters.abilityCan as jest.Mock

      mockAbilityCan.mockImplementation((target, access) => {
        if (typeof access === 'string')
          access = store.state.accessLevels.indexOf(access.toLowerCase())

        const permission = userInfoVariant.permissions.find(
          (permission) => permission.target === target
        )

        return permission && permission.access >= access
      })

      const result = basePermissions({
        entityName: 'Demo',
        config: {
          permissionKey: 'demo',
        },
      })

      const expectedResult = expectedResults[index]

      expect(result.canCreate).toBe(expectedResult.canCreate)
      expect(result.canUpdate).toBe(expectedResult.canUpdate)
      expect(result.canUpdateSeo).toBe(expectedResult.canUpdateSeo)
      expect(result.canCreateSeo).toBe(expectedResult.canCreateSeo)
      expect(result.canViewSeo).toBe(expectedResult.canViewSeo)
      expect(result.canRemove).toBe(expectedResult.canRemove)
      expect(result.canExport).toBe(expectedResult.canExport)
    })
  })
})
