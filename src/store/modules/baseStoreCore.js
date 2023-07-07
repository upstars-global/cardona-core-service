import ApiService from '../../services/api';
import { ListData } from '../../@model';
import { ExportFormat } from '../../components/templates/BaseList/model';
import { convertLowerCaseFirstSymbol } from '../../helpers';
import { ApiTypePrefix, productName } from '@productConfig';
import { productsName } from '../../configs/productsName';
import { isUndefined } from 'lodash';
const isSymbolIsDash = (symbol) => symbol === '-';
export const transformNameToType = (type) => {
    return [...type]
        .map((item, index) => {
        //First symbol
        if (index === 0) {
            return item.toUpperCase();
        }
        else if (isSymbolIsDash(item)) {
            return '';
        }
        else if (item.toUpperCase() === item) {
            if (isSymbolIsDash(type[index - 1]))
                return item;
            return '.' + item;
        }
        else {
            return item;
        }
    })
        .join('');
};
// @ts-ignore
const isNeocoreProduct = productName === productsName.neocore;
const combineFilter = (filters, project) => {
    const filter = {
        ...filters,
        project: isNeocoreProduct ? project : undefined,
    };
    return Object.values(filter).some((value) => !isUndefined(value)) ? filter : undefined;
};
export default {
    namespaced: true,
    actions: {
        async fetchEntityList({ commit, rootGetters }, payload) {
            return new ListData(await ApiService.request({
                type: `${payload.options.customApiPrefix || ApiTypePrefix}${transformNameToType(payload.type)}.List`,
                pagination: {
                    pageNumber: payload.data?.page || 1,
                    perPage: payload.data?.perPage || 10,
                },
                sort: payload.data?.sort,
                filter: combineFilter(payload.data?.filter, rootGetters.selectedProject?.alias),
            }), payload.options?.listItemModel);
        },
        async fetchReport({ rootGetters }, payload) {
            const response = await ApiService.request({
                type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(payload.type)}.List.Report`,
                sort: payload.data?.sort,
                pagination: {
                    pageNumber: payload.data?.page || 1,
                    perPage: payload.data?.perPage,
                },
                filter: combineFilter(payload.data?.filter, rootGetters.selectedProject?.alias),
            });
            return payload.data.filter.format === ExportFormat.JSON ? JSON.stringify(response) : response;
        },
        async readEntity({ rootGetters }, payload) {
            const { data } = await ApiService.request({
                type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(payload.type)}.Read`,
                data: {
                    id: payload.id,
                    project: isNeocoreProduct ? rootGetters.selectedProject?.alias : '',
                },
            });
            return data;
        },
        async fetchTypes({ rootGetters }, type) {
            return await ApiService.request({
                type: ApiTypePrefix + transformNameToType(type) + '.Types.List',
                data: {
                    project: isNeocoreProduct ? rootGetters.selectedProject?.alias : '',
                },
            });
        },
        async createEntity({ rootGetters }, payload) {
            const { data } = await ApiService.request({
                type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(payload.type)}.Create`,
                data: {
                    ...payload.data.form,
                    id: payload.data.form?.id,
                    project: isNeocoreProduct ? rootGetters.selectedProject?.alias : '',
                    productId: rootGetters['productCore/productId'],
                },
            }, { withSuccessToast: true, formRef: payload.data.formRef, entityName: payload.type });
            return data;
        },
        async updateEntity({ rootGetters }, payload) {
            return await ApiService.request({
                type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(payload.type)}.Update`,
                data: {
                    ...payload.data.form,
                    id: payload.data.form?.id,
                    productId: rootGetters['productCore/productId'],
                    project: isNeocoreProduct ? rootGetters.selectedProject?.alias : '',
                },
            }, { withSuccessToast: true, formRef: payload.data.formRef, entityName: payload.type });
        },
        async multipleUpdateEntity({ rootGetters }, payload) {
            const entityKey = convertLowerCaseFirstSymbol(payload.type);
            return await ApiService.request({
                type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(payload.type)}.Update.Multiple`,
                data: {
                    project: isNeocoreProduct ? rootGetters.selectedProject?.alias : '',
                    [entityKey]: payload.data,
                },
            }, { withSuccessToast: true });
        },
        async deleteEntity({ rootGetters }, payload) {
            return await ApiService.request({
                type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(payload.type)}.Delete`,
                data: {
                    id: payload.id,
                    comment: payload.comment,
                    project: isNeocoreProduct ? rootGetters.selectedProject?.alias : '',
                },
            }, { withSuccessToast: true });
        },
        async multipleDeleteEntity({ rootGetters }, payload) {
            return await ApiService.request({
                type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(payload.type)}.Delete.Multiple`,
                data: {
                    ids: payload.ids,
                    project: isNeocoreProduct ? rootGetters.selectedProject?.alias : '',
                },
            }, { withSuccessToast: true });
        },
    },
};
//# sourceMappingURL=baseStoreCore.js.map