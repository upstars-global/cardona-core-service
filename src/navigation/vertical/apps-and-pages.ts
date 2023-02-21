import { computed, ref, watch } from 'vue'
import { getters } from '@/store'
import { MenuItem } from './model'
import useAppConfig from '@core/app-config/useAppConfig'

const { navMenuType, isMenuTypeMain } = useAppConfig()

const selectedProduct = computed(() => getters.selectedProduct)
const isNeocore = computed(() => getters.isNeocore)

const clearMenu = (menu: Array<MenuItem>): Array<MenuItem> => {
  return menu.filter((item: MenuItem): boolean => {
    if (item?.children?.isNotEmpty) {
      item.children = clearMenu(item.children)

      return item?.children?.isNotEmpty
    }

    return !!item.header || getters.abilityCan(item.permission, item.level || 1)
  })
}
const buildAdminSectionMenu = () => {
  const adminMenu: Array<MenuItem> = [
    {
      title: 'title.adminSection._',
      icon: 'UsersIcon',
      route: 'UsersControlList',
      permission: 'backoffice-users-control',
    },
  ]

  return clearMenu([
    {
      header: 'common.adminSection.header',
    },
    ...adminMenu,
  ])
}
const buildMenu = () => {
  const generalMenu: Array<MenuItem> = [
    {
      title: 'title.accessManagement',
      icon: 'UsersIcon',
      children: [
        {
          title: 'common.admin.fullList',
          route: 'UsersList',
          permission: 'backoffice-users',
        },
        {
          title: 'common.groups.list',
          route: 'GroupsList',
          permission: 'backoffice-groups',
        },
      ],
    },
    {
      title: 'common.configuration',
      icon: 'SettingsIcon',
      children: [
        {
          title: 'common.project.list',
          route: 'ProjectList',
          permission: 'backoffice-projects',
        },
      ],
    },
    {
      title: 'title.logging',
      icon: 'ActivityIcon',
      route: 'LogsList',
      permission: 'backoffice-logaction',
    },
  ]

  const managingMenu: Array<MenuItem> = [
    {
      title: 'common.player.list',
      icon: 'PlayCircleIcon',
      children: [
        {
          title: 'common.supportService._',
          route: 'SupportService',
          permission: 'section-support-service',
        },
      ],
    },
    {
      title: 'title.game.list',
      icon: 'BoxIcon',
      children: [
        {
          title: 'title.game.listOfGames',
          route: 'GamesList',
          permission: 'backoffice-games',
        },
        {
          title: 'title.game.categories',
          route: 'GamesCategoriesList',
          permission: 'backoffice-games-categories',
        },
        {
          title: 'title.game.producers',
          route: 'GamesProducersList',
          permission: 'backoffice-games-producers',
        },
      ],
    },

    {
      title: 'page.groupFragment.promo',
      icon: 'TargetIcon',
      children: [
        {
          title: 'common.banners._',
          route: 'BannersList',
          permission: 'backoffice-banners',
        },
        {
          title: 'common.staticPages._',
          route: 'StaticPagesList',
          permission: 'backoffice-static-pages',
        },
      ],
    },
  ]

  const alaroMenu: Array<MenuItem> = [
    {
      title: 'title.accessManagement',
      icon: 'UsersIcon',
      children: [
        {
          title: 'common.admin.fullList',
          route: 'UserList',
          permission: 'backoffice-users',
        },
      ],
    },
  ]

  if (isNeocore.value) {
    return clearMenu([
      ...managingMenu,
      generalMenu.isNotEmpty
        ? {
            header: 'common.general',
          }
        : {},
      ...generalMenu,
    ])
  } else {
    return clearMenu([...alaroMenu])
  }
}

const appgsAndPages: any = ref([])
const selectMenu = () => {
  appgsAndPages.value = isMenuTypeMain.value ? buildMenu() : buildAdminSectionMenu()
}

watch(() => getters.userInfo.permissions, selectMenu, { deep: true })
watch(() => navMenuType.value, selectMenu, { deep: true, immediate: true })
watch(() => selectedProduct.value, selectMenu, { deep: true, immediate: true })

export default appgsAndPages
