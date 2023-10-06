import type { Component } from 'vue'
import type { IBaseField } from './base'
import { BaseField } from './base'

export interface ITimeBaseField extends IBaseField {
  readonly value?: string
}

export class TimeBaseField extends BaseField implements ITimeBaseField {
  readonly component: Component = {}
  protected _value?: string

  constructor(field: ITimeBaseField) {
    super(field)
    this._value = field.value
  }
}
