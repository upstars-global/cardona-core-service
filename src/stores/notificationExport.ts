import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import ApiService from '../services/api'
import type {
  IDownloadListReportNotificationItem,
  INotificationReportItem,
} from '../@model/notificationExport'
import {
  NotificationStatuses,
} from '../@model/notificationExport'
import store from '@/store'

const mock = [
  {
    reportId: 100,
    entityType: 'ACTIONS_BALANCES',
    fileUid: '691468c11fbdc35990054691',
    format: 'xlsx',
    ttl: '2025-11-12 13:57:05',
    status: 'done',
    message: null,
  },
  {
    reportId: 101,
    entityType: 'ACTIONS_BALANCES',
    fileUid: '691468c11fbdc35990054694',
    format: 'xlsx',
    ttl: '2025-11-12 13:59:08',
    status: NotificationStatuses.Waiting,
    message: 'with long description text with description text with support description text',
  },
  {
    reportId: 102,
    entityType: 'ACTIONS_BALANCES',
    fileUid: '691469ebc5f2c506600c9cc1',
    format: 'xlsx',
    ttl: '2025-11-12 14:02:36',
    status: NotificationStatuses.Error,
    message: null,
  },
]

const notificationList = useLocalStorage<INotificationReportItem[]>('notifications', [])
export const useNotificationExportStore = defineStore('notification-export', {
  state: () => ({
    downloadList: [] as IDownloadListReportNotificationItem[],
  }),
  getters: {
    getDownloadList: state => state.downloadList,
    existingNotifications: () => notificationList.value.length,
    getLastNotification: () => notificationList.value[notificationList.value.length - 1],
  },
  actions: {
    addNotification(notification: INotificationReportItem) {
      notificationList.value = [...notificationList.value, notification]
    },
    resetNotifications() {
      notificationList.value = []
    },
    async createWSData(data: INotificationReportItem) {
      this.addNotification(data)
    },
    async setWSData(data: INotificationReportItem) {
      console.log('Update notification: ', data)
    },
    async deleteWSData(data: INotificationReportItem) {
      console.log('Delete notification: ', data)
    },
    async downloadReport(reportId: number) {
      console.log('Download report: ', reportId)

      const response = await ApiService.request({
        type: 'App.V2.Report.Download.File',
        data: { project: store.getters.selectedProject?.alias, reportId },
      }, {
        responseType: 'blob',
      })

      const disposition = response.headers['content-disposition']
      const fileNameMatch = disposition?.match(/filename="?([^"]+)"?/)
      const fileName = fileNameMatch ? fileNameMatch[1] : 'report.bin'

      // Створюємо Blob і завантажуємо
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
      let data = []
      try {
        data = await ApiService.request({
          type: 'App.V2.Report.Download.List',
          pagination: payload.pagination,
          filter: { project: store.getters.selectedProject?.alias },
        }, {
          withErrorToast: false,
        }) || []
      }
      catch {
        data = { data: mock }
      }
      this.downloadList = [...this.downloadList, ...data.data]

      return this.downloadList
    },
  },
})
