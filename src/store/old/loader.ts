const getMappedUrl = (url: string) => url.replace(/\/api\/v\d+\//, '')

export default {
  state: {
    globalLoader: false,
    loadingEndpoints: [],
  },

  getters: {
    isLoadingEndpoint:
      ({ loadingEndpoints }) =>
        (url: string | Array<string>): boolean => {
          return Array.isArray(url)
            ? url.some(url => loadingEndpoints.some(loadingUrl => loadingUrl.includes(url)))
            : loadingEndpoints.some(loadingUrl => loadingUrl.includes(url))
        },
    isLoadingEndpointFullPath:
      ({ loadingEndpoints }) =>
        (url: string | Array<string>): boolean => {
          return Array.isArray(url)
            ? url.some(url =>
              loadingEndpoints.some(loadingUrl => getMappedUrl(url) === getMappedUrl(loadingUrl)),
            )
            : loadingEndpoints.some(loadingUrl => getMappedUrl(loadingUrl) === getMappedUrl(url))
        },
  },

  mutations: {
    SET_LOADING(state, url) {
      state.globalLoader = true
      state.loadingEndpoints.push(url)
    },

    CANCEL_LOADING(state, url) {
      state.globalLoader = false
      state.loadingEndpoints = state.loadingEndpoints.filter(item => item !== url)
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
