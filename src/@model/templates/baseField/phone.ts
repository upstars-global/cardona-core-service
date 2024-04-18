import type { Component } from 'vue'
import { markRaw } from 'vue'
import PhoneField from '../../../components/templates/FieldGenerator/_components/PhoneField.vue'
import type { IBaseField } from './base'
import { BaseField } from './base'

export interface IPhoneBaseField extends IBaseField {
  readonly value?: string
}

export class PhoneBaseField extends BaseField implements IPhoneBaseField {
  readonly component: Component = markRaw(PhoneField)
  protected _value?: string

  constructor(field: IPhoneBaseField) {
    super(field)
    this._value = field.value
  }

  transformField() {
    return this._value ?? ''
  }
}
