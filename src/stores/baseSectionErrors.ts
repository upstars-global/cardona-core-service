import { defineStore } from 'pinia'

export const useBaseSectionErrorsStore = defineStore('errorEndpoints', {
  state: () => ({
    errorEndpoints: [] as string[],
  }),

  getters: {
    isErrorEndpoint: (state) => {
      return (urls: string[]): boolean => {
        return urls.some(url => state.errorEndpoints.includes(`/api/v2/${url}`))
      }
    },
  },

  actions: {
    addErrorUrl(url: string) {
      this.errorEndpoints.push(url)
    },

    deleteErrorUrl(url: string) {
      this.errorEndpoints = this.errorEndpoints.filter(item => item !== url)
    },

    resetErrorUrls() {
      this.errorEndpoints = []
    },
  },
})
