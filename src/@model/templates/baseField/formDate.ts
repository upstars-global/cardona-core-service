import type { Component } from 'vue'
import type { TranslateResult } from 'vue-i18n'
import { markRaw } from 'vue'
import FormDateField from '../../../components/templates/FieldGenerator/_components/FormDateField.vue'
import type { IBaseField } from './base'
import { BaseField } from './base'

export interface IFormDateBaseField extends IBaseField {
  readonly value?: string | Date
  readonly buttonOnly?: boolean
  readonly dateFormat?: string
  readonly config?: Record<string, unknown>
}

export class FormDateBaseField extends BaseField implements IFormDateBaseField {
  readonly component: Component = markRaw(FormDateField)
  protected _value?: string | Date
  readonly buttonOnly?: boolean
  readonly placeholder: TranslateResult
  readonly dateFormat: string
  readonly config?: Record<string, unknown>

  constructor(field: IFormDateBaseField) {
    super(field)
    this._value = field.value
    this.buttonOnly = field.buttonOnly
    this.placeholder = field.placeholder ?? 'YYYY-MM-DD'
    this.dateFormat = field.dateFormat ?? 'Y.m.d'
    this.config = field.config
  }

  transformField() {
    return this._value ?? ''
  }
}
