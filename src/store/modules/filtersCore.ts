import type { IDefaultFilter } from '../../@model/filter'
import ApiService from '../../services/api'
import type { BaseField } from '../../@model/templates/baseField'

export default {
  namespaced: true,
  state: {
    entityName: '',
    listPath: '',
    listFilters: [],
    defaultFilters: [],
  },
  getters: {
    listEntityName: ({ entityName }): string => entityName,
    listPath: ({ listPath }): string => listPath,
    appliedListFilters: ({ listFilters }): Array<BaseField> => listFilters,
    defaultFilters: ({ defaultFilters }): IDefaultFilter[] => defaultFilters,
  },
  mutations: {
    SET_LIST_ENTITY_NAME(state, entityName = '') {
      state.entityName = entityName
    },

    SET_LIST_PATH(state, path = '') {
      state.listPath = path
    },

    SET_LIST_FILTERS(state, filters: Array<BaseField> = []) {
      state.listFilters = filters
    },

    SET_DEFAULT_FILTERS(state, filters: IDefaultFilter[]) {
      state.defaultFilters = filters
    },

    SET_DEFAULT_FILTER(state, filter: IDefaultFilter) {
      const index = state.defaultFilters.findIndex((item: IDefaultFilter) => item.type === filter.type)

      ~index ? state.defaultFilters[index] = filter : state.defaultFilters.push(filter)
    },
  },

  actions: {
    async setDefaultFilter({ commit }, filter: IDefaultFilter) {
      await ApiService.request({
        type: 'App.V2.Users.Filters.Store',
        data: filter,
      })

      commit('SET_DEFAULT_FILTER', filter)
    },

    async fetchDefaultFilters({ getters, commit }): Promise<IDefaultFilter[]> {
      if (getters.defaultFilters.isNotEmpty)
        return getters.defaultFilters

      const { data }: { data: IDefaultFilter[] } = await ApiService.request({
        type: 'App.V2.Users.Filters.List',
      })

      commit('SET_DEFAULT_FILTERS', data)

      return data
    },

    clearLocalDefaultFilters({ commit }) {
      commit('SET_DEFAULT_FILTERS', [])
    },
  },
}
