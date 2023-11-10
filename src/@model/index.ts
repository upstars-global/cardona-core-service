import type { TranslateResult } from 'vue-i18n'
import { SortDirection } from '../@model/templates/baseList'

export interface PaginationData {
  readonly pageNumber: number
  readonly perPage?: number
  readonly total?: number
}

export interface IRequestListPayload<T = any> {
  readonly page?: number
  readonly perPage?: number
  readonly sort?: Array<IListSort>
  readonly filter?: T
}

export interface IListSort {
  readonly key: string
  readonly order: SortDirection
}

export interface IListSortData {
  readonly sortBy: string
  readonly sortDesc: boolean
}

export class ListSort implements IListSort {
  readonly key: string
  readonly order: SortDirection

  constructor({ key, order }: IListSort) {
    this.key = key
    this.order = order ? SortDirection.asc : SortDirection.desc
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
  readonly id: string
  readonly name: TranslateResult
}

export type Nullable<T> = T | null

export interface Badge {
  name: string
  id: string
}

export type NumberOrString = number | string

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
