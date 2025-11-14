import type { TranslateResult } from 'vue-i18n'
import { i18n } from '../plugins/i18n'
import { IconsList } from './enums/icons'
import { VColors } from './vuetify'

export enum NotificationStatuses {
  Started = 'started',
  Loading = 'loading',
  Done = 'done',
  Error = 'error',
}

const notificationStatusIcons: Record<NotificationStatuses, IconsList> = {
  [NotificationStatuses.Started]: IconsList.ArrowRight,
  [NotificationStatuses.Loading]: IconsList.RefreshCwIcon,
  [NotificationStatuses.Done]: IconsList.CheckIcon,
  [NotificationStatuses.Error]: IconsList.ExclamationMark,
}

const notificationStatusColor: Record<NotificationStatuses, VColors> = {
  [NotificationStatuses.Started]: VColors.Secondary,
  [NotificationStatuses.Loading]: VColors.Info,
  [NotificationStatuses.Done]: VColors.Success,
  [NotificationStatuses.Error]: VColors.Error,
}

export const notificationStatesLabel: Record<NotificationStatuses, TranslateResult | string> = {
  [NotificationStatuses.Started]: i18n.t(`notification.${NotificationStatuses.Started}`),
  [NotificationStatuses.Loading]: i18n.t(`notification.${NotificationStatuses.Loading}`),
  [NotificationStatuses.Done]: i18n.t(`notification.${NotificationStatuses.Done}`),
  [NotificationStatuses.Error]: '',
}

export const getNotificationIcon = (status: NotificationStatuses) => notificationStatusIcons[status]
export const getNotificationColor = (status: NotificationStatuses) => notificationStatusColor[status]
export const getNotificationStatus = (status: NotificationStatuses) => notificationStatesLabel[status] || ''

export interface IDownloadListReportNotificationItem {
  reportId: number
  entityType: string
  fileUid: string
  format: string
  ttl: string
  status: NotificationStatuses
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

export const reportIsReady = (status: NotificationStatuses) => status === NotificationStatuses.Done
export const showFileDate = (status: NotificationStatuses) => [NotificationStatuses.Done, NotificationStatuses.Error].includes(status)
