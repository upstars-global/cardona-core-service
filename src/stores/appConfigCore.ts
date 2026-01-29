import { defineStore } from 'pinia'
import type { ProjectInfo } from '../@model/project'
import ApiService from '../services/api'
import { MenuType } from '../@model/enums/menuType'
import { useUserStore } from './user'

export const useAppConfigCoreStore = defineStore('appConfigCore', {
  state: () => ({
    layout: {
      isRTL: false,
      skin: localStorage.getItem('vuexy-skin') || 'light',
      routerTransition: 'fade',
      type: 'vertical',
      contentWidth: 'full',
      menu: {
        type: 'vertical',
        hidden: false,
      },
      navbar: {
        type: 'floating',
        backgroundColor: '',
      },
      footer: {
        type: 'static',
      },
    },

    defaultCurrency: {} as Record<number, string>,
    currencies: {} as Record<number, any>,
    menuType: MenuType.main,
    verifiedProjects: [] as ProjectInfo[],
  }),

  getters: {
    typeMenu: state => state.layout.menu.type,

    dirOption: state => (state.layout.isRTL ? 'rtl' : 'ltr'),

    allCurrencies: state => {
      const userStore = useUserStore()

      const selectedProject
        = userStore.getSelectedProject
        || userStore.userInfo?.projects?.[0]

      return (
        state.currencies?.[selectedProject?.id]
        ?? (Object.values(state.currencies).length
          ? Object.values(state.currencies)[0]
          : ['USD'])
      )
    },

    defaultCurrencyComputed: state => {
      const userStore = useUserStore()

      const selectedProject
        = userStore.getSpecificProject
        || userStore.userInfo?.projects?.[0]

      return (
        state.defaultCurrency?.[selectedProject?.id]
        ?? (Object.values(state.defaultCurrency).length
          ? Object.values(state.defaultCurrency)[0]
          : 'USD')
      )
    },

    isMenuTypeMain: state => state.menuType === MenuType.main,

    getVerifiedProjects: state => state.verifiedProjects,
  },

  actions: {
    toggleRTL() {
      this.layout.isRTL = !this.layout.isRTL
      document.documentElement.setAttribute(
        'dir',
        this.layout.isRTL ? 'rtl' : 'ltr',
      )
    },

    updateSkin(skin: string) {
      this.layout.skin = skin
      localStorage.setItem('vuexy-skin', skin)

      if (skin === 'dark')
        document.body.classList.add('dark-layout')
      else if (document.body.classList.contains('dark-layout'))
        document.body.classList.remove('dark-layout')
    },

    updateRouterTransition(val: string) {
      this.layout.routerTransition = val
    },

    updateLayoutType(val: string) {
      this.layout.type = val
    },

    updateContentWidth(val: string) {
      this.layout.contentWidth = val
    },

    updateNavMenuHidden(val: boolean) {
      this.layout.menu.hidden = val
    },

    updateNavMenuType(val: string) {
      this.layout.menu.type = val
    },

    updateNavbarConfig(obj: Record<string, any>) {
      Object.assign(this.layout.navbar, obj)
    },

    updateFooterConfig(obj: Record<string, any>) {
      Object.assign(this.layout.footer, obj)
    },

    updateCurrency(payload: {
      id: number
      defaultCurrency: string
      currencies: string[]
    }) {
      this.defaultCurrency[payload.id] = payload.defaultCurrency
      this.currencies[payload.id] = payload.currencies
    },

    updateMenuType(menuType: MenuType) {
      this.menuType = menuType
    },

    setVerifiedProject(project: ProjectInfo) {
      if (!this.verifiedProjects?.find(p => p?.id === project?.id))
        this.verifiedProjects?.push(project)
    },

    async fetchConfig() {
      const userStore = useUserStore()
      const selectedProject = userStore.getSelectedProject

      if (
        !this.defaultCurrency[selectedProject?.id]
        && !this.currencies[selectedProject?.id]
        && userStore.userInfo?.projects.length
      ) {
        const projects = userStore.userInfo.projects

        const requests = projects.map(async (project: ProjectInfo) => {
          try {
            const values = await ApiService.request(
              {
                type: 'App.V2.Projects.Config.Read',
                data: { id: project.id },
              },
              { withErrorToast: false },
            )

            const isValid
              = values?.data
              && Object.keys(values.data).length > 0

            if (isValid)
              return { project, data: values.data }
          }
          catch {}

          return null
        })

        const results = await Promise.all(requests)

        results
          .filter(Boolean)
          .forEach(({ project, data }: any) => {
            this.updateCurrency({ ...data, id: project.id })
            this.setVerifiedProject(project)
          })
      }
    },

    onToggleMenuType() {
      this.updateMenuType(
        this.isMenuTypeMain ? MenuType.admin : MenuType.main,
      )
    },
  },
})
