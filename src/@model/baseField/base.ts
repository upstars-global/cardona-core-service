import { Component } from 'vue'
import { TranslateResult } from 'vue-i18n'
import { ValidationRule } from '../../@model/validations'

export interface IBaseField {
  readonly key: string
  readonly label: TranslateResult
  readonly placeholder?: TranslateResult
  readonly description?: TranslateResult
  readonly info?: TranslateResult
  readonly validationRules?: ValidationRule
  readonly permission?: string // TODO: Change to type after creation permissions enum https://upstars.atlassian.net/browse/BAC-1244
  readonly isLocalization?: boolean
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
  readonly permission?: string
  readonly isLocalization?: boolean

  protected constructor(field: IBaseField) {
    this.key = field.key
    this.label = field.label
    this.placeholder = field.placeholder
    this.validationRules = field.validationRules
    this.description = field.description
    this.info = field.info
    this.permission = field.permission
    this.isLocalization = field.isLocalization
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
