import { Component } from 'vue'
import { BaseField, IBaseField } from './base'
import PhoneField from "../../../components/templates/FieldGenerator/_components/PhoneField.vue";

export interface IPhoneBaseField extends IBaseField {
  readonly value?: string
}

export class PhoneBaseField extends BaseField implements IPhoneBaseField {
  readonly component: Component = PhoneField
  protected _value?: string

  constructor(field: IPhoneBaseField) {
    super(field)
    this._value = field.value
  }

  transformField() {
    return this._value ?? ''
  }
}
