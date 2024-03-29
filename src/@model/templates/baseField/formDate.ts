import type { Component } from 'vue'
import type { TranslateResult } from 'vue-i18n'
import FormDateField from '../../../components/templates/FieldGenerator/_components/FormDateField.vue'
import type { IBaseField } from './base'
import { BaseField } from './base'

export interface IFormDateBaseField extends IBaseField {
  readonly value?: string | Date
  readonly buttonOnly?: boolean
  readonly dateFormat?: string
}

export class FormDateBaseField extends BaseField implements IFormDateBaseField {
  readonly component: Component = FormDateField
  protected _value?: string | Date
  readonly buttonOnly?: boolean
  readonly placeholder: TranslateResult
  readonly dateFormat: string
  constructor(field: IFormDateBaseField) {
    super(field)
    this._value = field.value
    this.buttonOnly = field.buttonOnly
    this.placeholder = field.placeholder ?? 'YYYY-MM-DD'
    this.dateFormat = field.dateFormat ?? 'Y.m.d'
  }

  transformField() {
    return this._value ?? ''
  }
}
