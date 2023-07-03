import { $themeConfig } from '@themeConfig'
import ApiService from '../../services/api'

export default {
  namespaced: true,
  state: {
    layout: {
      isRTL: $themeConfig.layout.isRTL,
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
    },
    defaultCurrency: '',
    currencies: [],
  },
  getters: {
    typeMenu: ({ layout }) => layout.menu.type,
    dirOption: ({ layout }) => (layout.isRTL ? 'rtl' : 'ltr'),
    allCurrencies: ({ currencies }) => currencies,
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
      if (skin === 'dark') document.body.classList.add('dark-layout')
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
    UPDATE_CURRENCY(state, { defaultCurrency, currencies }) {
      state.defaultCurrency = defaultCurrency
      state.currencies = currencies
    },
  },
  actions: {
    async fetchConfig({ commit, state, rootGetters }) {
      if (!state?.defaultCurrency && !state?.currencies?.length) {
        try {
          const { data } = await ApiService.request({
            type: 'App.V2.Projects.Config.Read',
            data: {
              id: rootGetters.selectedProject.id,
            },
          })
          console.log(data)
          commit('UPDATE_CURRENCY', data)
        } catch (e) {}
      }
    },
  },
}
