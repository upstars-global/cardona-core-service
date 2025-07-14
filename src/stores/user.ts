import {defineStore} from 'pinia'

import type {ProjectInfoInput} from '../@model/project'
import {ProjectInfo} from '../@model/project'
import {UserInfo} from '../@model/users'
import type {OptionsItem} from '../@model'
import type {PermissionLevel} from '../@model/permission'
import {AllPermission, Permission} from '../@model/permission'
import ApiService from '../services/api'
import type {PermissionGroup} from '../@model/enums/permissions'
import {productsName} from '../configs/productsName'
import {storageKeys} from '../configs/storage'
import {productName} from '@productConfig'

export const fetchCurrentUser = async () => {
  const {data} = await ApiService.request({
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
  })
}


export const useUserStore = defineStore('user', {
  state: () => ({
    accessLevels: ['noaccess', 'view', 'create', 'update', 'delete'],
    userInfo: new UserInfo(),
    permissions: new AllPermission(),
    selectedProduct: null as OptionsItem | null,
    selectedProject: null as ProjectInfoInput | null,
    priorityProject: null as ProjectInfoInput | null,
  }),

  getters: {
    userProjects(state) {
      return state.userInfo.projects
    },

    userProducts(state) {
      return state.userInfo.products
    },

    selectedProject(state): ProjectInfoInput {
      const defaultProject = state.userInfo.projects[0]
      const projectId = sessionStorage.getItem(storageKeys.selectedProjectId)
      const selected = state.userInfo.projects.find(p => p.id === Number(projectId))
      return state.priorityProject || state.selectedProject || selected || defaultProject
    },

    selectedProjectWithoutPriority(state): ProjectInfoInput {
      const defaultProject = state.userInfo.projects[0]
      const projectId = sessionStorage.getItem(storageKeys.selectedProjectId)
      const selected = state.userInfo.projects.find(p => p.id === Number(projectId))
      return state.selectedProject || selected || defaultProject
    },

    isNeocore() {
      return productName === productsName.neocore
    },

    getSpecificProject(state) {
      return (alias: string) => state.userInfo.projects.find(p => p.alias === alias)
    },

    canViewVCoinInProject(state) {
      return (alias: string) => {
        const project = state.userInfo.projects.find(p => p.alias === alias)
        return project?.integrations?.vCoins
      }
    },

    abilityCan(state) {
      return (target: string, access: number | PermissionLevel) => {
        if (typeof access === 'string') {
          access = state.accessLevels.indexOf(access.toLowerCase())
        }

        const permission = state.userInfo.permissions.find(p => p.target === target)
        return permission && permission.access >= access
      }
    },

    abilityCanInGroup(state) {
      return (group: PermissionGroup | string[], access: number | PermissionLevel, all = false) => {
        const checkAbility = useUserStore().abilityCan

        if (typeof access === 'string') {
          access = state.accessLevels.indexOf(access.toLowerCase())
        }

        if (Array.isArray(group)) {
          return all
            ? group.every(item => checkAbility(item, access))
            : group.some(item => checkAbility(item, access))
        }

        const groups = state.permissions.allPermission[group]

        return all
          ? groups.every(item => checkAbility(item.target, access))
          : groups.some(item => checkAbility(item.target, access))
      }
    },
  },

  actions: {
    async fetchCurrentUser() {
      const currentUser = await fetchCurrentUser()
      this.userInfo = currentUser
      this.permissions.setAccessAllPermission(currentUser.permissions)
      this.selectedProduct = currentUser.products.find(p => p.name === productName) || null
    },

    setSelectedProduct(product: OptionsItem) {
      this.selectedProduct = product
    },

    setSelectedProject(project: ProjectInfoInput) {
      this.selectedProject = project
    },

    setPriorityProject(project: ProjectInfoInput) {
      this.priorityProject = this.userInfo.projects.find(p => p.alias === project.alias) || null
    },
  },
})
