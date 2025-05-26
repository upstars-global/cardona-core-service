import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { LocaleOption } from '../../@model/locale'
import ApiService from '../../services/api'

export const useLocaleStore = defineStore('locale', () => {
  const allLocales = ref<Record<string, string>>({})
  const allLocalesOptions = computed(() => Object.entries(allLocales.value).map(([code, name]): LocaleOption => new LocaleOption(code, name)))

  const getLocalesList = async () => {
    if (allLocalesOptions.value.isNotEmpty)
      return

    const { data } = await ApiService.request({
      type: 'App.V2.Core.System.Locales',
    })

    allLocales.value = data.locales
  }

  return { allLocales, allLocalesOptions, getLocalesList }
})
