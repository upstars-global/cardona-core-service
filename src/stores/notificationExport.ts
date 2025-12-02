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

function upsert<T extends { reportId: number }>(
  list: T[],
  item: T,
): T[] {
  const index = list.findIndex(x => x.reportId === item.reportId)

  if (index === -1)
    return [...list, item]

  return [
    ...list.slice(0, index),
    item,
    ...list.slice(index + 1),
  ]
}

const notificationList = useLocalStorage<INotificationReportItem[]>('notifications', [])

const getDate = (date: string) => new Date(date.replace(' ', 'T'))
const compareDates = (date: string) => (item: IDownloadListReportNotificationItem | INotificationReportItem) => getDate(item.ttl) >= getDate(date)

export const useNotificationExportStore = defineStore('notification-export', {
  state: () => ({
    canLoadDownLoadList: true,
    downloadList: [] as IDownloadListReportNotificationItem[],
  }),
  getters: {
    getDownloadList: state => state.downloadList,
    existingNotifications: () => (userId: number) => notificationList.value
      .filter(item => item?.status === NotificationStatuses.Done && item.emitter.id === userId)
      .isNotEmpty,
    getLastNotification: () => notificationList.value[notificationList.value.length - 1],
  },
  actions: {
    resetNotifications() {
      notificationList.value = []
    },
    resetDownloadList() {
      this.downloadList = []
    },
    async createWSData({ data, emitter }: WSChanelPayload) {
      data.emitter = emitter

      console.log(notificationList.value.find(item => data.reportId === item.reportId))
      notificationList.value = upsert<INotificationReportItem>(notificationList.value, data)

      this.downloadList = upsert<IDownloadListReportNotificationItem | INotificationReportItem>(this.downloadList, data)
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
    removeExpiredReports(date: string) {
      this.downloadList = this.downloadList.filter(compareDates(date))
      notificationList.value = notificationList.value.filter(compareDates(date))
    },
  },
})
