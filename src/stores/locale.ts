import { defineStore } from 'pinia'
import { LocaleOption } from '../@model/locale'
import ApiService from '../services/api'

export const useLocaleStore = defineStore('locale', {
  state: () => ({
    allLocales: {} as Record<string, string>,
  }),
  getters: {
    getAllLocalesOptions: ({ allLocales }) => Object.entries(allLocales).map(([code, name]): LocaleOption => new LocaleOption(code, name)),
  },
  actions: {
    async fetchLocalesList() {
      if (this.getAllLocalesOptions.isNotEmpty)
        return

      const { data } = await ApiService.request({
        type: 'App.V2.Core.System.Locales',
      })

      this.allLocales = data.locales
    },
  },
})
