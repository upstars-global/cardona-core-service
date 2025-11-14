import type { TranslateResult } from 'vue-i18n'
import { i18n } from '../plugins/i18n'
import { IconsList } from './enums/icons'
import { VColors } from './vuetify'

export enum NotificationStatuses {
  Waiting = 'Waiting',
  Loading = 'Loading...',
  Done = 'Done',
  Error = 'Error',
}

export enum ReportFileStatus {
  Started = 'started',
  Loading = 'loading',
  Done = 'done',
  Error = 'error',
}

const notificationStatusIcons: Record<ReportFileStatus, IconsList> = {
  [ReportFileStatus.Started]: IconsList.ArrowRight,
  [ReportFileStatus.Loading]: IconsList.RefreshCwIcon,
  [ReportFileStatus.Done]: IconsList.CheckIcon,
  [ReportFileStatus.Error]: IconsList.ExclamationMark,
}

const notificationStatusColor: Record<ReportFileStatus, VColors> = {
  [ReportFileStatus.Started]: VColors.Secondary,
  [ReportFileStatus.Loading]: VColors.Info,
  [ReportFileStatus.Done]: VColors.Success,
  [ReportFileStatus.Error]: VColors.Error,
}

export const notificationStatesLabel: Record<ReportFileStatus, TranslateResult | string> = {
  [ReportFileStatus.Started]: i18n.t(`notification.${ReportFileStatus.Started}`),
  [ReportFileStatus.Loading]: i18n.t(`notification.${ReportFileStatus.Loading}`),
  [ReportFileStatus.Done]: i18n.t(`notification.${ReportFileStatus.Done}`),
  [ReportFileStatus.Error]: '',
}

export const getNotificationIcon = (status: ReportFileStatus) => notificationStatusIcons[status]
export const getNotificationColor = (status: ReportFileStatus) => notificationStatusColor[status]
export const getNotificationStatus = (status: ReportFileStatus) => notificationStatesLabel[status] || ''

export interface IDownloadListReportNotificationItem {
  reportId: number
  entityType: string
  fileUid: string
  format: string
  ttl: string
  status: ReportFileStatus
  message: string
}

interface ReportEmitter {
  id: number
  username: string
}

export interface WSChanelPayload {
  data: INotificationReportItem
  type: string
  project: string
  emitter: ReportEmitter
}

export interface INotificationReportItem {
  reportId: number
  entityType: string
  status: NotificationStatuses
  project: string
  emitter: ReportEmitter
}

export interface INotificationEmitEvent {
  (event: 'download-report', payload: number): void
}

export const canDownloadReport = (status: ReportFileStatus) => status === ReportFileStatus.Done
export const canShowToastNotification = (status: NotificationStatuses) => status === NotificationStatuses.Done
export const showFileDate = (status: ReportFileStatus) => [ReportFileStatus.Done, ReportFileStatus.Error].includes(status)
