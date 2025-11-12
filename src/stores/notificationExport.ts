import { defineStore } from 'pinia'
import ApiService from '../services/api'
import type { IDownloadListReportNotificationItem } from '../@model/notificationExport'
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
    status: 'done',
    message: 'with long description text with description text with support description text',
  },
  {
    reportId: 102,
    entityType: 'ACTIONS_BALANCES',
    fileUid: '691469ebc5f2c506600c9cc1',
    format: 'xlsx',
    ttl: '2025-11-12 14:02:36',
    status: 'done',
    message: null,
  },
]

export const useNotificationExportStore = defineStore('notification-export', {
  state: () => ({
    downloadList: [] as IDownloadListReportNotificationItem[],
  }),
  getters: {
    getDownloadList: state => state.downloadList,
  },
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
