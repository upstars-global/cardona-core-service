import type { Component } from 'vue'
import { markRaw } from 'vue'
import PasswordField from '../../../components/templates/FieldGenerator/_components/PasswordField.vue'
import type { IBaseField } from './base'
import { BaseField } from './base'

export interface IPasswordBaseField extends IBaseField {
  readonly value?: string
  readonly withPasswordGenerator?: boolean
  readonly showPassword?: boolean
}

export class PasswordBaseField extends BaseField implements IPasswordBaseField {
  readonly component: Component = markRaw(PasswordField)
  protected _value?: string
  readonly withPasswordGenerator?: boolean
  readonly showPassword?: boolean

  constructor(field: IPasswordBaseField) {
    super(field)
    this._value = field.value || ''
    this.withPasswordGenerator = field.withPasswordGenerator
    this.showPassword = field.showPassword
  }

  transformField() {
    return this._value ?? ''
  }
}
