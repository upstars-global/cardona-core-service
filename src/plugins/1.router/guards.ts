import type { Router } from 'vue-router'
import { useCookie } from '../../@core/composable/useCookie'
import { useLocaleStore } from '../../stores/locale'
import { useUserStore } from '../../stores/user'
import { useAppConfigCoreStore } from '../../stores/appConfigCore'

export const setupGuards = (router: Router) => {
  router.beforeEach(async to => {
    if (to.meta.public)
      return

    const isLoggedIn = !!(
      useCookie('userData').value
      && useCookie('accessToken').value
    )

    if (to.meta.unauthenticatedOnly) {
      return isLoggedIn ? '/' : undefined
    }

    if (!isLoggedIn) {
      return {
        path: '/login',
        query: {
          ...to.query,
          to: to.fullPath !== '/' ? to.fullPath : undefined,
        },
      }
    }

    const userStore = useUserStore()
    const localeStore = useLocaleStore()
    const appConfigCoreStore = useAppConfigCoreStore()

    if (userStore.userInfo.isEmpty) {
      try {
        await userStore.fetchCurrentUser()
        await Promise.all([
          localeStore.fetchLocalesList(),
          appConfigCoreStore.fetchConfig(),
        ])
      }
      catch {
        useCookie('userData').value = null
        useCookie('accessToken').value = null

        return {
          path: '/login',
          query: {
            to: to.fullPath !== '/' ? to.fullPath : undefined,
          },
        }
      }
    }

    const permission = to.meta.permission
    const permissionLevel = to.meta.level ?? 1
    const permissionGroup = to.meta.permissionGroup
    const isAllPermissions = to.meta.isAllPermissions

    const hasPermission = permission
      ? userStore.abilityCan(permission, permissionLevel)
      : permissionGroup
        ? userStore.abilityCanInGroup(permissionGroup, permissionLevel, isAllPermissions)
        : true

    if (!hasPermission)
      return '/error-404'
  })
}
