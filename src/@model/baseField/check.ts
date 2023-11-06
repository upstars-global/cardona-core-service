import { Component } from 'vue'
import { BaseField, IBaseField } from './base'
import CheckField from '../../components/templates/FieldGenerator/_components/CheckField.vue'

export interface ICheckBaseField extends IBaseField {
  readonly value?: boolean
}

export class CheckBaseField extends BaseField implements ICheckBaseField {
  readonly component: Component = CheckField
  protected _value?: boolean

  constructor(field: ICheckBaseField) {
    super(field)
    this._value = field.value
  }

  transformField() {
    return this._value ?? false
  }
}
