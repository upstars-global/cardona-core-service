import { Component } from 'vue'
import { BaseField, IBaseField } from './base'
import TimeField from '@/components/templates/FieldGenerator/_components/TimeField.vue'

export interface ITimeBaseField extends IBaseField {
  readonly value?: string
}

export class TimeBaseField extends BaseField implements ITimeBaseField {
  readonly component: Component = TimeField
  protected _value?: string

  constructor(field: ITimeBaseField) {
    super(field)
    this._value = field.value
  }
}
