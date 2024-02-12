import ApiService from '../../services/api'
import { transformNameToType } from './baseStoreCore'
import { ApiTypePrefix } from '@productConfig'

export default {
  namespaced: true,

  actions: {
    async readEntity(_, payload: { type: string; id: string; customApiPrefix: string }) {
      const { data } = await ApiService.request({
        type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(
          payload.type,
        )}.Read`,
        data: {
          id: payload.id,
        },
      })

      return data
    },

    async updateEntity(
      { commit, rootGetters },
      payload: { type: string; data: { form: any; formRef: any }; customApiPrefix: string },
    ) {
      const user = {
        ...rootGetters.userInfo,
        permissions: payload.data.form.permissions,
      }

      commit('SET_USER_INFO', user, { root: true })

      return await ApiService.request(
        {
          type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(
            payload.type,
          )}.Update`,
          data: {
            ...payload.data.form,
            id: payload.data.form?.id,
          },
        },
        { withSuccessToast: true, formRef: payload.data.formRef },
      )
    },
  },
}
