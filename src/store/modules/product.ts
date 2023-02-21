export default {
  namespaced: true,
  state: {
    productId: 1,
  },

  getters: {
    productId: ({ productId }): number => productId,
  },
}
