import ApiService from '../../services/api'
import type { OptionsItem } from '../../@model'
import { ListData } from '../../@model'

export default {
  namespaced: true,
  actions: {
    async fetchTags({ rootGetters }) {
      return new ListData<OptionsItem>(
        await ApiService.request({
          type: 'App.V2.Tags.List',
          filter: {
            project: rootGetters.selectedProject.alias,
          },
        }),
      )
    },
  },
}
