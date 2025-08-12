import { defineStore } from 'pinia'
import ApiService from '../services/api'
import type { IRequestListPayload } from '../@model'
import { ListData } from '../@model'
import { transformNameToType } from './baseStoreCore'
import { ApiTypePrefix } from '@productConfig'

interface EntityListPayload {
  type: string
  data: IRequestListPayload
}

interface ReadEntityPayload {
  type: string
  id: string
  customApiPrefix?: string
}

interface UpdateEntityPayload {
  type: string
  customApiPrefix?: string
  data: {
    form: Record<string, any>
    formRef: any
  }
}

interface DeleteEntityPayload {
  type: string
  id: string
  comment: string
  customApiPrefix?: string
}

export const useDemoStore = defineStore('demo', {
  actions: {
    async fetchEntityList(payload: EntityListPayload) {
      const response = await ApiService.request({
        type: `${payload.data?.typePrefix || ApiTypePrefix}${transformNameToType(payload.type)}.List`,
        pagination: {
          pageNumber: payload.data?.page || 1,
          perPage: payload.data?.perPage || 10,
        },
        filter: {
          ...payload.data.filter,
        },
      })

      return new ListData(response)
    },

    async fetchOptions() {
      const response = await ApiService.request({
        type: `${ApiTypePrefix}Options.List`,
      })

      return new ListData(response)
    },

    async readEntity(payload: ReadEntityPayload) {
      const { data } = await ApiService.request({
        type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(payload.type)}.Read`,
        data: {
          id: payload.id,
        },
      })

      return data
    },

    async updateEntity(payload: UpdateEntityPayload) {
      return await ApiService.request(
        {
          type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(payload.type)}.Update`,
          data: {
            ...payload.data.form,
            id: payload.data.form?.id,
          },
        },
        {
          withSuccessToast: true,
          formRef: payload.data.formRef,
        },
      )
    },

    async deleteEntity(payload: DeleteEntityPayload) {
      return await ApiService.request(
        {
          type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(payload.type)}.Delete`,
          data: {
            id: payload.id,
            comment: payload.comment,
          },
        },
        {
          withSuccessToast: true,
        },
      )
    },
  },
})
