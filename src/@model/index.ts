import { SortDirection } from '../components/templates/BaseList/model'

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

export type IListSort = {
  readonly field: string
  readonly dir: SortDirection
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
  readonly name: string
}
