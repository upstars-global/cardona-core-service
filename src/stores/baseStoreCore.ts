import { isUndefined } from 'lodash'
import { useRouter } from 'vue-router'
import { defineStore } from 'pinia'
import { useRedirectToNotFoundPage } from '../helpers/router'
import ApiService from '../services/api'
import type { IRequestListPayload } from '../@model'
import { ListData } from '../@model'

// TODO import { ExportFormat, IOptionsBaseFetch } from '../../components/templates/BaseList/model'
import { convertLowerCaseFirstSymbol } from '../helpers'
import { productsName } from '../configs/productsName'
import type { IOptionsBaseFetch } from '../@model/templates/baseList'
import { ExportFormat } from '../@model/templates/baseList'
import { useUserStore } from '../stores/user'
import { useProductStore } from '../stores/productCore'
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

// const vuexStore = useStore()

export const useBaseStoreCore = defineStore('baseStoreCore', {
  actions: {
    async fetchEntityList(
      payload: {
        type: string
        data: IRequestListPayload
        options: IOptionsBaseFetch

      },
    ) {
      const userStore = useUserStore()
      console.log(userStore.selectedProject?.alias)
      return new ListData(
        await ApiService.request({
          type: `${payload.options.customApiPrefix || ApiTypePrefix}${transformNameToType(
            payload.type,
          )}.List`,
          pagination: {
            pageNumber: payload.data?.page || 1,
            perPage: payload.data?.perPage || 10,
          },
          sort: payload.data?.sort,
          filter: combineFilter(payload.data?.filter, userStore.selectedProject?.alias),
        }),
        payload.options?.listItemModel,
      )
    },

    async fetchReport(
      payload: { type: string; data: IRequestListPayload; customApiPrefix: string },
    ) {
      const userStore = useUserStore()

      const response = await ApiService.request({
        type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(
          payload.type,
        )}.List.Report`,
        sort: payload.data?.sort,
        pagination: {
          pageNumber: payload.data?.page || 1,
          perPage: payload.data?.perPage,
        },
        filter: combineFilter(payload.data?.filter, userStore.selectedProject?.alias),
      }, {
        responseType: payload.data.filter.format === ExportFormat.XLSX ? 'blob' : 'json',
      })

      return payload.data.filter.format === ExportFormat.JSON ? JSON.stringify(response) : response
    },

    async readEntity(
      payload: { type: string; id: string; customApiPrefix: string },
    ) {
      const userStore = useUserStore()

      const router = useRouter()
      const redirectToNotFoundPage = useRedirectToNotFoundPage(router)
      try {
        const { data } = await ApiService.request({
          type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(
            payload.type,
          )}.Read`,
          data: {
            id: payload.id,
            project: isNeocoreProduct ? userStore.selectedProject?.alias : '',
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

    async fetchTypes(type: string) {
      const userStore = useUserStore()

      return await ApiService.request({
        type: `${ApiTypePrefix + transformNameToType(type)}.Types.List`,
        data: {
          project: isNeocoreProduct ? userStore.selectedProject?.alias : '',
        },
      })
    },

    async createEntity(
      payload: { type: string; data: { form: any; formRef: any }; customApiPrefix: string },
    ) {
      const userStore = useUserStore()
      const productStore = useProductStore()

      const { data } = await ApiService.request(
        {
          type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(
            payload.type,
          )}.Create`,
          data: {
            ...payload.data.form,
            id: payload.data.form?.id,
            project: isNeocoreProduct ? userStore.selectedProject?.alias : '',
            productId: productStore.productId,
          },
        },
        { withSuccessToast: true, formRef: payload.data.formRef, entityName: payload.type },
      )

      return data
    },

    async updateEntity(
      payload: { type: string; data: { form: any; formRef: any }; customApiPrefix: string },
    ) {
      const userStore = useUserStore()
      const productStore = useProductStore()

      return await ApiService.request(
        {
          type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(
            payload.type,
          )}.Update`,
          data: {
            ...payload.data.form,
            id: payload.data.form?.id,
            productId: productStore.productId,
            project: isNeocoreProduct ? userStore.selectedProject?.alias : '',
          },
        },
        { withSuccessToast: true, formRef: payload.data.formRef, entityName: payload.type },
      )
    },

    async toggleStatusEntity(
      payload: { type: string; data: { form: any; formRef: any }; customApiPrefix: string },
    ) {
      const userStore = useUserStore()

      return await ApiService.request(
        {
          type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(
            payload.type,
          )}.Active.Switch`,
          data: {
            ...payload.data.form,
            id: payload.data.form?.id,
            project: isNeocoreProduct ? userStore.selectedProject?.alias : '',
          },
        },
        { withSuccessToast: true, formRef: payload.data.formRef, entityName: payload.type },
      )
    },

    async multipleUpdateEntity(
      payload: {
        type: string
        data: Array<{ id: string; isActive: boolean }>
        customApiPrefix: string
      },
    ) {
      const userStore = useUserStore()

      const entityKey: string = convertLowerCaseFirstSymbol(payload.type)

      return await ApiService.request(
        {
          type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(
            payload.type,
          )}.Update.Multiple`,
          data: {
            project: isNeocoreProduct ? userStore.selectedProject?.alias : '',
            [entityKey]: payload.data,
          },
        },
        { withSuccessToast: true },
      )
    },

    async deleteEntity(
      payload: { type: string; id: string; comment: string; customApiPrefix },
    ) {
      const userStore = useUserStore()

      return await ApiService.request(
        {
          type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(
            payload.type,
          )}.Delete`,
          data: {
            id: payload.id,
            comment: payload.comment,
            project: isNeocoreProduct ? userStore.selectedProject?.alias : '',
          },
        },
        { withSuccessToast: true, entityName: payload.type },
      )
    },

    async multipleDeleteEntity(
      payload: { type: string; ids: Array<string>; customApiPrefix: string },
    ) {
      const userStore = useUserStore()

      return await ApiService.request(
        {
          type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(
            payload.type,
          )}.Delete.Multiple`,
          data: {
            ids: payload.ids,
            project: isNeocoreProduct ? userStore.selectedProject?.alias : '',
          },
        },
        { withSuccessToast: true },
      )
    },
  },

})
