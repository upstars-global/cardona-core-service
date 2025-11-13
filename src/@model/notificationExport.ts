import type { TranslateResult } from 'vue-i18n'
import { i18n } from '../plugins/i18n'
import { IconsList } from './enums/icons'
import { VColors } from './vuetify'

// export enum NotificationStatuses {
//   Waiting = 'Waiting',
//   Loading = 'Loading...',
//   Done = 'Done',
//   Error = 'Error',
// }

export enum NotificationStatuses {
  Started = 'Started',
  Loading = 'Loading',
  Done = 'Done',
  Error = 'Error',
}

const notificationStatusIcons: Record<NotificationStatuses, IconsList> = {
  [NotificationStatuses.Started]: IconsList.ArrowRight,
  [NotificationStatuses.Loading]: IconsList.RefreshCwIcon,
  [NotificationStatuses.Done]: IconsList.CheckIcon,
  [NotificationStatuses.Error]: IconsList.ExclamationMark,
  [NotificationStatuses.Started.toLowerCase()]: IconsList.ArrowRight,
  [NotificationStatuses.Loading.toLowerCase()]: IconsList.RefreshCwIcon,
  [NotificationStatuses.Done.toLowerCase()]: IconsList.CheckIcon,
  [NotificationStatuses.Error.toLowerCase()]: IconsList.ExclamationMark,
}

const notificationStatusColor: Record<NotificationStatuses, VColors> = {
  [NotificationStatuses.Started]: VColors.Secondary,
  [NotificationStatuses.Loading]: VColors.Info,
  [NotificationStatuses.Done]: VColors.Success,
  [NotificationStatuses.Error]: VColors.Error,
  [NotificationStatuses.Started.toLowerCase()]: VColors.Secondary,
  [NotificationStatuses.Loading.toLowerCase()]: VColors.Info,
  [NotificationStatuses.Done.toLowerCase()]: VColors.Success,
  [NotificationStatuses.Error.toLowerCase()]: VColors.Error,
}

export const notificationStatesLabel: Record<NotificationStatuses, TranslateResult | string> = {
  [NotificationStatuses.Started]: i18n.t(`notification.${NotificationStatuses.Started}`),
  [NotificationStatuses.Loading]: i18n.t(`notification.${NotificationStatuses.Loading}`),
  [NotificationStatuses.Done]: '',
  [NotificationStatuses.Error]: '',
  [NotificationStatuses.Started.toLowerCase()]: i18n.t(`notification.${NotificationStatuses.Started}`),
  [NotificationStatuses.Loading.toLowerCase()]: i18n.t(`notification.${NotificationStatuses.Loading}`),
  [NotificationStatuses.Done.toLowerCase()]: '',
  [NotificationStatuses.Error.toLowerCase()]: '',
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
  reportId: string
  entityType: string
  status: NotificationStatuses
  project: string
  emitter: ReportEmitter
}

export interface INotificationEmitEvent {
  (event: 'download-report', payload: number): void
}

export const isNotificationWithStatusDone = (item: IDownloadListReportNotificationItem | INotificationReportItem) => item?.status === NotificationStatuses.Done || item?.status === NotificationStatuses.Done?.toLowerCase()
