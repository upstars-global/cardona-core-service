import ApiService from '../../services/api';
import { ApiTypePrefix } from '@productConfig';
import { transformNameToType } from './baseStoreCore';
export default {
    namespaced: true,
    actions: {
        async readEntity(_, payload) {
            const { data } = await ApiService.request({
                type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(payload.type)}.Read`,
                data: {
                    id: payload.id,
                },
            });
            return data;
        },
        async updateEntity({ commit, rootGetters }, payload) {
            const user = {
                ...rootGetters['userInfo'],
                permissions: payload.data.form.permissions,
            };
            commit('SET_USER_INFO', user, { root: true });
            return await ApiService.request({
                type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(payload.type)}.Update`,
                data: {
                    ...payload.data.form,
                    id: payload.data.form?.id,
                },
            }, { withSuccessToast: true, formRef: payload.data.formRef });
        },
    },
};
//# sourceMappingURL=permissions.js.map