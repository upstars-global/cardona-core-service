import { defineStore } from 'pinia'
import ApiService from '../services/api'
import type { IDownloadListReportNotificationItem } from '../@model/notificationExport'
import store from '@/store'

export const useNotificationExportStore = defineStore('notification-export', {
  state: () => ({
    downloadList: [] as IDownloadListReportNotificationItem[],
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
    async fetchEntityList(payload: { pagination: {
      pageNumber: number
      perPage: number
    } }) {
      const data = await ApiService.request({
        type: 'App.V2.Report.Download.List',
        pagination: payload.pagination,
        filter: { project: store.getters.selectedProject?.alias },
      })

      this.downloadList = [...this.downloadList, ...data.data]

      return this.downloadList
    },
  },
})
