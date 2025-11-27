import { defineStore } from 'pinia'
import { getMappedUrl } from '../helpers/index'

export const useLoaderStore = defineStore('loader', {
  state: () => ({
    globalLoader: false as boolean,
    loadingEndpoints: [] as Array<string>,
  }),
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
  actions: {
    setLoaderOn(url: string) {
      // console.log(this.$selectedProject)
      this.globalLoader = true
      this.loadingEndpoints.push(url)
    },

    setLoaderOff(url: string) {
      this.globalLoader = false
      this.loadingEndpoints = this.loadingEndpoints.filter(item => item !== url)
    },
  },
})
