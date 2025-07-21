import ApiService from '../../services/api'
import type { OptionsItem } from '../../@model'
import { ListData } from '../../@model'
import { useUserStore } from '../../stores/user'

export default {
  namespaced: true,
  actions: {
    async fetchTags() {
      const userStore = useUserStore()

      return new ListData<OptionsItem>(
        await ApiService.request({
          type: 'App.V2.Tags.List',
          filter: {
            project: userStore.selectedProject.alias,
          },
        }),
      )
    },
  },
}
