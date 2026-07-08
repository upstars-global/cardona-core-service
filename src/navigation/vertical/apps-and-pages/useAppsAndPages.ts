import { ref } from 'vue'
import type { VerticalNavItems } from '@layouts/types'

export function useAppsAndPages() {
  return {
    appsAndPages: ref<VerticalNavItems>([
      {
        title: 'title.payouts._',
        icon: { icon: 'tabler-cash' },
        children: [
          {
            title: 'page.payouts.payoutsList',
            to: { name: 'PayoutsList' },
          },
          {
            title: 'page.payouts.payoutsRules',
            to: { name: 'PayoutsRules' },
          },
          {
            title: 'title.finManagersStats',
            to: { name: 'FinManagersStatistic' },
          },
        ],
      },
      {
        title: 'title.analytics',
        icon: { icon: 'tabler-chart-histogram' },
        children: [
          {
            title: 'title.dashboard',
            to: { name: 'AnalyticsDashboard' },
          },
          {
            title: 'page.financialStatistics._',
            to: { name: 'FinancialStatistics' },
          },
        ],
      },
      {
        title: 'title.malagaTitle',
        icon: { icon: 'tabler-mail' },
        children: [
          {
            title: 'title.malagaNotifications.list',
            to: { name: 'MalagaNotificationsList' },
          },
          {
            title: 'title.templates.list',
            to: { name: 'MalagaTemplatesList' },
          },
          {
            title: 'title.malagaChannels.list',
            to: { name: 'MalagaChannelsList' },
          },
          {
            title: 'title.malagaAttempts',
            to: { name: 'MalagaAttempts' },
          },
          {
            title: 'title.malagaClients.list',
            to: { name: 'MalagaClientsList' },
          },
          {
            title: 'title.malagaIntegrations.title',
            to: { name: 'MalagaIntegrationsList' },
          },
        ],
      },
      {
        title: 'title.accessManagement',
        icon: { icon: 'tabler-lock-check' },
        children: [
          {
            title: 'common.admin.fullList',
            to: { name: 'UsersList' },
          },
          {
            title: 'common.groups.list',
            to: { name: 'GroupsList' },
          },
          {
            title: 'title.authLogs',
            to: { name: 'AuthLogs' },
          },
        ],
      },
      {
        title: 'common.configuration',
        icon: { icon: 'tabler-settings' },
        children: [
          {
            title: 'common.project.list',
            to: { name: 'ProjectsList' },
          },
        ],
      },
      {
        title: 'title.valdemoro.list',
        icon: { icon: 'tabler-cloud-search' },
        children: [
          {
            title: 'title.valdemoroStatistics',
            to: { name: 'ValdemoroList' },
          },
          {
            title: 'title.valdemoroConfig',
            to: { name: 'ValdemoroConfig' },
          },
        ],
      },
      {
        title: 'title.logging',
        icon: { icon: 'tabler-report' },
        children: [
          {
            title: 'title.entityChangeLog',
            to: { name: 'LogsList' },
          },
          {
            title: 'title.passwordChangeLog',
            to: { name: 'PasswordChangeLog' },
          },
        ],
      },
    ]),
  }
}
