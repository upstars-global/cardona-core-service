import { vi } from 'vitest'
import { createStore } from 'vuex'
import type { PermissionLevel } from '../../../src/@model/permission'
import { AllPermission, Permission } from '../../../src/@model/permission'
import type { UseListType } from '../../../src/@model/templates/baseList'
import { FilterID } from '../../../src/@model/filter'
import { ListFieldType, TableField } from '../../../src/@model/templates/tableFields'

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
