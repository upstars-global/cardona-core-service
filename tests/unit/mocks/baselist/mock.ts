import { vi } from 'vitest'
import { createStore } from 'vuex'
import { mockModal } from '../modal-provide-config'
import { FilterID } from '../../../../src/@model/filter'
import type { UseListType } from '../../../../src/@model/templates/baseList'
import type { PermissionLevel } from '../../../../src/@model/permission'
import { AllPermission, Permission } from '../../../../src/@model/permission'
import { TableField } from '../../../../src/@model/templates/tableFields'

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

export const mockStore = createStore({
  state: {
    accessLevels: ['noaccess', 'view', 'create', 'update', 'delete'],
    userInfo: {
      permissions: [
        {
          target: 'demo-test',
          access: 4,
        },
        {
          target: 'demo-test-report',
          access: 1,
        },
        {
          target: 'demo-test-seo',
          access: 3,
        },
        {
          target: 'test-super',
          access: 4,
        },
        {
          target: 'test-permission',
          access: 4,
        },
      ].map((permission: any) => new Permission(permission)),
    },
    permissions: new AllPermission(),
    selectedProduct: null,
    selectedProject: null,
  },
  getters: {
    isLoadingEndpoint: () => () => false,
    userInfo: state => state.userInfo,
    selectedProject: state => state.selectedProject,
    selectedProduct: state => state.selectedProduct,
    accessLevels: state => state.accessLevels,
    abilityCan:
      ({ accessLevels, userInfo }) =>
        (target: string, access: number | PermissionLevel) => {
          if (typeof access === 'string')
            access = accessLevels.indexOf(access.toLowerCase())

          const permission = userInfo.permissions.find(permission => permission.target === target)

          return permission && permission.access >= access
        },
  },

  modules: {
    appConfigCore: {
      namespaced: true,
      getters: {
        verifiedProjects: () => ([
          { id: 'p1', alias: 'alpha', name: 'Project A' },
          { id: 'p2', alias: 'beta', name: 'Project B' },
        ]),
      },
    },
  },
})

export const globalConfig = {
  provide: { modal: mockModal },
  plugins: [mockStore],
  components: {
    VueSelect: {
      template: '<select><slot /></select>',
    },
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
