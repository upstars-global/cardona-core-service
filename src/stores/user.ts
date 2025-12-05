import { defineStore } from 'pinia'
import ApiService from '../services/api'
import type { ProjectInfoInput } from '../@model/project'
import { ProjectInfo } from '../@model/project'
import { UserInfo } from '../@model/users'
import type { OptionsItem } from '../@model'
import type { PermissionLevel } from '../@model/permission'
import { AllPermission, Permission } from '../@model/permission'
import type { PermissionGroup } from '../@model/enums/permissions'
import { productsName } from '../configs/productsName'
import { storageKeys } from '../configs/storage'
import { productName } from '@productConfig'

export const fetchCurrentUserApi = async () => {
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
    projects: data.projects.map((p: any) => new ProjectInfo(p)),
    products: data.products.map((p: any) => p as OptionsItem),
    permissions: data.permissions.map((p: any) => new Permission(p)),
    picture: data.picture || '',
  })
}

export const useUserStore = defineStore('user', {
  state: () => ({
    accessLevels: ['noaccess', 'view', 'create', 'update', 'delete'] as string[],
    userInfo: new UserInfo(),
    permissions: new AllPermission(),
    selectedProduct: null as OptionsItem | null,
    selectedProject: null as ProjectInfoInput | null,
    priorityProject: null as ProjectInfoInput | null,
  }),

  getters: {
    getSelectedProject: state => {
      const projects = state.userInfo.projects
      const defaultProject = projects[0]

      const fromStorage = sessionStorage.getItem(storageKeys.selectedProjectId)
      const storedProject = projects.find(p => p.id === Number(fromStorage))

      return (
        state.priorityProject
        || state.selectedProject
        || storedProject
        || defaultProject
      )
    },
    userInfoData: state => state.userInfo,

    haveSomePermissionReport: state =>
      state.userInfo.permissions.some(
        p => p._access >= 1 && p.target.includes('-report'),
      ),

    userProjects: state => state.userInfo.projects,
    userProducts: state => state.userInfo.products,

    // selectedProjectComputed: state => {
    //
    // },

    selectedProjectWithoutPriority: state => {
      const projects = state.userInfo.projects
      const defaultProject = projects[0]
      const fromStorage = sessionStorage.getItem(storageKeys.selectedProjectId)
      const storedProject = projects.find(p => p.id === Number(fromStorage))

      return state.selectedProject || storedProject || defaultProject
    },

    selectedProductComputed: state => state.selectedProduct,

    isNeocore: () => productName === productsName.neocore,
    isMarbella: () => productName === productsName.marbella,
    projectsBySelectedProduct: () => this.userProjects
      ?.filter(item => item?.productId === this.selectedProduct?.id)
      ?.filter(Boolean) || [],
    getSpecificProject:
      state =>
        (projectAlias: string): ProjectInfo =>
          state.userInfo.projects.find(p => p.alias === projectAlias) as ProjectInfo,

    canViewVCoinInProject:
      state =>
        (projectAlias: string) =>
          state.userInfo.projects.find(p => p.alias === projectAlias)?.integrations?.vCoins,

    abilityCan:
      state =>
        (target: string, access: number | PermissionLevel) => {
          if (typeof access === 'string')
            access = state.accessLevels.indexOf(access.toLowerCase())

          const permission = state.userInfo.permissions.find(p => p.target === target)

          return permission && permission.access >= access
        },

    abilityCanInGroup:
      state =>
        (group: PermissionGroup | string[], access: number | PermissionLevel, all = false) => {
          if (typeof access === 'string')
            access = state.accessLevels.indexOf(access.toLowerCase())

          // abilityCan available through self
          const abilityCan = (target: string, acc: number) =>
            state.userInfo.permissions.some(
              p => p.target === target && p.access >= acc,
            )

          if (Array.isArray(group)) {
            return all
              ? group.every(item => abilityCan(item, access))
              : group.some(item => abilityCan(item, access))
          }

          const groups = state.permissions.allPermission[group]

          return all
            ? groups.every(item => abilityCan(item.target, access))
            : groups.some(item => abilityCan(item.target, access))
        },
  },

  actions: {
    async fetchCurrentUser() {
      try {
        const currentUser = await fetchCurrentUserApi()

        this.userInfo = currentUser
        this.permissions.setAccessAllPermission(currentUser.permissions)

        this.selectedProduct = currentUser.products.find(
          p => p.name === productName,
        ) || null
      }
      catch (e) {
        console.error('fetchCurrentUser error', e)
      }
    },

    setSelectedProduct(product: OptionsItem) {
      this.selectedProduct = product
    },

    setSelectedProject(project: ProjectInfoInput) {
      this.selectedProject = project
    },

    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
      this.permissions.setAccessAllPermission(userInfo.permissions)
      this.selectedProduct = userInfo.products.find(({ name }) => name === productName)
    },

    setPriorityProject(project: ProjectInfoInput) {
      this.priorityProject
        = this.userInfo.projects.find(p => p.alias === project.alias) || null
    },
  },
})
