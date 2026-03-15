import { defineStore } from 'pinia'

export const useBaseListSelection = defineStore('baseListSelection', {
  state: () => ({
    selectedIds: new Set(),
  }),
  getters: {

  },
  actions: {},
})
