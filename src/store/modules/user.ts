import type { ProjectInfoInput } from '../../@model/project'
import { ProjectInfo } from '../../@model/project'
import { UserInfo } from '../../@model/users'
import type { OptionsItem } from '../../@model'
import type { PermissionLevel } from '../../@model/permission'
import { AllPermission, Permission } from '../../@model/permission'
import ApiService from '../../services/api'
import type { PermissionGroup } from '../../@model/enums/permissions'
import { productsName } from '../../configs/productsName'
import { storageKeys } from '../../configs/storage'
import { productName } from '@productConfig'

export const fetchCurrentUser = async () => {
  const { data } = await ApiService.request({
    type: 'App.V2.Users.Current.Read',
  })

  const [firstName, lastName] = (data.fullName || '').split(' ')

  return new UserInfo({
    id: data.id,
    firstName,
    lastName: lastName || '',
    userName: data.userName,
    email: data.email,
    description: data.description || '',
    roles: data.roles,
    status: UserInfo.toStatus(data.isActive),
    groups: data.groups,
    projects: data.projects.map((project: any) => new ProjectInfo(project)),
    products: data.products.map((product: any) => product as OptionsItem),
    permissions: data.permissions.map((permission: any) => new Permission(permission)),
    picture: data?.picture || '',
  })
}
export default {
  state: {
    accessLevels: ['noaccess', 'view', 'create', 'update', 'delete'],
    userInfo: new UserInfo(),
    permissions: new AllPermission(),
    selectedProduct: null,
    selectedProject: null,
    priorityProject: null,
  },

  getters: {
    userInfo: ({ userInfo }) => userInfo,

    userProjects: ({ userInfo }) => userInfo.projects,
    userProducts: ({ userInfo }) => userInfo.products,

    selectedProject: ({ selectedProject, priorityProject }, { userProjects }): ProjectInfoInput => {
      const defaultProject: ProjectInfoInput = userProjects[0]

      const projectIdFromStorage: string | null = sessionStorage.getItem(storageKeys.selectedProjectId)

      const selectedProjectInfo: ProjectInfoInput = userProjects.find(({ id }) => id === Number(projectIdFromStorage))

      return priorityProject || selectedProject || selectedProjectInfo || defaultProject
    },

    selectedProjectWithoutPriority: ({ selectedProject, priorityProject }, { userProjects }): ProjectInfoInput => {
      const defaultProject: ProjectInfoInput = userProjects[0]

      const projectIdFromStorage: string | null = sessionStorage.getItem(storageKeys.selectedProjectId)

      const selectedProjectInfo: ProjectInfoInput = userProjects.find(({ id }) => id === Number(projectIdFromStorage))

      return selectedProject || selectedProjectInfo || defaultProject
    },

    selectedProduct: ({ selectedProduct }) => selectedProduct,

    // @ts-expect-error
    isNeocore: () => productName === productsName.neocore,
    isMarbella: () => productName === productsName.marbella,

    getSpecificProject:
      ({ userInfo }) =>
        (projectAlias: string): ProjectInfo =>
          userInfo.projects.find(project => project.alias === projectAlias),

    canViewVCoinInProject:
      ({ userInfo }) =>
        (projectAlias: string) => {
          const project = userInfo.projects.find(item => item.alias === projectAlias)

          return project?.integrations?.vCoins
        },

    abilityCan:
      ({ accessLevels, userInfo }) =>
        (target: string, access: number | PermissionLevel) => {
          if (typeof access === 'string')
            access = accessLevels.indexOf(access.toLowerCase())

          const permission = userInfo.permissions.find(permission => permission.target === target)

          return permission && permission.access >= access
        },

    abilityCanInGroup:
      ({ accessLevels, permissions }, { abilityCan }) =>
        (group: PermissionGroup | string[], access: number | PermissionLevel, all = false) => {
          if (typeof access === 'string')
            access = accessLevels.indexOf(access.toLowerCase())

          if (Array.isArray(group)) {
            if (all)
              return group.every(item => abilityCan(item, access))

            return group.some(item => abilityCan(item, access))
          }

          const groups = permissions.allPermission[group]

          if (all)
            return groups.every(item => abilityCan(item.target, access))

          return groups.some(item => abilityCan(item.target, access))
        },
  },

  mutations: {
    SET_USER_INFO(state, userInfo: UserInfo) {
      state.userInfo = userInfo
      state.permissions.setAccessAllPermission(userInfo.permissions)
      state.selectedProduct = userInfo.products.find(({ name }) => name === productName)
    },
    SET_SELECTED_PROJECT(state, project: ProjectInfoInput) {
      state.selectedProject = project
    },
    SET_SELECTED_PRODUCT(state, product: OptionsItem) {
      state.selectedProduct = product
    },
    SET_PRIORITY_PROJECT(state, project: ProjectInfoInput) {
      state.priorityProject = state.userInfo.projects.find(({ alias }) => alias === project.alias) || null
    },
  },

  actions: {
    async fetchCurrentUser({ commit }) {
      try {
        const currentUser: UserInfo = await fetchCurrentUser()

        commit('SET_USER_INFO', currentUser)
      }
      catch {}
    },

    setSelectedProduct({ commit }, product: OptionsItem) {
      commit('SET_SELECTED_PRODUCT', product)
    },

    setSelectedProject({ commit }, project: ProjectInfoInput) {
      commit('SET_SELECTED_PROJECT', project)
    },
  },
}
