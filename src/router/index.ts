import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import { isUserLoggedIn } from './utils'
import routes from '~pages'
import { canNavigate } from '@layouts/plugins/casl'
import store from '@/store'
import sectionRouterGenerator from '@/helpers/router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ℹ️ We are redirecting to different pages based on role.
    // NOTE: Role is just for UI purposes. ACL is based on abilities.
    {
      path: '/',
      redirect: to => {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}')
        const userRole = (userData && userData.role) ? userData.role : null

        if (userRole === 'admin')
          return { name: 'dashboards-analytics' }
        if (userRole === 'client')
          return { name: 'access-control' }

        return { name: 'login', query: to.query }
      },
    },
    {
      path: '/pages/user-profile',
      redirect: () => ({ name: 'pages-user-profile-tab', params: { tab: 'profile' } }),
    },
    {
      path: '/pages/account-settings',
      redirect: () => ({ name: 'pages-account-settings-tab', params: { tab: 'account' } }),
    },

    /* {
      path: '/demo/create',
      name: 'DemoCreate',
      component: () => import('../pages/demo/create/index.vue'),
      meta: {
        title: 'demo.create',
        permission: 'demo-demo',
        level: 'create',
        breadcrumb: [
          {
            to: { name: 'DemoList' },
            text: 'demo.list',
          },
          {
            text: 'demo.create',
            active: true,
          },
        ],
      },
    }, */
    {
      path: '/demo/update/:id',
      name: 'DemoUpdate',
      component: () => import('../pages/demo/update/index.vue'),
      meta: {
        title: 'demo.edit',
        permissionGroup: 'demoPage',
        level: 'update',
        breadcrumb: [
          {
            to: { name: 'DemoList' },
            text: 'demo.list',
          },
          {
            text: 'demo.edit',
            active: true,
          },
        ],
      },
    },

    ...setupLayouts([
      ...routes,

      /* {
        path: '/demo',
        name: 'DemoList',
        component: () => import('../pages/demo/list/index.vue'),
      }, */
      ...sectionRouterGenerator([
        { name: 'demo' },
      ]),
    ]),
  ],

})

// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
router.beforeEach(async to => {
  const isLoggedIn = isUserLoggedIn()

  /*

  ℹ️ Commented code is legacy code

  if (!canNavigate(to)) {
    // Redirect to login if not logged in
    // ℹ️ Only add `to` query param if `to` route is not index route
    if (!isLoggedIn)
      return next({ name: 'login', query: { to: to.name !== 'index' ? to.fullPath : undefined } })

    // If logged in => not authorized
    return next({ name: 'not-authorized' })
  }

  // Redirect if logged in
  if (to.meta.redirectIfLoggedIn && isLoggedIn)
    next('/')

  return next()

  */
  if (isLoggedIn && store.getters.userInfo.isEmpty) {
    await store.dispatch('fetchCurrentUser')
    await Promise.all([
      store.dispatch('localeCore/getLocalesList'),
      store.dispatch('appConfigCore/fetchConfig'),
    ])
  }

  if (canNavigate(to)) {
    if (to.meta.redirectIfLoggedIn && isLoggedIn)
      return '/'
  }
  else {
    if (isLoggedIn)
      return { name: 'not-authorized' }
    else
      return { name: 'login', query: { to: to.name !== 'index' ? to.fullPath : undefined } }
  }
})

export default router
