import i18n from '../../libs/i18n'
import { Component } from 'vue'
import { BaseField, IBaseField } from './base'
import DateField from '../../components/templates/FieldGenerator/_components/DateField.vue'
import { BaseDatePeriod, dateSeparators } from '../date'
import { getISOStringWithoutTimezone, getUTCISOString } from '../../helpers/date'
import { ValidationRule } from '../validations'

type DateBaseFieldInputValue = string | BaseDatePeriod

export interface IDateBaseField extends IBaseField {
  readonly value?: DateBaseFieldInputValue
  readonly isRangeMode?: boolean
  readonly isStartDateNow?: boolean
  readonly withTime?: boolean
  readonly separator?: string
  readonly config?: Record<string, unknown>
  readonly withInitFullData?: boolean
}

export class DateBaseField extends BaseField implements IDateBaseField {
  readonly component: Component = DateField
  protected _value?: string
  readonly isRangeMode?: boolean
  readonly isStartDateNow?: boolean
  readonly withTime?: boolean
  readonly config?: Record<string, unknown>
  readonly separator: string
  readonly validationRules?: ValidationRule
  readonly withInitFullData?: boolean

  constructor(field: IDateBaseField) {
    super(field)
    this.separator = field.separator ?? dateSeparators[i18n.locale]
    this._value = field.value && this.getISODateValue(field.value)
    this.isRangeMode = field.isRangeMode
    this.isStartDateNow = field.isStartDateNow
    this.withTime = field.withTime
    this.config = field.config
    this.validationRules = this.getValidationRules(field.validationRules)
    this.withInitFullData = field.withInitFullData
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
    if (!this._value) return ''

    const [dateFrom, dateTo] = this._value
      .split(this.separator)
      .map((date) => getUTCISOString(date.trim()))

    return dateTo
      ? {
          [`${key}From`]: dateFrom,
          [`${key}To`]: dateTo,
        }
      : dateFrom
  }

  private getValidationRules(
    rules?: ValidationRule | Array<ValidationRule>
  ): ValidationRule | undefined {
    const rangeRequiredRules: ValidationRule[] = ['range_date', 'range_date_different']
    const allRules: ValidationRule | ValidationRule[] | undefined =
      this.isRangeMode && rules
        ? rangeRequiredRules.concat(rules)
        : this.isRangeMode
        ? rangeRequiredRules
        : rules

    return allRules && super.transformRules(allRules)
  }
}
