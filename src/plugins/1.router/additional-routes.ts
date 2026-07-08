import type { RouteRecordRaw } from 'vue-router/auto'

// 👉 Redirects
export const redirects: RouteRecordRaw[] = [
  // ℹ️ We are redirecting to different pages based on role.
  // NOTE: Role is just for UI purposes. ACL is based on abilities.
  {
    path: '/',
    name: 'index',
    redirect: to => ({ path: '/demo', query: to.query }),
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

export const constructor: RouteRecordRaw[] = []

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
  {
    path: '/constructor',
    name: 'Constructor',
    meta: {
      title: 'constructor',
      breadcrumb: [
        {
          title: 'constructor',
          active: true,
        },
      ],
    },
    component: () => import('@/pages/constructor/index.vue'),
  },
  {
    path: '/storybook',
    name: 'Storybook',
    meta: {
      title: 'storybook',
      breadcrumb: [
        {
          title: 'storybook',
          active: true,
        },
      ],
    },
    component: () => import('@/pages/storybook/index.vue'),
  },

  // 👉 Payouts
  {
    path: '/payouts',
    name: 'PayoutsList',
    component: () => import('@/pages/payouts/list/index.vue'),
    meta: {
      title: 'page.payouts.payoutsList',
      breadcrumb: [
        { title: 'title.payouts._' },
        { title: 'page.payouts.payoutsList', active: true },
      ],
    },
  },
  {
    path: '/payouts/rules',
    name: 'PayoutsRules',
    component: () => import('@/pages/payouts/rules/index.vue'),
    meta: {
      title: 'page.payouts.payoutsRules',
      breadcrumb: [
        { title: 'title.payouts._' },
        { title: 'page.payouts.payoutsRules', active: true },
      ],
    },
  },
  {
    path: '/payouts/fin-managers-statistic',
    name: 'FinManagersStatistic',
    component: () => import('@/pages/payouts/fin-managers-statistic/index.vue'),
    meta: {
      title: 'title.finManagersStats',
      breadcrumb: [
        { title: 'title.payouts._' },
        { title: 'title.finManagersStats', active: true },
      ],
    },
  },

  // 👉 Analytics
  {
    path: '/analytics/dashboard',
    name: 'AnalyticsDashboard',
    component: () => import('@/pages/analytics/dashboard/index.vue'),
    meta: {
      title: 'title.dashboard',
      breadcrumb: [
        { title: 'title.analytics' },
        { title: 'title.dashboard', active: true },
      ],
    },
  },
  {
    path: '/analytics/financial-statistics',
    name: 'FinancialStatistics',
    component: () => import('@/pages/analytics/financial-statistics/index.vue'),
    meta: {
      title: 'page.financialStatistics._',
      breadcrumb: [
        { title: 'title.analytics' },
        { title: 'page.financialStatistics._', active: true },
      ],
    },
  },

  // 👉 Malaga
  {
    path: '/malaga/notifications',
    name: 'MalagaNotificationsList',
    component: () => import('@/pages/malaga/notifications/index.vue'),
    meta: {
      title: 'title.malagaNotifications.list',
      breadcrumb: [
        { title: 'title.malagaTitle' },
        { title: 'title.malagaNotifications.list', active: true },
      ],
    },
  },
  {
    path: '/malaga/templates',
    name: 'MalagaTemplatesList',
    component: () => import('@/pages/malaga/templates/index.vue'),
    meta: {
      title: 'title.templates.list',
      breadcrumb: [
        { title: 'title.malagaTitle' },
        { title: 'title.templates.list', active: true },
      ],
    },
  },
  {
    path: '/malaga/channels',
    name: 'MalagaChannelsList',
    component: () => import('@/pages/malaga/channels/index.vue'),
    meta: {
      title: 'title.malagaChannels.list',
      breadcrumb: [
        { title: 'title.malagaTitle' },
        { title: 'title.malagaChannels.list', active: true },
      ],
    },
  },
  {
    path: '/malaga/attempts',
    name: 'MalagaAttempts',
    component: () => import('@/pages/malaga/attempts/index.vue'),
    meta: {
      title: 'title.malagaAttempts',
      breadcrumb: [
        { title: 'title.malagaTitle' },
        { title: 'title.malagaAttempts', active: true },
      ],
    },
  },
  {
    path: '/malaga/clients',
    name: 'MalagaClientsList',
    component: () => import('@/pages/malaga/clients/index.vue'),
    meta: {
      title: 'title.malagaClients.list',
      breadcrumb: [
        { title: 'title.malagaTitle' },
        { title: 'title.malagaClients.list', active: true },
      ],
    },
  },
  {
    path: '/malaga/integrations',
    name: 'MalagaIntegrationsList',
    component: () => import('@/pages/malaga/integrations/index.vue'),
    meta: {
      title: 'title.malagaIntegrations.title',
      breadcrumb: [
        { title: 'title.malagaTitle' },
        { title: 'title.malagaIntegrations.title', active: true },
      ],
    },
  },

  // 👉 Access Management
  {
    path: '/users',
    name: 'UsersList',
    component: () => import('@/pages/users/list/index.vue'),
    meta: {
      title: 'common.admin.fullList',
      breadcrumb: [
        { title: 'title.accessManagement' },
        { title: 'common.admin.fullList', active: true },
      ],
    },
  },
  {
    path: '/groups',
    name: 'GroupsList',
    component: () => import('@/pages/groups/list/index.vue'),
    meta: {
      title: 'common.groups.list',
      breadcrumb: [
        { title: 'title.accessManagement' },
        { title: 'common.groups.list', active: true },
      ],
    },
  },
  {
    path: '/auth-logs',
    name: 'AuthLogs',
    component: () => import('@/pages/auth-logs/index.vue'),
    meta: {
      title: 'title.authLogs',
      breadcrumb: [
        { title: 'title.accessManagement' },
        { title: 'title.authLogs', active: true },
      ],
    },
  },

  // 👉 Configuration
  {
    path: '/projects',
    name: 'ProjectsList',
    component: () => import('@/pages/projects/list/index.vue'),
    meta: {
      title: 'common.project.list',
      breadcrumb: [
        { title: 'common.configuration' },
        { title: 'common.project.list', active: true },
      ],
    },
  },

  // 👉 Valdemoro
  {
    path: '/valdemoro',
    name: 'ValdemoroList',
    component: () => import('@/pages/valdemoro/list/index.vue'),
    meta: {
      title: 'title.valdemoroStatistics',
      breadcrumb: [
        { title: 'title.valdemoro.list' },
        { title: 'title.valdemoroStatistics', active: true },
      ],
    },
  },
  {
    path: '/valdemoro/config',
    name: 'ValdemoroConfig',
    component: () => import('@/pages/valdemoro/config/index.vue'),
    meta: {
      title: 'title.valdemoroConfig',
      breadcrumb: [
        { title: 'title.valdemoro.list' },
        { title: 'title.valdemoroConfig', active: true },
      ],
    },
  },

  // 👉 Logging
  {
    path: '/logs',
    name: 'LogsList',
    component: () => import('@/pages/logs/list/index.vue'),
    meta: {
      title: 'title.entityChangeLog',
      breadcrumb: [
        { title: 'title.logging' },
        { title: 'title.entityChangeLog', active: true },
      ],
    },
  },
  {
    path: '/logs/password-change',
    name: 'PasswordChangeLog',
    component: () => import('@/pages/logs/password-change/index.vue'),
    meta: {
      title: 'title.passwordChangeLog',
      breadcrumb: [
        { title: 'title.logging' },
        { title: 'title.passwordChangeLog', active: true },
      ],
    },
  },
]
