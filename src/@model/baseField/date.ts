import { Component } from 'vue'
import { BaseField, IBaseField } from './base'
import DateField from '../../components/templates/FieldGenerator/_components/DateField.vue'

export interface IDateBaseField extends IBaseField {
  readonly value?: string
  readonly isRangeMode?: boolean
  readonly isStartDateNow?: boolean
  readonly withTime?: boolean
  readonly config?: Record<string, unknown>
}

export class DateBaseField extends BaseField implements IDateBaseField {
  readonly component: Component = DateField
  protected _value?: string
  readonly isRangeMode?: boolean
  readonly isStartDateNow?: boolean
  readonly withTime?: boolean
  readonly config?: Record<string, unknown>

  constructor(field: IDateBaseField) {
    super(field)
    this._value = field.value
    this.isRangeMode = field.isRangeMode
    this.isStartDateNow = field.isStartDateNow
    this.withTime = field.withTime
    this.config = field.config
  }

  transformField(): string {
    return this._value ?? ''
  }
}
