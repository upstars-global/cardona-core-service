import type { RouteRecordRaw } from 'vue-router/auto'
import { useCookie } from '../../@core/composable/useCookie'

// 👉 Redirects
export const redirects: RouteRecordRaw[] = [
  // ℹ️ We are redirecting to different pages based on role.
  // NOTE: Role is just for UI purposes. ACL is based on abilities.
  {
    path: '/',
    name: 'index',
    redirect: to => {
      const userData = useCookie<Record<string, unknown> | null | undefined>('userData')
      const userRole = userData.value?.role

      if (userRole === 'admin')
        return { name: 'dashboards-crm' }
      if (userRole === 'client')
        return { name: 'access-control' }

      return { name: 'login', query: to.query }
    },
  },
  {
    path: '/pages/user-profile',
    name: 'pages-user-profile',
    redirect: () => ({ name: 'pages-user-profile-tab', params: { tab: 'profile' } }),
  },
  {
    path: '/pages/account-settings',
    name: 'pages-account-settings',
    redirect: () => ({ name: 'pages-account-settings-tab', params: { tab: 'account' } }),
  },
]

export const routes: RouteRecordRaw[] = [
  {
    path: '/register',
    name: 'register',
    component: () => import ('../../pages/register.vue'),
    meta: {
      layout: 'blank',
      unauthenticatedOnly: true,
    },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import ('../../pages/forgot-password.vue'),
    meta: {
      layout: 'blank',
      unauthenticatedOnly: true,
    },
  },
  {
    path: '/demo',
    name: 'DemoList',
    component: () => import('../../pages/demo/list/index.vue'),
    meta: {
      title: 'demo.list',
      permission: 'demo-demo',
      breadcrumb: [
        {
          to: { name: 'DemoList' },
          title: 'demo.list',
          active: true,
        },
      ],
    },
  },
  {
    path: '/demo/create',
    name: 'DemoCreate',
    component: () => import('../../pages/demo/create/index.vue'),
    meta: {
      title: 'demo.create',
      permission: 'demo-demo',
      level: 'create',
      breadcrumb: [
        {
          to: { name: 'DemoList' },
          title: 'demo.list',
        },
        {
          title: 'demo.create',
          active: true,
        },
      ],
    },
  },
  {
    path: '/demo/update/:id',
    name: 'DemoUpdate',
    component: () => import('../../pages/demo/update/index.vue'),
    meta: {
      title: 'demo.edit',
      permissionGroup: 'demoPage',
      level: 'update',
      breadcrumb: [
        {
          to: { name: 'DemoList' },
          title: 'demo.list',
        },
        {
          title: 'demo.edit',
          active: true,
        },
      ],
    },
  },
  {
    path: '/permission/:id',
    name: 'PermissionPage',
    component: () => import('@/pages/permission/form/index.vue'),
  },
]
