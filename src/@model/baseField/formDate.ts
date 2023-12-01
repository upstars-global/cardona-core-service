import { Component } from 'vue'
import { TranslateResult } from 'vue-i18n'
import { BaseField, IBaseField } from './base'
import FormDateField from '../../components/templates/FieldGenerator/_components/FormDateField.vue'

export interface IFormDateBaseField extends IBaseField {
  readonly value?: string | Date
  readonly buttonOnly?: boolean
}

export class FormDateBaseField extends BaseField implements IFormDateBaseField {
  readonly component: Component = FormDateField
  protected _value?: string | Date
  readonly buttonOnly?: boolean
  readonly placeholder: TranslateResult

  constructor(field: IFormDateBaseField) {
    super(field)
    this._value = field.value
    this.buttonOnly = field.buttonOnly
    this.placeholder = field.placeholder ?? 'YYYY-MM-DD'
  }

  transformField() {
    return this._value ?? ''
  }
}
