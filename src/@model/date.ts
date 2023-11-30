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
