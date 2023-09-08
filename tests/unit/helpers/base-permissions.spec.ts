import { basePermissions } from '../../../src/helpers/base-permissions'
import { PermissionLevel } from '../../../src/@model/permission'
import store from '../../../src/store'
import { cloneDeep } from 'lodash'
// Мокаем store и getPermissionKeys

const realStore = cloneDeep(store)

const accessLevels = ['noaccess', 'view', 'create', 'update', 'delete']

const userInfo = {
  id: 111,
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
}

jest.mock('../../../src/store', () => {
  const initialState = {
    userInfo,
    accessLevels,
  }

  return {
    state: { ...initialState }, // Копия начального состояния
    getters: {
      abilityCan: jest.fn((key, action) => {
        const state = require('../../../src/store').state
        const permission = state.userInfo.permissions.find((p) => p.target === key)
        if (permission) {
          return permission.access >= action
        }
        return false
      }),
    },
  }
})

jest.mock('../../../src/helpers', () => ({
  getPermissionKeys: jest.fn(() => ({
    permissionKey: 'demo-demo',
    permissionKeySeo: 'demo-demo-report',
    permissionKeyReport: 'demo-demo-seo',
  })),
}))

describe('basePermissions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return permissions correctly for create action', () => {
    // Задайте начальное состояние вашего хранилища
    const mockedStore = require('../../../src/store')
    mockedStore.state = { userInfo, accessLevels }

    const mockAbilityCan = mockedStore.getters.abilityCan as jest.Mock

    mockAbilityCan.mockImplementation((target, access) => {
      if (typeof access === 'string')
        access = store.state.accessLevels.indexOf(access.toLowerCase())

      const permission = userInfo.permissions.find((permission) => permission.target === target)
      return permission && permission.access >= access
    })

    const result = basePermissions({
      entityName: 'exampleEntity',
      config: {
        permissionKey: 'customPermissionKey',
        customPermissionPrefix: 'customPrefix',
      },
    })

    expect(result.canCreate).toBe(true)
    expect(result.canUpdate).toBe(true)
    expect(result.canUpdateSeo).toBe(true)
    expect(result.canCreateSeo).toBe(true)
    expect(result.canViewSeo).toBe(true)
    expect(result.canRemove).toBe(true)
    expect(result.canExport).toBe(true)

    // Ожидаемые вызовы mockAbilityCan...
  })
})
