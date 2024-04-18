import type { Component } from 'vue'
import { markRaw } from 'vue'
import TimeField from '../../../components/templates/FieldGenerator/_components/TimeField.vue'
import type { IBaseField } from './base'
import { BaseField } from './base'

export interface ITimeBaseField extends IBaseField {
  readonly value?: string
}

export class TimeBaseField extends BaseField implements ITimeBaseField {
  readonly component: Component = markRaw(TimeField)
  protected _value?: string

  constructor(field: ITimeBaseField) {
    super(field)
    this._value = field.value
  }
}
