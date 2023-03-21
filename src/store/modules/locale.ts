import ApiService from '@/services/api'
import { LocaleOption } from '@model/locale'

export default {
  namespaced: true,
  state: {
    allLocales: {},
  },

  getters: {
    allLocalesKeys: ({ allLocales }) => allLocales,
    allLocalesOptions: ({ allLocales }: Record<string, string>) =>
      Object.entries(allLocales).map(([code, name]): LocaleOption => new LocaleOption(code, name)),
  },

  mutations: {
    SET_LOCALES(state, locales: Record<string, string>) {
      state.allLocales = locales
    },
  },

  actions: {
    async getLocalesList({ commit, getters }) {
      if (getters.allLocalesOptions.isNotEmpty) return

      const { data } = await ApiService.request({
        type: 'App.V2.Core.System.Locales',
      })

      commit('SET_LOCALES', data.locales)
    },
  },
}
