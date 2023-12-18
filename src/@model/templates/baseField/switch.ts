import { Component } from 'vue'
import { BaseField, IBaseField } from './base'
import SwitchField from '@/components/templates/FieldGenerator/_components/SwitchField.vue'

export interface ISwitchBaseField extends IBaseField {
  readonly value?: boolean
  readonly withState?: boolean
}

export class SwitchBaseField extends BaseField implements ISwitchBaseField {
  readonly component: Component = SwitchField
  protected _value?: boolean
  readonly withState?: boolean

  constructor(field: ISwitchBaseField) {
    super(field)
    this._value = field.value
    this.withState = field.withState
  }

  transformField() {
    return this._value ?? false
  }
}
