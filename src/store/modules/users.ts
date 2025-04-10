import ApiService from '../../services/api'
import type { IRequestListPayload } from '../../@model'
import { ListData } from '../../@model'
import { UserInfo } from '../../@model/users'
import { productName } from '@productConfig'

export default {
  namespaced: true,
  actions: {
    async fetchUsersList({ rootGetters }, payload: IRequestListPayload) {
      const isMenuTypeAdmin = !rootGetters['appConfigCore/isMenuTypeMain']

      return new ListData(
        await ApiService.request({
          type: 'App.V2.Users.List',
          pagination: {
            pageNumber: payload?.pagination?.pageNumber || 1,
            perPage: payload?.pagination?.perPage || 20,
          },
          filter: {
            productIds: isMenuTypeAdmin ? [] : [rootGetters['productCore/productId']],
            ...payload?.filter,
          },
        }),
        UserInfo,
      )
    },

    async fetchEntityList({ rootGetters, dispatch }, payload: IRequestListPayload) {
      return await dispatch('fetchUsersList', payload)
    },

    async updateUserPassword(_, { id, password, isProduct }: { id: string; password: string; isProduct: boolean }) {
      const product = isProduct
        ? `${
          productName.charAt(0).toUpperCase() + productName.slice(1)
        }.`
        : ''

      await ApiService.request({
        type: `App.V2.${product}Users.Password.Update`,
        data: {
          id,
          password,
        },
      }, { withSuccessToast: true })
    },
  },
}
