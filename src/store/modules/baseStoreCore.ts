import { isUndefined } from 'lodash'
import { useRouter } from 'vue-router'
import { useRedirectToNotFoundPage } from '../../helpers/router'
import ApiService from '../../services/api'
import type { IRequestListPayload } from '../../@model'
import { ListData } from '../../@model'

// TODO import { ExportFormat, IOptionsBaseFetch } from '../../components/templates/BaseList/model'
import { convertLowerCaseFirstSymbol } from '../../helpers'
import { productsName } from '../../configs/productsName'
import { ExportFormat } from '../../@model/templates/baseList'
import { ApiTypePrefix, productName } from '@productConfig'

const isSymbolIsDash = (symbol: string): boolean => symbol === '-'

export const transformNameToType = (type: string): string => {
  return [...type]
    .map((item, index) => {
      // First symbol
      if (index === 0) {
        return item.toUpperCase()
      }
      else if (isSymbolIsDash(item)) {
        return ''
      }
      else if (item.toUpperCase() === item) {
        if (isSymbolIsDash(type[index - 1]))
          return item

        return `.${item}`
      }
      else {
        return item
      }
    })
    .join('')
}

// @ts-expect-error
const isNeocoreProduct = productName === productsName.neocore

const combineFilter = (filters, project) => {
  const filter = {
    ...filters,
    project: isNeocoreProduct ? project : undefined,
  }

  return Object.values(filter).some(value => !isUndefined(value)) ? filter : undefined
}

export default {
  namespaced: true,

  actions: {
    async fetchEntityList({ commit, rootGetters }, payload: IRequestListPayload) {
      return new ListData(
        await ApiService.request({
          type: `${
            payload.options.customApiPrefix || ApiTypePrefix
          }${transformNameToType(payload.type || '')}.List`,
          pagination: payload.pagination,
          sort: payload?.sort,
          filter: combineFilter(payload?.filter, rootGetters.selectedProject?.alias),
        }),
        payload.options?.listItemModel,
      )
    },

    async fetchReport(
      { rootGetters },
      payload: { type: string; data: IRequestListPayload; customApiPrefix: string },
    ) {
      const response = await ApiService.request({
        type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(
          payload.type,
        )}.List.Report`,
        sort: payload.data?.sort,
        pagination: {
          pageNumber: 1,
          perPage: payload.data?.perPage,
        },
        filter: combineFilter(payload.data?.filter, rootGetters.selectedProject?.alias),
      }, {
        responseType: payload.data.filter.format === ExportFormat.XLSX ? 'blob' : 'json',
      })

      return payload.data.filter.format === ExportFormat.JSON ? JSON.stringify(response) : response
    },

    async readEntity(
      { rootGetters },
      payload: { type: string; id: string; customApiPrefix: string },
    ) {
      const router = useRouter()
      const redirectToNotFoundPage = useRedirectToNotFoundPage(router)
      try {
        const { data } = await ApiService.request({
          type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(
            payload.type,
          )}.Read`,
          data: {
            id: payload.id,
            project: isNeocoreProduct ? rootGetters.selectedProject?.alias : '',
          },
        })

        return data
      }
      catch (error) {
        const wasRedirect: boolean = await redirectToNotFoundPage(error.type)
        if (wasRedirect)
          return

        return Promise.reject(error)
      }
    },

    async fetchTypes({ rootGetters }, type: string) {
      return await ApiService.request({
        type: `${ApiTypePrefix + transformNameToType(type)}.Types.List`,
        data: {
          project: isNeocoreProduct ? rootGetters.selectedProject?.alias : '',
        },
      })
    },

    async createEntity(
      { rootGetters },
      payload: { type: string; data: { form: any; formRef: any }; customApiPrefix: string },
    ) {
      const { data } = await ApiService.request(
        {
          type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(
            payload.type,
          )}.Create`,
          data: {
            ...payload.data.form,
            id: payload.data.form?.id,
            project: isNeocoreProduct ? rootGetters.selectedProject?.alias : '',
            productId: rootGetters['productCore/productId'],
          },
        },
        { withSuccessToast: true, formRef: payload.data.formRef, entityName: payload.type },
      )

      return data
    },

    async updateEntity(
      { rootGetters },
      payload: { type: string; data: { form: any; formRef: any }; customApiPrefix: string },
    ) {
      return await ApiService.request(
        {
          type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(
            payload.type,
          )}.Update`,
          data: {
            ...payload.data.form,
            id: payload.data.form?.id,
            productId: rootGetters['productCore/productId'],
            project: isNeocoreProduct ? rootGetters.selectedProject?.alias : '',
          },
        },
        { withSuccessToast: true, formRef: payload.data.formRef, entityName: payload.type },
      )
    },

    async toggleStatusEntity(
      { rootGetters },
      payload: { type: string; data: { form: any; formRef: any }; customApiPrefix: string },
    ) {
      return await ApiService.request(
        {
          type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(
            payload.type,
          )}.Active.Switch`,
          data: {
            ...payload.data.form,
            id: payload.data.form?.id,
            project: isNeocoreProduct ? rootGetters.selectedProject?.alias : '',
          },
        },
        { withSuccessToast: true, formRef: payload.data.formRef, entityName: payload.type },
      )
    },

    async multipleUpdateEntity(
      { rootGetters },
      payload: {
        type: string
        data: Array<{ id: string; isActive: boolean }>
        customApiPrefix: string
      },
    ) {
      const entityKey: string = convertLowerCaseFirstSymbol(payload.type)

      return await ApiService.request(
        {
          type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(
            payload.type,
          )}.Update.Multiple`,
          data: {
            project: isNeocoreProduct ? rootGetters.selectedProject?.alias : '',
            [entityKey]: payload.data,
          },
        },
        { withSuccessToast: true },
      )
    },

    async deleteEntity(
      { rootGetters },
      payload: { type: string; id: string; comment: string; customApiPrefix },
    ) {
      return await ApiService.request(
        {
          type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(
            payload.type,
          )}.Delete`,
          data: {
            id: payload.id,
            comment: payload.comment,
            project: isNeocoreProduct ? rootGetters.selectedProject?.alias : '',
          },
        },
        { withSuccessToast: true },
      )
    },

    async multipleDeleteEntity(
      { rootGetters },
      payload: { type: string; ids: Array<string>; customApiPrefix: string },
    ) {
      return await ApiService.request(
        {
          type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(
            payload.type,
          )}.Delete.Multiple`,
          data: {
            ids: payload.ids,
            project: isNeocoreProduct ? rootGetters.selectedProject?.alias : '',
          },
        },
        { withSuccessToast: true },
      )
    },
  },
}
