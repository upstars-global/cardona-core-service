import type { TranslateResult } from 'vue-i18n'
import type { SortDirection } from './templates/baseList'
import type { SortItem } from '@core/types'

export interface PaginationData {
  pageNumber: number
  perPage: number
  total: number
}

export interface IRequestListPayload {
  pagination: PaginationData
  sort?: Array<IListSort>
  type?: string
  id?: string
  filter?: Record<string, unknown>
  data?: Record<string, unknown>
  options: {
    customApiPrefix?: string
    listItemModel?: { new (item: unknown): object }
  }
}

export interface IListSort {
  readonly field: string
  readonly dir: SortDirection
}

export interface IListSortData {
  readonly sortBy: string
  readonly sortDesc: SortDirection
}

export class ListSort implements IListSort {
  readonly field: string
  readonly dir: SortDirection

  constructor({ sortBy, sortDesc }: IListSortData) {
    this.field = sortBy
    this.dir = sortDesc
  }
}

export class SortedItem implements SortItem {
  readonly key: string
  readonly order?: boolean | 'asc' | 'desc'

  constructor({ key, order }: SortItem) {
    this.key = key
    this.order = order
  }
}
export class ListData<T> {
  readonly total?: number
  readonly perPage?: number
  readonly pageNumber?: number
  readonly list: Array<T>

  constructor(
    { data, pagination }: { data: Array<any>; pagination?: PaginationData },
    TCreator?: { new (item: any): T },
  ) {
    this.total = pagination?.total
    this.perPage = pagination?.perPage
    this.pageNumber = pagination?.pageNumber
    this.list = data.map(item => (TCreator ? new TCreator(item) : (item as T)))
  }
}

export interface OptionsItem {
  readonly id: string | number
  readonly name: TranslateResult
}

export type Nullable<T> = T | null

export interface Badge {
  name: string
  id: string
}

// Number range
export type NumberOrString = number | string

export class NumberRangeBaseValue {
  constructor(readonly from: NumberOrString, readonly to: NumberOrString) {}
}

export interface ValidationError {
  code: string
  field: string
  params: Array<unknown> | Record<string, string>
  template: string
}
export interface IRequestError {
  description: string
  type: string
  validationErrors?: Array<ValidationError>
}
