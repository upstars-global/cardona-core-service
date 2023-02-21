import ApiService from '@/services/api'
import { LocaleInfo } from '@model/locale'

export default {
  namespaced: true,
  state: {
    allLocales: [],
  },

  getters: {
    allLocalesInfo: ({ allLocales }) =>
      Object.entries(allLocales).map(
        ([code, name]: Array<any>): LocaleInfo => new LocaleInfo(code, name)
      ),
    allLocalesKeys: ({ allLocales }) => allLocales,
  },

  mutations: {
    SET_LOCALES(state, locales) {
      state.allLocales = locales
    },
  },

  actions: {
    async getLocalesList({ commit }) {
      const { data } = await ApiService.request({
        type: 'App.V2.Core.System.Locales',
      })

      commit('SET_LOCALES', data.locales)
    },
  },
}
