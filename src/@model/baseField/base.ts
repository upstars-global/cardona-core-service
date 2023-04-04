import { Component } from 'vue'
import { TranslateResult } from 'vue-i18n'
import { PermissionType } from '../permission'
import { ValidationRule } from '../validations'

export interface IBaseField {
  readonly key: string
  readonly label: TranslateResult
  readonly placeholder?: TranslateResult
  readonly description?: TranslateResult
  readonly info?: TranslateResult
  readonly validationRules?: ValidationRule | Array<ValidationRule>
  readonly permission?: PermissionType
  readonly isLocalization?: boolean
  readonly form?: object
}

export abstract class BaseField implements IBaseField {
  protected abstract component: Component
  protected abstract _value?: any
  readonly key: string
  readonly label: TranslateResult
  readonly placeholder?: TranslateResult
  readonly description?: TranslateResult
  readonly info?: TranslateResult
  readonly validationRules?: ValidationRule // TODO: Expand for cases by type 'required|password'
  readonly permission?: PermissionType
  readonly isLocalization?: boolean
  public form?: object

  protected constructor(field: IBaseField) {
    this.key = field.key
    this.label = field.label
    this.placeholder = field.placeholder
    this.validationRules = Array.isArray(field.validationRules)
      ? (field.validationRules.join('|') as ValidationRule)
      : field.validationRules
    this.description = field.description
    this.info = field.info
    this.permission = field.permission
    this.isLocalization = field.isLocalization
    this.form = field.form
  }

  get value() {
    return this._value
  }

  set value(value) {
    this._value = value
  }

  transformField() {
    return this._value
  }
}
