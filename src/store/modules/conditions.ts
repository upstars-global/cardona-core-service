import ApiService from '../../services/api'

export default {
  namespaced: true,
  actions: {
    async fetchConditions() {
      const { data } = await ApiService.request({
        type: 'App.V2.Conditions.List',
      })

      return data
    },
  },
}
