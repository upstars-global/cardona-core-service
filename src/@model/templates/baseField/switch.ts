import type { Component } from 'vue'
import { markRaw } from 'vue'
import SwitchField from '../../../components/templates/FieldGenerator/_components/SwitchField.vue'
import type { IBaseField } from './base'
import { BaseField } from './base'

export interface ISwitchBaseField extends IBaseField {
  readonly value?: boolean
  readonly withState?: boolean
}

export class SwitchBaseField extends BaseField implements ISwitchBaseField {
  readonly component: Component = markRaw(SwitchField)
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
