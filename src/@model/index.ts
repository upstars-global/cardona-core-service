import { SortDirection } from '../components/templates/BaseList/model'
import { TranslateResult } from 'vue-i18n'

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
  readonly field: string
  readonly dir: SortDirection
}

export interface IListSortData {
  readonly sortBy: string
  readonly sortDesc: boolean
}

export class ListSort implements IListSort {
  readonly field: string
  readonly dir: SortDirection

  constructor({ sortBy, sortDesc }: IListSortData) {
    this.field = sortBy
    this.dir = sortDesc ? SortDirection.asc : SortDirection.desc
  }
}

export class ListData<T> {
  readonly total?: number
  readonly perPage?: number
  readonly pageNumber?: number
  readonly list: Array<T>

  constructor(
    { data, pagination }: { data: Array<any>; pagination?: PaginationData },
    TCreator?: { new (item: any): T }
  ) {
    this.total = pagination?.total
    this.perPage = pagination?.perPage
    this.pageNumber = pagination?.pageNumber
    this.list = data.map((item) => (TCreator ? new TCreator(item) : (item as T)))
  }
}

export type OptionsItem = {
  readonly id: string
  readonly name: TranslateResult
}
