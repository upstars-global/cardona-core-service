import type { ProjectInfo } from '@model/project'
import { MenuType } from '../../@model/enums/menuType'
import ApiService from '../../services/api'

export default {
  namespaced: true,
  state: {
    layout: {}, /* {      isRTL: $themeConfig.layout.isRTL,
      skin: localStorage.getItem('vuexy-skin') || $themeConfig.layout.skin,
      routerTransition: $themeConfig.layout.routerTransition,
      type: $themeConfig.layout.type,
      contentWidth: $themeConfig.layout.contentWidth,
      menu: {
        type: $themeConfig.layout.menu.type,
        hidden: $themeConfig.layout.menu.hidden,
      },
      navbar: {
        type: $themeConfig.layout.navbar.type,
        backgroundColor: $themeConfig.layout.navbar.backgroundColor,
      },
      footer: {
        type: $themeConfig.layout.footer.type,
      },
    } */
    defaultCurrency: {},
    currencies: {},
    menuType: MenuType.main,
    verifiedProjects: [],
  },
  getters: {
    typeMenu: ({ layout }) => layout.menu.type,
    dirOption: ({ layout }) => (layout.isRTL ? 'rtl' : 'ltr'),
    allCurrencies: ({ currencies }, getters, _, rootGetters) => {
      const selectedProject = rootGetters.selectedProject || rootGetters.userInfo?.projects?.[0]

      return currencies?.[selectedProject?.id]
        || (Object.values(currencies).isNotEmpty ? Object.values(currencies)[0] : ['USD'])
    },
    defaultCurrency: ({ defaultCurrency }, getters, rootGetters) => {
      const selectedProject = rootGetters.user?.selectedProject || rootGetters.userInfo?.projects?.[0]

      return defaultCurrency?.[selectedProject?.id]
        || (Object.values(defaultCurrency).isNotEmpty ? Object.values(defaultCurrency)[0] : 'USD')
    },
    isMenuTypeMain(state) { return state.menuType === MenuType.main },
    verifiedProjects: ({ verifiedProjects }) => verifiedProjects,
  },
  mutations: {
    TOGGLE_RTL(state) {
      state.layout.isRTL = !state.layout.isRTL
      document.documentElement.setAttribute('dir', state.layout.isRTL ? 'rtl' : 'ltr')
    },
    UPDATE_SKIN(state, skin) {
      state.layout.skin = skin

      // Update value in localStorage
      localStorage.setItem('vuexy-skin', skin)

      // Update DOM for dark-layout
      if (skin === 'dark')
        document.body.classList.add('dark-layout')
      else if (document.body.className.match('dark-layout'))
        document.body.classList.remove('dark-layout')
    },
    UPDATE_ROUTER_TRANSITION(state, val) {
      state.layout.routerTransition = val
    },
    UPDATE_LAYOUT_TYPE(state, val) {
      state.layout.type = val
    },
    UPDATE_CONTENT_WIDTH(state, val) {
      state.layout.contentWidth = val
    },
    UPDATE_NAV_MENU_HIDDEN(state, val) {
      state.layout.menu.hidden = val
    },
    UPDATE_NAV_MENU_TYPE(state, val) {
      state.layout.menu.type = val
    },
    UPDATE_NAVBAR_CONFIG(state, obj) {
      Object.assign(state.layout.navbar, obj)
    },
    UPDATE_FOOTER_CONFIG(state, obj) {
      Object.assign(state.layout.footer, obj)
    },
    UPDATE_CURRENCY(state, { id, defaultCurrency, currencies }) {
      state.defaultCurrency[id] = defaultCurrency
      state.currencies[id] = currencies
    },
    UPDATE_MENU_TYPE(state, menuType) {
      state.menuType = menuType
    },
    UPDATE_MENU_TYPE(state, menuType) {
      state.menuType = menuType
    },
    SET_VERIFIED_PROJECT(state, project) {
      if (state.verifiedProjects.find(item => item?.id === project?.id))
        return
      state.verifiedProjects.push(project)
    },
  },
  actions: {
    async fetchConfig({ commit, state, rootGetters }) {
      if (
        !state.defaultCurrency[rootGetters.selectedProject?.id]
        && !state.currencies[rootGetters.selectedProject?.id]
        && rootGetters.userInfo?.projects.isNotEmpty
      ) {
        const projects = rootGetters.userInfo.projects

        const requests = projects.map(async (project: ProjectInfo) => {
          try {
            const values = await ApiService.request({
              type: 'App.V2.Projects.Config.Read',
              data: { id: project.id },
            }, { withErrorToast: false })

            const isValid = values?.data && Object.keys(values.data).length > 0
            if (isValid)
              return { project, data: values.data }
          }
          catch (e) {}

          return null
        })

        const results = await Promise.all(requests)

        results
          .filter(Boolean)
          .forEach(({ project, data }) => {
            commit('UPDATE_CURRENCY', { ...data, id: project.id })
            commit('SET_VERIFIED_PROJECT', project)
          })
      }
    },
    onToggleMenuType({ commit, getters }) {
      commit('UPDATE_MENU_TYPE', getters.isMenuTypeMain ? MenuType.admin : MenuType.main)
    },
  },
}
