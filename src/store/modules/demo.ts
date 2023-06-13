import ApiService from '../../services/api'
import { ApiTypePrefix } from '@productConfig'
import { transformNameToType } from './baseStoreCore'
import { ListData } from '../../@model'

export default {
  namespaced: true,

  actions: {
    async fetchDemoList(_, { type }: { type: string }) {
      return new ListData(
        await ApiService.request({
          type: ApiTypePrefix + transformNameToType(type) + '.List',
        })
      )
    },

    async fetchOptions() {
      return new ListData(
        await ApiService.request({
          type: ApiTypePrefix + 'Options.List',
        })
      )
    },

    async readEntity(_, payload: { type: string; id: string; customApiPrefix: string }) {
      const { data } = await ApiService.request({
        type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(
          payload.type
        )}.Read`,
        data: {
          id: payload.id,
        },
      })

      return data
    },

    async updateEntity(
      _,
      payload: { type: string; data: { form: any; formRef: any }; customApiPrefix: string }
    ) {
      return await ApiService.request(
        {
          type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(
            payload.type
          )}.Update`,
          data: {
            ...payload.data.form,
            id: payload.data.form?.id,
          },
        },
        { withSuccessToast: true, formRef: payload.data.formRef }
      )
    },

    async deleteEntity(_, payload: { type: string; id: string; comment: string; customApiPrefix }) {
      return await ApiService.request(
        {
          type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(
            payload.type
          )}.Delete`,
          data: {
            id: payload.id,
            comment: payload.comment,
          },
        },
        { withSuccessToast: true }
      )
    },
  },
}
