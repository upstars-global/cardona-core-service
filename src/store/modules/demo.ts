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
  },
}
