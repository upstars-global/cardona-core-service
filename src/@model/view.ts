import { Location } from 'vue-router'

export enum ViewType {
  Text = 'text',
  Textarea = 'textarea',
  Link = 'link',
  Badges = 'badges',
  BadgeId = 'badge-id',
  Status = 'status',
  Statement = 'statement',
  Date = 'date',
  BadgeCopy = 'badge-copy',
  SumAndCurrency = 'sum-and-currency',
  StatusWithDate = 'status-with-date',
  StatusWithDateHistory = 'status-with-date-history',
  Comment = 'comment',
  TransactionType = 'transaction-type',
  BalanceTable = 'balance-table',
  ObjectToRows = 'object-to-rows',
}
export enum ViewSize {
  Xs = 'xs',
  Sm = 'sm',
  Md = 'md',
  Lg = 'lg',
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
  status: string
  updatedAt: string | Date
}

interface IViewInfo {
  readonly type?: ViewType
  readonly value?: LinkViewValue | SumAndCurrencyViewValue | StatusWithDateValue | any
  readonly label?: string
  readonly description?: string
  readonly icon?: string
  readonly withSeparator?: boolean
  readonly permission?: string
  readonly withSearch?: boolean
}

//TODO: Delete T = {} All project https://upstars.atlassian.net/browse/BAC-1177
export class ViewInfo<T = {}> {
  readonly type?: ViewType
  readonly value: LinkViewValue | SumAndCurrencyViewValue | StatusWithDateValue | any
  readonly label?: string
  readonly description?: string
  readonly icon?: string
  readonly withSeparator?: boolean
  readonly permission?: string
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
