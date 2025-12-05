import { defineStore } from 'pinia'
import { productId } from '@productConfig'

export const useProductCoreStore = defineStore('product', {
  state: () => ({
    productId,
  }),

  getters: {
    productId(state): number | null {
      return state.productId
    },
  },
})
