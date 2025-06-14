import type { Router } from 'vue-router'
import { useCookie } from '../../@core/composable/useCookie'
import { useLocaleStore } from '../../stores/locale'
import store from '@/store'

export const setupGuards = (router: Router) => {
  // 👉 router.beforeEach
  // Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
  router.beforeEach(async to => {
    /*
     * If it's a public route, continue navigation. This kind of pages are allowed to visited by login & non-login users. Basically, without any restrictions.
     * Examples of public routes are, 404, under maintenance, etc.
     */
    const permission = to.meta.permission
    const permissionLevel = to.meta.level || 1
    const permissionGroup = to.meta.permissionGroup
    const isAllPermissions = to.meta.isAllPermissions

    const localeStore = useLocaleStore()

    if (to.meta.public)
      return

    /**
     * Check if user is logged in by checking if token & user data exists in local storage
     * Feel free to update this logic to suit your needs
     */
    const isLoggedIn = !!(useCookie('userData').value && useCookie('accessToken').value)

    if (isLoggedIn && store.getters.userInfo.isEmpty) {
      await store.dispatch('fetchCurrentUser')
      await Promise.all([
        localeStore.fetchLocalesList(),
        store.dispatch('appConfigCore/fetchConfig'),
      ])
    }

    const hasPermission = permission
      ? store.getters.abilityCan(permission, permissionLevel)
      : permissionGroup
        ? store.getters.abilityCanInGroup(permissionGroup, permissionLevel, isAllPermissions)
        : true

    if (!hasPermission)
      return '/error-404'

    /*
      If user is logged in and is trying to access login like page, redirect to home
      else allow visiting the page
      (WARN: Don't allow executing further by return statement because next code will check for permissions)
     */
    if (to.meta.unauthenticatedOnly) {
      if (isLoggedIn)
        return '/'
      else
        return undefined
    }

    /* if (!canNavigate(to)) {
      /!* eslint-disable indent *!/
      return isLoggedIn
        ? { name: 'not-authorized' }
        : {
            name: 'login',
            query: {
              ...to.query,
              to: to.fullPath !== '/' ? to.path : undefined,
            },
          }
    } */ // TODO: посомтреть в чем проблема падает ошибка если юзать await
  })
}
