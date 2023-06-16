export default {
  state: {
    errorEndpoints: [],
  },

  getters: {
    isErrorEndpoint:
      ({ errorEndpoints }) =>
      (url: Array<string>): boolean =>
        url.some((url) => errorEndpoints.includes(`/api/v2/${url}`)),
  },

  mutations: {
    SET_ERROR(state, url) {
      state.errorEndpoints.push(url)
    },

    DELETE_ERROR(state, url) {
      state.errorEndpoints = state.errorEndpoints.filter((item) => item !== url)
    },

    RESET_ERROR_URLS(state) {
      state.errorEndpoints = []
    },
  },

  actions: {
    addErrorUrl({ commit }, url: string) {
      commit('SET_ERROR', url)
    },

    deleteErrorUrl({ commit }, url: string) {
      commit('DELETE_ERROR', url)
    },

    resetErrorUrls({ commit }) {
      commit('RESET_ERROR_URLS')
    },
  },
}
