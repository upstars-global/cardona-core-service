import { defineStore } from 'pinia'

export const useNotificationExportStore = defineStore('notification-export', {
  state: () => ({

  }),
  getters: {},
  actions: {
    async createWSData(data: any) {
      console.log('Set notification: ', data)
    },
    async setWSData(data: any) {
      console.log('Update notification: ', data)
    },
    async deleteWSData(data: any) {
      console.log('Delete notification: ', data)
    },
  },
})
