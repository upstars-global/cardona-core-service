import { Location } from 'vue-router'
import { TranslateResult } from 'vue-i18n'
import { PermissionType } from './permission'

export enum ViewType {
  Text = 'text',
  Locale = 'locale',
  Region = 'region',
  Textarea = 'textarea',
  Link = 'link',
  Badges = 'badges',
  Badge = 'badge',
  Status = 'status',
  Statement = 'statement',
  Date = 'date',
  BadgeCopy = 'badge-copy',
  SumAndCurrency = 'sum-and-currency',
  StatusWithDate = 'status-with-date',
  StatusWithDateHistory = 'status-with-date-history',
  Comment = 'comment',
  TransactionType = 'transaction-type',
  ObjectToRows = 'object-to-rows',
}
export enum ViewJustifyContent {
  Start = 'start',
  Between = 'between',
  End = 'end',
  Center = 'center',
}

export type LinkViewValue = {
  title: string
  route?: Location
  modalId?: string
}

export type SumAndCurrencyViewValue = {
  remainder: number
  amount: number
  currency: string
}

export type StatusWithDateValue = {
  status: string | IStatusWithVariant
  updatedAt: string | Date
}

export interface IStatusWithVariant {
  status: string
  variant: string
}

export class StatusWithVariant implements IStatusWithVariant {
  public status: string
  public variant: string
  constructor(status: string, variant: string) {
    this.status = status
    this.variant = variant
  }
}
interface IViewInfo {
  readonly type?: ViewType
  readonly value?: LinkViewValue | SumAndCurrencyViewValue | StatusWithDateValue | any
  readonly label?: TranslateResult
  readonly description?: TranslateResult
  readonly icon?: string
  readonly withSeparator?: boolean
  readonly permission?: PermissionType
  readonly withSearch?: boolean
}

//TODO: Delete T = {} All project https://upstars.atlassian.net/browse/BAC-1177
export class ViewInfo<T = {}> {
  readonly type?: ViewType
  readonly value: LinkViewValue | SumAndCurrencyViewValue | StatusWithDateValue | any
  readonly label?: TranslateResult
  readonly description?: TranslateResult
  readonly icon?: string
  readonly withSeparator?: boolean
  readonly permission?: PermissionType
  readonly withSearch?: boolean

  constructor(data: IViewInfo) {
    this.type = data?.type
    this.value = data?.value
    this.label = data?.label
    this.description = data?.description
    this.icon = data?.icon
    this.withSeparator = data?.withSeparator
    this.withSearch = data?.withSearch
    this.permission = data?.permission
  }
}
