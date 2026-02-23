import { defineStore } from 'pinia'
import ApiService from '../services/api'
import { ListData } from '../@model'
import { UserInfo } from '../@model/users'
import { useProductCoreStore } from '../stores/productCore'
import { productName } from '@productConfig'

export const useUsersStore = defineStore('users', {
  actions: {
    async fetchUsersList(inputData?: any) {
      const productCoreStore = useProductCoreStore()
      const data = inputData?.data ? inputData.data : inputData
      const isMenuTypeAdmin = !productCoreStore.isMenuTypeMain

      return new ListData(
        await ApiService.request({
          type: 'App.V2.Users.List',
          pagination: {
            pageNumber: data?.page || 1,
            perPage: data?.perPage || 20,
          },
          filter: {
            productIds: isMenuTypeAdmin ? [] : [productCoreStore.productId],
            ...data?.filter,
          },
        }),
        UserInfo,
      )
    },

    async fetchEntityList(inputData?: any) {
      return await this.fetchUsersList(inputData)
    },

    async updateUserPassword(
      { id, password, isProduct }: { id: string; password: string; isProduct: boolean },
    ) {
      const product = isProduct
        ? `${productName.charAt(0).toUpperCase() + productName.slice(1)}.`
        : ''

      await ApiService.request(
        {
          type: `App.V2.${product}Users.Password.Update`,
          data: {
            id,
            password,
          },
        },
        { withSuccessToast: true },
      )
    },
  },
})
