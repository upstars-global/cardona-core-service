import ApiService from '../../services/api'
import { ListData } from '../../@model'
import { UserInfo } from '../../@model/users'
import { productName } from '@productConfig'

export default {
  namespaced: true,
  actions: {
    async fetchUsersList({ rootGetters }, inputData) {
      const data = inputData?.data ? inputData.data : inputData
      const isMenuTypeAdmin = !rootGetters['appConfigCore/isMenuTypeMain']

      return new ListData(
        await ApiService.request({
          type: 'App.V2.Users.List',
          pagination: {
            pageNumber: data?.page || 1,
            perPage: data?.perPage || 20,
          },
          filter: {
            productIds: isMenuTypeAdmin ? [] : [rootGetters['productCore/productId']],
            ...data?.filter,
          },
        }),
        UserInfo,
      )
    },

    async updateUserPassword(_, payload) {
      await ApiService.request({
        type: `App.V2.${
          productName.charAt(0).toUpperCase() + productName.slice(1)
        }.Users.Password.Update`,
        data: {
          ...payload,
        },
      })
    },
  },
}
