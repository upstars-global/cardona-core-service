import ApiService from '../../services/api';
import { ApiTypePrefix } from '@productConfig';
import { ListData } from '../../@model';
import { transformNameToType } from './baseStoreCore';
export default {
    namespaced: true,
    actions: {
        async fetchDemoList(_, payload) {
            return new ListData(await ApiService.request({
                type: `${ApiTypePrefix}${transformNameToType(payload.type)}.List`,
                pagination: {
                    pageNumber: payload.data?.page || 1,
                    perPage: payload.data?.perPage || 10,
                },
                filter: {
                    ...payload?.data.filter,
                },
            }));
        },
        async fetchOptions() {
            return new ListData(await ApiService.request({
                type: ApiTypePrefix + 'Options.List',
            }));
        },
        async readEntity(_, payload) {
            const { data } = await ApiService.request({
                type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(payload.type)}.Read`,
                data: {
                    id: payload.id,
                },
            });
            return data;
        },
        async updateEntity(_, payload) {
            return await ApiService.request({
                type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(payload.type)}.Update`,
                data: {
                    ...payload.data.form,
                    id: payload.data.form?.id,
                },
            }, { withSuccessToast: true, formRef: payload.data.formRef });
        },
        async deleteEntity(_, payload) {
            return await ApiService.request({
                type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(payload.type)}.Delete`,
                data: {
                    id: payload.id,
                    comment: payload.comment,
                },
            }, { withSuccessToast: true });
        },
    },
};
//# sourceMappingURL=demo.js.map