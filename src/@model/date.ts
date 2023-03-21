export interface IBaseDatePeriod {
  readonly dateFrom: String | Date
  readonly dateTo: String | Date
}

export class BaseDatePeriod {
  readonly dateFrom: String | Date
  readonly dateTo: String | Date

  constructor(dateFrom, dateTo) {
    this.dateFrom = dateFrom
    this.dateTo = dateTo
  }
}
