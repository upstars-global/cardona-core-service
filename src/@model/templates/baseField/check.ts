import type { Component } from 'vue'
import { markRaw } from 'vue'
import CheckField from '../../../components/templates/FieldGenerator/_components/CheckField.vue'
import type { IBaseField } from './base'
import { BaseField } from './base'

export interface ICheckBaseField extends IBaseField {
  readonly value?: boolean
}

export class CheckBaseField extends BaseField implements ICheckBaseField {
  readonly component: Component = markRaw(CheckField)
  protected _value?: boolean = false

  constructor(field: ICheckBaseField) {
    super(field)
    this._value = field.value
  }

  transformField() {
    return this._value ?? false
  }
}
