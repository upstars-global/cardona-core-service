import Vue from 'vue'
import VueRouter from 'vue-router'
import { getters, dispatch, commit } from '../store'

// modules
import noAccess from '../router/noAccess'
import error from '../router/error'
import sectionRouterGenerator from '../helpers/router'

if (!process || process.env.NODE_ENV !== 'test') {
  Vue.use(VueRouter)
}
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    ...noAccess,

    ...sectionRouterGenerator([
      { name: 'gamesCategories', isProject: true, isPermissionGroup: true, isConvertName: true },
      { name: 'gamesProducers', isProject: true, isPermissionGroup: true, isConvertName: true },
      { name: 'users' },
      { name: 'banners', sectionName: 'promo', isProject: true },
      { name: 'staticPages', sectionName: 'promo', isProject: true, isPermissionGroup: true },
    ]),
    ...error,
  ],
})

router.beforeEach(async (to, _, next) => {
  const isLoginPage: boolean = to.name === 'Login'
  const permission: string | undefined = to.meta.permission
  const permissionGroup: string | undefined = to.meta.permissionGroup
  const isAllPermissions: boolean = to.meta.isAllPermissions
  const permissionLevel: number = to.meta.level || 1

  if (getters.isAuthorizedUser && getters.userInfo.isEmpty) await dispatch('fetchCurrentUser')
  if (getters.isAuthorizedUser) await dispatch('appConfigCore/fetchConfig')

  const hasPermission: boolean = permission
    ? getters.abilityCan(permission, permissionLevel)
    : permissionGroup
    ? getters.abilityCanInGroup(permissionGroup, permissionLevel, isAllPermissions)
    : true

  if (!to.params.project) {
    to.params.project = getters.selectedProject?.alias
  } else if (to.params.project !== getters.selectedProject?.alias) {
    const projectURL = getters.userProjects.find((item) => item.alias === to.params.project)
    if (projectURL) {
      commit('SET_SELECTED_PROJECT', projectURL)
      to.params.project = projectURL.alias
    }
  }

  if (!isLoginPage && !getters.isAuthorizedUser) next({ name: 'Login' })
  else if (isLoginPage && getters.isAuthorizedUser) next({ name: 'Dashboard' })
  else if (!hasPermission) next({ name: 'noAccess' })
  else next()
})

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.setAttribute('data-state', 'off')
    appLoading.style.display = 'none'
  }
})

export default router
