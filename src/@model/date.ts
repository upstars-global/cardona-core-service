export interface IBaseDatePeriod {
  readonly dateFrom: string | Date
  readonly dateTo: string | Date
}

export class BaseDatePeriod {
  readonly dateFrom: string | Date
  readonly dateTo: string | Date

  constructor(dateFrom: string | Date, dateTo: string | Date) {
    this.dateFrom = dateFrom
    this.dateTo = dateTo
  }
}
