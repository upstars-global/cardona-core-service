interface TableFieldInput {
  readonly key: string
  readonly label: string
  readonly sortable?: boolean | null
  readonly type?: ListFieldType
  readonly size?: ListSize
}

export class TableField implements TableFieldInput {
  readonly key: string
  readonly label: string
  readonly sortable?: boolean | null
  readonly type?: ListFieldType
  readonly size?: ListSize

  constructor(data: TableFieldInput) {
    this.key = data.key
    this.label = data.label
    this.sortable = data?.sortable
    this.type = data?.type
    this.size = data?.size || ListSize.MD
  }
}

export enum ListFieldType {
  Status = 'status',
  PillStatus = 'pill-status',
  NameWithId = 'name-with-id',
  NameWithShortId = 'name-with-short-id',
  Email = 'email',
  Date = 'date',
  DateWithSeconds = 'date-with-seconds',
  Statement = 'statement',
  Priority = 'priority',
  Badges = 'badges',
  Percent = 'percent',
  Action = 'action',
  Button = 'button',
  SumAndCurrency = 'sum-and-currency',
  Comment = 'comment',
  Image = 'image',
  ImageFull = 'image-full',
  Period = 'period',
  Copy = 'copy',
  CopyShort = 'copy-short',
}
export enum ListSize {
  SM = 'sm',
  MD = 'md',
}
