import ApiService from '../../services/api'
import { ListData } from '../../@model'
import { UserInfo } from '../../@model/user'

export default {
  namespaced: true,
  actions: {
    async fetchUsersList({ rootGetters, rootState }, inputData) {
      const data = inputData?.data ? inputData.data : inputData
      const isMenuTypeAdmin = rootState.appConfigCore.layout.menu.type === 'admin'
      return new ListData(
        await ApiService.request({
          type: 'App.V2.Users.List',
          pagination: {
            pageNumber: data?.page || 1,
            perPage: data?.perPage || 20,
          },
          filter: {
            productIds: isMenuTypeAdmin ? [] : [rootGetters['product/productId']],
            ...data?.filter,
          },
        }),
        UserInfo
      )
    },

    async updateUserPassword(_, payload) {
      await ApiService.request({
        type: 'App.V2.Users.Password.Update',
        data: {
          ...payload,
        },
      })
    },
  },
}
