import router from '../../router'
import { setStorage } from '../../helpers/storage'
import { storageKeys } from '../../configs/storage'
import { ProjectInfo, ProjectInfoInput } from '../../@model/project'
import { OptionsItem } from '../../@model'
import { AllPermission, PermissionGroup, PermissionLevel } from '../../@model/permission'

export default {
  state: {
    accessLevels: ['noaccess', 'view', 'create', 'update', 'delete'],
    permissions: new AllPermission(),
    selectedProduct: null,
    selectedProject: null,
  },

  getters: {
    userProjects: ({ userInfo }) => userInfo.projects,

    selectedProject: ({ selectedProject }, { userProjects }): ProjectInfoInput => {
      const defaultProject: ProjectInfoInput = userProjects[0]
      const projectIdFromStorage: string | null = localStorage.getItem(
        storageKeys.selectedProjectId
      )
      const selectedProjectInfo: ProjectInfoInput = userProjects.find(
        ({ id }) => id === Number(projectIdFromStorage)
      )
      return selectedProject || selectedProjectInfo || defaultProject
    },

    selectedProduct: ({ selectedProduct }) => selectedProduct,
    isNeocore: ({ selectedProduct }) => selectedProduct?.id.toString() === '1',

    getSpecificProject:
      ({ userInfo }) =>
      (projectAlias: string): ProjectInfo =>
        userInfo.projects.find((project) => project.alias === projectAlias),

    abilityCan:
      ({ accessLevels, userInfo }) =>
      (target: string, access: number | PermissionLevel) => {
        if (typeof access === 'string') access = accessLevels.indexOf(access.toLowerCase())

        const permission = userInfo.permissions.find((permission) => permission.target === target)

        return permission && permission.access >= access
      },

    abilityCanInGroup:
      ({ accessLevels, permissions }, { abilityCan }) =>
      (group: PermissionGroup | string[], access: number | PermissionLevel, all = false) => {
        if (typeof access === 'string') access = accessLevels.indexOf(access.toLowerCase())

        if (Array.isArray(group)) {
          if (all) return group.every((item) => abilityCan(item, access))

          return group.some((item) => abilityCan(item, access))
        }

        const groups = permissions.allPermission[group]

        if (all) return groups.every((item) => abilityCan(item.target, access))

        return groups.some((item) => abilityCan(item.target, access))
      },
  },

  mutations: {
    SET_SELECTED_PROJECT(state, project: ProjectInfoInput) {
      state.selectedProject = project
    },
    SET_SELECTED_PRODUCT(state, product: OptionsItem) {
      state.selectedProduct = product
    },
  },

  actions: {
    setSelectedProduct({ commit }, product: OptionsItem) {
      commit('SET_SELECTED_PRODUCT', product)
    },

    setSelectedProject({ getters, commit }, project: ProjectInfoInput) {
      const { selectedProject } = getters
      const { currentRoute } = router

      const changingProjectRouteName: string | undefined =
        currentRoute.meta.changingProjectRouteName
      const isSameProject: boolean = selectedProject?.id === project.id

      setStorage(storageKeys.selectedProjectId, project.id)

      commit('SET_SELECTED_PROJECT', project)

      if (!isSameProject) {
        if (changingProjectRouteName) {
          router.push({
            name: changingProjectRouteName,
            params: { ...currentRoute.params, project: project.alias },
          })
        } else if (currentRoute.matched?.[0]?.path.includes(':project')) {
          router.push({ params: { ...currentRoute.params, project: project.alias } })
        }
      }
    },
  },
}
