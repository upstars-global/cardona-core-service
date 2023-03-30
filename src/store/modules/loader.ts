export default {
  state: {
    globalLoader: false,
    loadingEndpoints: [],
  },

  getters: {
    isLoadingEndpoint:
      ({ loadingEndpoints }) =>
      (url: string | Array<string>): boolean =>
        Array.isArray(url)
          ? url.some((url) => loadingEndpoints.includes(`/api/v2/${url}`))
          : loadingEndpoints.includes(`/api/v2/${url}`),
  },

  mutations: {
    SET_LOADING(state, url) {
      state.globalLoader = true
      state.loadingEndpoints.push(url)
    },

    CANCEL_LOADING(state, url) {
      state.globalLoader = false
      state.loadingEndpoints = state.loadingEndpoints.filter((item) => item !== url)
    },
  },

  actions: {
    loaderOn({ commit }, url: string) {
      commit('SET_LOADING', url)
    },

    loaderOff({ commit }, url: string) {
      commit('CANCEL_LOADING', url)
    },
  },
}
