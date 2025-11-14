import { defineStore } from 'pinia'
import { isUndefined } from 'lodash'
import { useRouter } from 'vue-router'
import ApiService from '../services/api'
import { useRedirectToNotFoundPage } from '../helpers/router'
import type { IRequestListPayload } from '../@model'
import { ListData } from '../@model'
import { convertLowerCaseFirstSymbol } from '../helpers'
import { productsName } from '../configs/productsName'
import { ExportFormat } from '../@model/templates/baseList'
import { ApiTypePrefix, productName } from '@productConfig'
import store from '@/store'

const isSymbolIsDash = (symbol: string): boolean => symbol === '-'

export const transformNameToType = (type: string): string =>
  [...type]
    .map((item, index) => {
      if (index === 0) {
        return item.toUpperCase()
      }
      else if (isSymbolIsDash(item)) {
        return ''
      }
      else if (item.toUpperCase() === item) {
        // preserve uppercase after dash
        return isSymbolIsDash(type[index - 1]) ? item : `.${item}`
      }
      else {
        return item
      }
    })
    .join('')

// @ts-expect-error
const isNeocoreProduct = productName === productsName.neocore

const combineFilter = (
  filters: Record<string, any> = {},
  projectAlias?: string,
): Record<string, any> | undefined => {
  const filter = {
    ...filters,
    project: isNeocoreProduct ? projectAlias : undefined,
  }

  return Object.values(filter).some(v => !isUndefined(v)) ? filter : undefined
}

const reportFactory = (isSpecificReport = false) => async (
  payload: { type: string; data: IRequestListPayload; customApiPrefix?: string },
): Promise<Blob | string> => {
  const paramKey = isSpecificReport ? 'data' : 'filter'
  const projectAlias = store.getters.selectedProject?.alias
  const typeSuffix = isSpecificReport ? 'Load.' : ''

  const response = await ApiService.request(
    {
      type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(
        payload.type,
      )}.${typeSuffix}List.Report`,
      sort: payload.data.sort,
      pagination: {
        pageNumber: payload.data.page ?? 1,
        perPage: payload.data.perPage,
      },
      [paramKey]: combineFilter(payload.data.filter, projectAlias),
    },
    {
      withSuccessToast: isSpecificReport,
      successToastTitle: isSpecificReport ? 'reportLoad' : undefined,
      responseType:
        payload.data.filter.format === ExportFormat.XLSX ? 'blob' : 'json',
    },
  )

  return payload.data.filter.format === ExportFormat.JSON
    ? JSON.stringify(response)
    : response
}

export const useBaseStoreCore = defineStore('baseStoreCore', {
  actions: {
    async fetchEntityList(
      payload: {
        type: string
        data: IRequestListPayload
        options: { customApiPrefix?: string; listItemModel?: any }
      },
    ): Promise<ListData> {
      const projectAlias = store.getters.selectedProject?.alias

      const response = await ApiService.request({
        type: `${payload.options.customApiPrefix || ApiTypePrefix}${transformNameToType(
          payload.type,
        )}.List`,
        pagination: {
          pageNumber: payload.data.page ?? 1,
          perPage: payload.data.perPage ?? 10,
        },
        sort: payload.data.sort,
        filter: combineFilter(payload.data.filter, projectAlias),
      })

      return new ListData(response, payload.options.listItemModel)
    },

    fetchReport: reportFactory(),
    specificFetchReport: reportFactory(true),
    async readEntity(payload: {
      type: string
      id: string
      customApiPrefix?: string
    }): Promise<any> {
      const projectAlias = store.getters.selectedProject?.alias
      const router = useRouter()
      const redirectToNotFoundPage = useRedirectToNotFoundPage(router)

      try {
        const { data } = await ApiService.request({
          type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(
            payload.type,
          )}.Read`,
          data: {
            id: payload.id,
            project: isNeocoreProduct ? projectAlias : '',
          },
        })

        return data
      }
      catch (error: any) {
        const wasRedirect = await redirectToNotFoundPage(error.type)
        if (wasRedirect)
          return

        return Promise.reject(error)
      }
    },
    async fetchTypes(type: string): Promise<any> {
      const projectAlias = store.getters.selectedProject?.alias

      return ApiService.request({
        type: `${ApiTypePrefix + transformNameToType(type)}.Types.List`,
        data: {
          project: isNeocoreProduct ? projectAlias : '',
        },
      })
    },

    async createEntity(payload: {
      type: string
      data: { form: any; formRef: any }
      customApiPrefix?: string
    }): Promise<any> {
      const actualProject = payload?.data?.form?.project
        ? payload?.data?.form?.project
        : isNeocoreProduct
          ? store.getters.selectedProject?.alias
          : ''

      const productId = store.getters['productCore/productId']

      const { data } = await ApiService.request(
        {
          type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(
            payload.type,
          )}.Create`,
          data: {
            ...payload.data.form,
            id: payload.data.form.id,
            project: actualProject,
            productId,
          },
        },
        {
          withSuccessToast: true,
          formRef: payload.data.formRef,
          entityName: payload.type,
        },
      )

      return data
    },

    async updateEntity(payload: {
      type: string
      data: { form: any; formRef: any }
      customApiPrefix?: string
    }): Promise<any> {
      const productId = store.getters['productCore/productId']

      const actualProject = payload?.data?.form?.project
        ? payload?.data?.form?.project
        : isNeocoreProduct
          ? store.getters.selectedProject?.alias
          : ''

      return ApiService.request(
        {
          type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(
            payload.type,
          )}.Update`,
          data: {
            ...payload.data.form,
            id: payload.data.form.id,
            productId,
            project: actualProject,
          },
        },
        {
          withSuccessToast: true,
          formRef: payload.data.formRef,
          entityName: payload.type,
        },
      )
    },

    async toggleStatusEntity(payload: {
      type: string
      data: { form: any; formRef: any }
      customApiPrefix?: string
    }): Promise<any> {
      const actualProject = payload?.data?.form?.project
        ? payload?.data?.form?.project
        : isNeocoreProduct
          ? store.getters.selectedProject?.alias
          : ''

      return ApiService.request(
        {
          type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(
            payload.type,
          )}.Active.Switch`,
          data: {
            ...payload.data.form,
            id: payload.data.form.id,
            project: actualProject,
          },
        },
        {
          withSuccessToast: true,
          formRef: payload.data.formRef,
          entityName: payload.type,
        },
      )
    },

    async multipleUpdateEntity(payload: {
      type: string
      data: Array<{ id: string; isActive: boolean }>
      customApiPrefix?: string
    }): Promise<any> {
      const projectAlias = store.getters.selectedProject?.alias
      const entityKey = convertLowerCaseFirstSymbol(payload.type)

      return ApiService.request(
        {
          type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(
            payload.type,
          )}.Update.Multiple`,
          data: {
            project: isNeocoreProduct ? projectAlias : '',
            [entityKey]: payload.data,
          },
        },
        { withSuccessToast: true },
      )
    },

    async deleteEntity(payload: {
      type: string
      id: string
      comment: string
      customApiPrefix?: string
    }): Promise<any> {
      const projectAlias = store.getters.selectedProject?.alias

      return ApiService.request(
        {
          type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(
            payload.type,
          )}.Delete`,
          data: {
            id: payload.id,
            comment: payload.comment,
            project: isNeocoreProduct ? projectAlias : '',
          },
        },
        { withSuccessToast: true, entityName: payload.type },
      )
    },

    async multipleDeleteEntity(payload: {
      type: string
      ids: string[]
      customApiPrefix?: string
    }): Promise<any> {
      const projectAlias = store.getters.selectedProject?.alias

      return ApiService.request(
        {
          type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(
            payload.type,
          )}.Delete.Multiple`,
          data: {
            ids: payload.ids,
            project: isNeocoreProduct ? projectAlias : '',
          },
        },
        { withSuccessToast: true },
      )
    },
  },
})
