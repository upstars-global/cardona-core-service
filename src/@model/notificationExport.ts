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
  Waiting = 'waiting',
  Loading = 'loading',
  Done = 'done',
  Error = 'error',
}

const notificationStatusIcons: Record<NotificationStatuses, IconsList> = {
  [NotificationStatuses.Waiting]: IconsList.ArrowRight,
  [NotificationStatuses.Loading]: IconsList.RefreshCwIcon,
  [NotificationStatuses.Done]: IconsList.CheckIcon,
  [NotificationStatuses.Error]: IconsList.ExclamationMark,
}

const notificationStatusColor: Record<NotificationStatuses, VColors> = {
  [NotificationStatuses.Waiting]: VColors.Secondary,
  [NotificationStatuses.Loading]: VColors.Info,
  [NotificationStatuses.Done]: VColors.Success,
  [NotificationStatuses.Error]: VColors.Error,
}

export const notificationStatesLabel: Record<NotificationStatuses, TranslateResult | string> = {
  [NotificationStatuses.Waiting]: i18n.t(`notification.${NotificationStatuses.Waiting}`),
  [NotificationStatuses.Loading]: i18n.t(`notification.${NotificationStatuses.Loading}`),
  [NotificationStatuses.Done]: '',
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
