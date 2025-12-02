import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import _ from 'lodash'
import type {
  IDownloadListReportNotificationItem,
  INotificationReportItem,
  WSChanelPayload,
} from '../@model/notificationExport'
import ApiService from '../services/api'
import {
  NotificationStatuses,
} from '../@model/notificationExport'

const upsert = <ListType>(array: Array<ListType>, predicate: Partial<ListType>, newItem: ListType) => {
  const foundItem = _.find(array, predicate)
  if (foundItem) {
    const foundIndex = _.indexOf(array, foundItem)

    array.splice(foundIndex, 1, newItem)
  }
  else {
    array.unshift(newItem)
  }
}

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
    resetNotifications() {
      notificationList.value = []
    },
    resetDownloadList() {
      this.downloadList = []
    },
    async createWSData({ data }: WSChanelPayload) {
      upsert<INotificationReportItem>(notificationList.value, { reportId: data.reportId }, data)

      upsert<IDownloadListReportNotificationItem | INotificationReportItem>(this.downloadList, { reportId: data.reportId }, data)
    },
    async downloadReport(reportId: number) {
      const response = await ApiService.request({
        type: 'App.V2.Report.Download.File',
        data: { project: this.$selectedProjectAlias, reportId },
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
          filter: { project: this.$selectedProjectAlias },
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
