import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import type {
  IDownloadListReportNotificationItem,
  INotificationReportItem,
  WSChanelPayload,
} from '../@model/notificationExport'
import ApiService from '../services/api'
import {
  NotificationStatuses,
} from '../@model/notificationExport'
import store from '@/store'

const notificationList = useLocalStorage<INotificationReportItem[]>('notifications', [])
export const useNotificationExportStore = defineStore('notification-export', {
  state: () => ({
    canLoadDownLoadList: true,
    downloadList: [] as IDownloadListReportNotificationItem[],
  }),
  getters: {
    getDownloadList: state => state.downloadList,
    existingNotifications: () => notificationList.value.filter(item => item?.status === NotificationStatuses.Done).isNotEmpty,
    getLastNotification: () => notificationList.value[notificationList.value.length - 1],
  },
  actions: {
    addNotification(notification: INotificationReportItem) {
      notificationList.value = [...notificationList.value, notification]
    },
    resetNotifications() {
      notificationList.value = []
    },
    updateNotification(notification: INotificationReportItem) {
      notificationList.value.splice(notificationList.value.findIndex(item => item.reportId === notification.reportId), 1, notification)
    },
    async createWSData({ data }: WSChanelPayload) {
      const existNotification = notificationList.value.find(item => item.reportId === data.reportId)
      if (existNotification) {
        this.updateNotification(data)

        return
      }
      this.addNotification(data)
    },
    async setWSData(data: INotificationReportItem) {
      console.log('Update notification: ', data)
    },
    async deleteWSData(data: INotificationReportItem) {
      console.log('Delete notification: ', data)
    },
    async downloadReport(reportId: number) {
      const response = await ApiService.request({
        type: 'App.V2.Report.Download.File',
        data: { project: store.getters.selectedProject?.alias, reportId },
      }, {
        responseType: 'blob',
        withResponseHeaders: true,
      })

      const disposition = response.headers['content-disposition']
      const fileNameMatch = disposition?.match(/filename="?([^"]+)"?/)
      const fileName = fileNameMatch ? fileNameMatch[1] : 'report.bin'

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')

      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    },
    async fetchEntityList(payload: { pagination: {
      pageNumber: number
      perPage: number
    } }) {
      try {
        const { data } = await ApiService.request({
          type: 'App.V2.Report.Download.List',
          pagination: payload.pagination,
          filter: { project: store.getters.selectedProject?.alias },
        }, {
          withErrorToast: false,
        }) || []

        this.canLoadDownLoadList = data.length === payload.pagination.perPage
        this.downloadList = [...this.downloadList, ...data]

        return this.downloadList
      }
      catch {}
    },
  },
})
