import { defineStore } from 'pinia'
import { productId } from '@productConfig'

export const useProductCoreStore = defineStore('product', {
  state: () => ({
    _productId: productId,
  }),

  getters: {
    productId(state): number | null {
      return state._productId
    },
  },
})
