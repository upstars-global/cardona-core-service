import { IconsList } from './enums/icons'
import { VColors } from './vuetify'

export enum NotificationStatuses {
  Waiting = 'Waiting',
  Loading = 'Loading...',
  Done = 'Done',
  Error = 'Error',
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

export const getNotificationIcon = (status: NotificationStatuses) => notificationStatusIcons[status]
export const getNotificationColor = (status: NotificationStatuses) => notificationStatusColor[status]
