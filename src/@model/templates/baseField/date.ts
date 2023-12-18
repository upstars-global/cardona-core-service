import { Component } from 'vue'
import { BaseField, IBaseField } from './base'
import { BaseDatePeriod, dateSeparators } from '../../date'
import { getISOStringWithoutTimezone, getUTCISOString } from '../../../helpers/date'
import DateField from "../../../components/templates/FieldGenerator/_components/DateField.vue";
import {i18n} from "@/plugins/i18n";

type DateBaseFieldInputValue = string | BaseDatePeriod

export interface IDateBaseField extends IBaseField {
  readonly value?: DateBaseFieldInputValue
  readonly isRangeMode?: boolean
  readonly isStartDateNow?: boolean
  readonly withTime?: boolean
  readonly separator?: string
  readonly config?: Record<string, unknown>
}

export class DateBaseField extends BaseField implements IDateBaseField {
  readonly component: Component = DateField;
  protected _value?: string
  readonly isRangeMode?: boolean
  readonly isStartDateNow?: boolean
  readonly withTime?: boolean
  readonly config?: Record<string, unknown>
  readonly separator: string

  constructor(field: IDateBaseField) {
    super(field)
    this.separator = field.separator ?? dateSeparators[i18n.locale]
    this._value = field.value && this.getISODateValue(field.value)
    this.isRangeMode = field.isRangeMode
    this.isStartDateNow = field.isStartDateNow
    this.withTime = field.withTime
    this.config = field.config
  }

  private getISODateValue(value: DateBaseFieldInputValue): string {
    return value instanceof BaseDatePeriod
        ? `${getISOStringWithoutTimezone(value.dateFrom)} ${
            this.separator
        } ${getISOStringWithoutTimezone(value.dateTo)}`
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
}
