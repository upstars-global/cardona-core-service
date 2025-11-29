import { defineStore } from 'pinia'
import ApiService from '../../services/api'
import { useUserStore } from '../../stores/user'
import type { UserInfo } from '../../@model/users'
import { transformNameToType } from '../old/baseStoreCore'
import { ApiTypePrefix } from '@productConfig'

export const usePermissionsStore = defineStore('permissions', {
  actions: {
    async readEntity(payload: { type: string; id: string; customApiPrefix?: string }) {
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

    async updateEntity(payload: {
      type: string
      data: { form: any; formRef: any }
      customApiPrefix?: string
    }) {
      const userStore = useUserStore()

      const user: UserInfo = {
        ...userStore.userInfo,
        permissions: payload.data.form.permissions,
      }

      userStore.setUserInfo(user)

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
        {
          withSuccessToast: true,
          formRef: payload.data.formRef,
        },
      )
    },
  },
})
