import type { Component } from 'vue'
import { markRaw } from 'vue'
import { BaseDatePeriod, dateSeparators } from '../../date'
import { getISOStringWithoutTimezone, getUTCISOString } from '../../../helpers/date'
import DateField from '../../../components/templates/FieldGenerator/_components/DateField.vue'
import { i18n } from '../../../plugins/i18n'
import type { IValidationConfig } from '../../validations'
import { BaseField } from './base'
import type { IBaseField } from './base'

type DateBaseFieldInputValue = string | BaseDatePeriod

export interface IDateBaseField extends IBaseField {
  readonly value?: DateBaseFieldInputValue
  readonly isRangeMode?: boolean
  readonly isStartDateNow?: boolean
  readonly withTime?: boolean
  readonly separator?: string
  readonly config?: Record<string, unknown>
  readonly isFilter?: boolean
  readonly maxDateTo?: Date | string
  readonly allowFutureDate?: boolean
  readonly keys?: string[]
}

export class DateBaseField extends BaseField implements IDateBaseField {
  readonly component: Component = markRaw(DateField)
  protected _value?: string
  readonly isRangeMode?: boolean
  readonly isStartDateNow?: boolean
  readonly withTime?: boolean
  readonly config?: Record<string, unknown>
  readonly separator: string
  readonly validationRules?: IValidationConfig
  readonly isFilter?: boolean
  readonly maxDateTo?: Date | string
  readonly allowFutureDate?: boolean
  readonly keys?: string[]

  constructor(field: IDateBaseField) {
    super(field)
    this.separator = field.separator ?? dateSeparators[i18n.locale.value]
    this._value = field.value && this.getISODateValue(field.value)
    this.isRangeMode = field.isRangeMode
    this.isStartDateNow = field.isStartDateNow
    this.withTime = field.withTime
    this.config = field.config
    this.validationRules = this.getValidationRules(field.validationRules)
    this.isFilter = field?.isFilter
    this.maxDateTo = field?.maxDateTo || ''
    this.allowFutureDate = field?.allowFutureDate
    this.keys = field.keys
  }

  private getISODateValue(value: DateBaseFieldInputValue): string {
    return value instanceof BaseDatePeriod
      ? Object.values(value)
        .filter(Boolean)
        .map((date: string) => getISOStringWithoutTimezone(date))
        .join(` ${this.separator} `)
      : getISOStringWithoutTimezone(value)
  }

  transformField(key = this.key): string | Record<string, string> {
    if (!this._value)
      return ''

    const [dateFrom, dateTo] = this._value
      .split(this.separator)
      .map(date => getUTCISOString(date.trim()))

    const keys = this.keys?.length ? this.keys : [`${key}From`, `${key}To`]

    return dateTo
      ? {
        [keys[0]]: dateFrom,
        [keys[1]]: dateTo,
      }
      : dateFrom
  }

  private getValidationRules(
    rules?: IValidationConfig,
  ): IValidationConfig | undefined {
    const rangeRequiredRules: IValidationConfig = { range_date: true, range_date_different: true }

    return this.isRangeMode && rules
      ? { ...rangeRequiredRules, ...rules }
      : this.isRangeMode
        ? rangeRequiredRules
        : rules
  }
}
