import type { OptionsItem } from '../@model/index'
import { i18n } from '@/plugins/i18n'

export interface IBaseDatePeriod {
  readonly dateFrom: string | Date
  readonly dateTo: string | Date
}

export class BaseDatePeriod {
  readonly dateFrom: string | Date
  readonly dateTo: string | Date

  constructor(dateFrom, dateTo) {
    this.dateFrom = dateFrom
    this.dateTo = dateTo
  }
}

export const dateSeparators: { en: string; ru: string } = {
  en: 'to',
  ru: '—',
}

export const getDaysOfWeekOptions = (): OptionsItem[] => [
  { id: '0', name: i18n.t('common.dayOfWeek.monday') },
  { id: '1', name: i18n.t('common.dayOfWeek.tuesday') },
  { id: '2', name: i18n.t('common.dayOfWeek.wednesday') },
  { id: '3', name: i18n.t('common.dayOfWeek.thursday') },
  { id: '4', name: i18n.t('common.dayOfWeek.friday') },
  { id: '5', name: i18n.t('common.dayOfWeek.saturday') },
  { id: '6', name: i18n.t('common.dayOfWeek.sunday') },
]
