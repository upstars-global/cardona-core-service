import type { Component } from 'vue'
import type { TranslateResult } from 'vue-i18n'
import type { PermissionType } from '@permissions'
import {IValidationConfig} from "../../../@model/validations";

export interface IBaseField {
  readonly key: string
  readonly label: TranslateResult
  readonly placeholder?: TranslateResult
  readonly description?: TranslateResult
  readonly info?: TranslateResult
  readonly validationRules?: IValidationConfig
  readonly permission?: PermissionType
  readonly isLocalization?: boolean
  readonly form?: object | null
  readonly serialize?: (value: any) => any
  readonly deserialize?: (value: any) => any
}

export abstract class BaseField implements IBaseField {
  abstract component: Component
  protected abstract _value?: any
  readonly key: string
  readonly label: TranslateResult
  readonly placeholder?: TranslateResult
  readonly description?: TranslateResult
  readonly info?: TranslateResult
  readonly validationRules?: IValidationConfig
  readonly permission?: PermissionType
  readonly isLocalization?: boolean
  public form?: object | null
  public serialize: (value: any) => any = value => value
  public deserialize: (value: any) => any = value => value

  protected constructor(field: IBaseField) {
    this.key = field.key
    this.label = field.label
    this.placeholder = field.placeholder
    this.validationRules = field.validationRules
    this.description = field.description
    this.info = field.info
    this.permission = field.permission
    this.isLocalization = field.isLocalization
    this.form = field.form
    this.serialize = field.serialize || this.serialize
    this.deserialize = field.deserialize || this.deserialize
  }

  get value(): any {
    return this.deserialize(this._value)
  }

  set value(value: any) {
    this._value = this.serialize(value)
  }

  transformField() {
    return this._value
  }
}
