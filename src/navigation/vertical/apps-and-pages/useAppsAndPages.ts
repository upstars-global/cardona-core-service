import { computed } from 'vue'
import { useUserStore } from '../../../stores/user'
import type { VerticalNavItems } from '@layouts/types'

export function useAppsAndPages() {
  const userStore = useUserStore()

  const appsAndPages = computed<VerticalNavItems>(() => {
    const hasProjects = userStore.isExistsProjects
    const projectName = userStore.getSelectedProject?.name ?? ''

    const generalMenu: VerticalNavItems = [
      {
        title: 'title.payouts._',
        icon: { icon: 'tabler-cash' },
        children: [
          { title: 'page.payouts.payoutsList', to: { name: 'PayoutsList' } },
          { title: 'page.payouts.payoutsRules', to: { name: 'PayoutsRules' } },
        ],
      },
      {
        title: 'title.accessManagement',
        icon: { icon: 'tabler-lock-check' },
        children: [
          { title: 'common.admin.fullList', to: { name: 'UsersList' } },
          { title: 'common.groups.list', to: { name: 'GroupsList' } },
        ],
      },
      {
        title: 'title.logging',
        icon: { icon: 'tabler-report' },
        children: [
          { title: 'title.entityChangeLog', to: { name: 'LogsList' } },
          { title: 'title.passwordChangeLog', to: { name: 'PasswordChangeLog' } },
        ],
      },
    ]

    const managingMenuItems: VerticalNavItems = [
      {
        title: 'common.player.list',
        icon: { icon: 'tabler-users' },
        children: [
          { title: 'common.supportService._', to: { name: 'SupportService' } },
          { title: 'title.playersDetailed', to: { name: 'Players' } },
        ],
      },
      {
        title: 'title.game.list',
        icon: { icon: 'tabler-category' },
        children: [
          { title: 'title.game.listOfGames', to: { name: 'GamesList' } },
          { title: 'title.game.categories', to: { name: 'GamesCategoriesList' } },
        ],
      },
      {
        title: 'title.gifts.list',
        icon: { icon: 'tabler-gift' },
        children: [
          { title: 'title.cashbacks.list', to: { name: 'CashbacksList' } },
          { title: 'title.gifts.listOfGifts', to: { name: 'GiftsList' } },
        ],
      },
    ]

    const managingMenu: VerticalNavItems = hasProjects
      ? [{ heading: projectName }, ...managingMenuItems]
      : []

    return [
      ...managingMenu,
      { heading: 'common.general' },
      ...generalMenu,
    ]
  })

  return { appsAndPages }
}
