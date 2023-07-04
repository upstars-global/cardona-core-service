import { Filter } from '../../@model/filter'

export default {
  namespaced: true,
  state: {
    entityName: '',
    listPath: '',
    listFilters: [],
  },
  getters: {
    listEntityName: ({ entityName }): string => entityName,
    listPath: ({ listPath }): string => listPath,
    appliedListFilters: ({ listFilters }): Array<Filter> => listFilters,
  },
  mutations: {
    SET_LIST_ENTITY_NAME(state, entityName: string = '') {
      state.entityName = entityName
    },

    SET_LIST_PATH(state, path: string = '') {
      state.listPath = path
    },

    SET_LIST_FILTERS(state, filters: Array<Filter> = []) {
      state.listFilters = filters
    },
  },
}
