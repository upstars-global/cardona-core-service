import { defineStore } from 'pinia'
import type { IDefaultFilter } from '../@model/filter'
import type { BaseField } from '../@model/templates/baseField'
import ApiService from '../services/api'

export const useFiltersStore = defineStore('filters-core', {
  state: () => ({
    entityName: '' as string,
    listPath: '' as string,
    listFilters: [] as BaseField[],
    defaultFilters: [] as IDefaultFilter[],
  }),

  getters: {
    listEntityName: (state): string => state.entityName,
    getListPath: (state): string => state.listPath,
    appliedListFilters: (state): BaseField[] => state.listFilters,
    defaultFiltersList: (state): IDefaultFilter[] => state.defaultFilters,

    isExistsEntityDefaultFilters: (state) => {
      return (keyStorage: string): boolean => {
        return state.defaultFilters.some(
          (filterData: IDefaultFilter) =>
            filterData.type === keyStorage && filterData.fields.isNotEmpty,
        )
      }
    },
  },

  actions: {
    setListEntityName(entityName = '') {
      this.entityName = entityName
    },

    setListPath(path = '') {
      this.listPath = path
    },

    setListFilters(filters: BaseField[] = []) {
      this.listFilters = filters
    },

    setDefaultFilters(filters: IDefaultFilter[]) {
      this.defaultFilters = filters
    },

    setDefaultFilter(filter: IDefaultFilter) {
      const index = this.defaultFilters.findIndex(
        (item: IDefaultFilter) => item.type === filter.type,
      )

      if (index !== -1)
        this.defaultFilters[index] = filter
      else
        this.defaultFilters.push(filter)
    },

    async saveDefaultFilter(filter: IDefaultFilter) {
      await ApiService.request({
        type: 'App.V2.Users.Filters.Store',
        data: filter,
      })

      this.setDefaultFilter(filter)
    },

    async fetchDefaultFilters(): Promise<IDefaultFilter[]> {
      if (this.defaultFilters.length > 0)
        return this.defaultFilters

      const { data }: { data: IDefaultFilter[] } = await ApiService.request({
        type: 'App.V2.Users.Filters.List',
      })

      this.setDefaultFilters(data)

      return data
    },

    clearLocalDefaultFilters() {
      this.defaultFilters = []
    },
  },
})
