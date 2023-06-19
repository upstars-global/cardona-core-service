import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

// Routes
import { canNavigate } from '../libs/acl/routeProtection'
import { isUserLoggedIn, getUserData, getHomeRouteForLoggedInUser } from '../auth/utils'
import apps from './routes/apps'
import dashboard from './routes/dashboard'
import uiElements from './routes/ui-elements/index'
import pages from './routes/pages'
import chartsMaps from './routes/charts-maps'
import formsTable from './routes/forms-tables'
import others from './routes/others'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    { path: '/', redirect: { name: 'dashboard-analytics' } },
    ...apps,
    ...dashboard,
    ...pages,
    ...chartsMaps,
    ...formsTable,
    ...uiElements,
    ...others,
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})

router.beforeEach(async (to, _, next) => {
  const isLoggedIn = isUserLoggedIn()
  const permission = to.meta.permission
  const permissionGroup = to.meta.permissionGroup
  const isAllPermissions = to.meta.isAllPermissions
  const permissionLevel = to.meta.level || 1

  if (isLoggedIn && store.getters.userInfo.isEmpty) {
    await store.dispatch('fetchCurrentUser')
  }
  if (!canNavigate(to)) {
    // Redirect to login if not logged in
    if (!isLoggedIn) return next({ name: 'auth-login' })

    // If logged in => not authorized
    return next({ name: 'misc-not-authorized' })
  }

  const hasPermission = permission
    ? store.getters.abilityCan(permission, permissionLevel)
    : permissionGroup
    ? store.getters.abilityCanInGroup(permissionGroup, permissionLevel, isAllPermissions)
    : true

  // Redirect if logged in
  if (to.meta.redirectIfLoggedIn && isLoggedIn) {
    const userData = getUserData()
    next(getHomeRouteForLoggedInUser(userData ? userData.role : null))
  } else if (!hasPermission) next({ name: 'error-404' })

  return next()
})

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

export default router
