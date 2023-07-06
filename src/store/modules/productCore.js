import { productId } from '@productConfig';
export default {
    namespaced: true,
    state: {
        productId,
    },
    getters: {
        productId: ({ productId }) => productId,
    },
};
//# sourceMappingURL=productCore.js.map