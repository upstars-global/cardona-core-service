// src/stores/regions.ts
import { defineStore } from 'pinia'
import ApiService from 'cardona-core-service/src/services/api'
import type {
  RegionInfo as RegionInfoType,
  RegionsRequestFilter,
  RegionsResponseData,
} from 'cardona-core-service/src/@model/regions'
import { RegionInfo } from 'cardona-core-service/src/@model/regions'
import type { OptionsItem } from 'cardona-core-service/src/@model'

export const useRegionsStore = defineStore('regions', {
  state: () => ({
    countries: [] as OptionsItem[],
  }),

  getters: {
    countryList: state => ({ list: state.countries }),
    getCountryName: state => (code: string) =>
      state.countries.find(({ id }) => code === id)?.name,
    countryOptions: state => state.countries?.map(({ id }) => ({ id, name: id })),
  },

  actions: {
    async fetchRegionList(
      payload: { filter: RegionsRequestFilter },
    ): Promise<Record<string, RegionInfoType>> {
      const { data }: { data: RegionsResponseData } = await ApiService.request({
        type: 'App.V2.Core.System.Subdivisions',
        filter: {
          ...(payload?.filter || {}),
          project: this.$selectedProjectAlias,
        },
      })

      const result: Record<string, RegionInfoType> = {}

      Object.entries(data).forEach(([code, name]) => {
        const [countryCode] = code.split('-')
        const countryName: string | undefined = data[countryCode] as any

        result[code] = new RegionInfo(code, name, countryName, countryCode)
      })

      return result
    },

    async fetchCountriesList(payload: { filter: RegionsRequestFilter }) {
      if (this.countries.length)
        return { list: this.countries } // TODO: Change in task https://upstars.atlassian.net/browse/BAC-982

      const regions: Record<string, RegionInfoType> = await this.fetchRegionList(payload)

      const list: OptionsItem[] = Object.values(regions)
        .filter(item => item.code === item.countryCode)
        .map(({ code, name }) => ({ id: code, name }))

      this.countries = list

      return { list }
    },
  },
})
