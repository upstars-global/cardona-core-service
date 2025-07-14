import { defineStore } from 'pinia'
import { productId } from '@productConfig'

export const useProductStore = defineStore('product', {
  state: () => ({
    productId,
  }),

  getters: {
    productId(state): number | null {
      return state.productId
    },
  },
})
