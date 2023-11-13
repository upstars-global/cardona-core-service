import store from '../../store'
import { Component } from 'vue'
import { TranslateResult } from 'vue-i18n'
import { ValidationRule } from '../validations'
import { PermissionType } from '@permissions'
import { OptionsItem } from '../../@model'

export interface IBaseField {
  readonly key: string
  readonly label: TranslateResult
  readonly placeholder?: TranslateResult
  readonly description?: TranslateResult
  readonly info?: TranslateResult
  readonly validationRules?: ValidationRule | Array<ValidationRule>
  readonly permission?: PermissionType
  readonly isLocalization?: boolean
  readonly form?: object | null
  readonly serialize?: (value: any) => any
  readonly deserialize?: (value: any) => any
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
  public form?: object | null
  public serialize: (value: any) => any = (value) => value
  public deserialize: (value: any) => any = (value) => value

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

// Abstract select
export type SelectValue = OptionsItem | string | number

export interface ITransformFieldOptions {
  trackBy?: string
}

export interface IASelectBaseField<T> extends IBaseField {
  readonly options?: Array<T>
  readonly fetchOptionsActionName?: string
  readonly staticFilters?: Record<string, string>
}

export abstract class ASelectBaseField<T extends OptionsItem = OptionsItem>
  extends BaseField
  implements IASelectBaseField<T>
{
  public options?: Array<T>
  readonly fetchOptionsActionName?: string
  readonly staticFilters: Record<string, string>

  protected constructor(field: IASelectBaseField<T>) {
    super(field)
    this.options = field.options
    this.fetchOptionsActionName = field.fetchOptionsActionName
    this.staticFilters = field.staticFilters || {}
  }

  async fetchOptions(search = '') {
    if (this.fetchOptionsActionName) {
      const { list } = await store.dispatch(this.fetchOptionsActionName, {
        perPage: 50,
        filter: {
          search,
          ...this.staticFilters,
        },
      })
      this.options = list.map((option: string | T): OptionsItem | T =>
        typeof option === 'string' ? { id: option, name: option } : option
      )
    }
  }
}

// Abstract text input
export interface IATextBaseField extends IBaseField {
  readonly prepend?: TranslateResult
  readonly append?: TranslateResult
}

export abstract class ATextBaseField extends BaseField implements IATextBaseField {
  readonly prepend?: TranslateResult
  readonly append?: TranslateResult

  protected constructor(field: IATextBaseField) {
    super(field)
    this.prepend = field.prepend
    this.append = field.append
  }
}

// Abstract number input
export interface IANumberBaseField extends IATextBaseField {
  readonly withPositiveNumbers?: boolean
  readonly isIntegerNumbers?: boolean
}

export abstract class ANumberBaseField extends ATextBaseField implements IANumberBaseField {
  readonly withPositiveNumbers?: boolean
  readonly isIntegerNumbers?: boolean

  protected constructor(field: IANumberBaseField) {
    super(field)
    this.withPositiveNumbers = field.withPositiveNumbers
    this.isIntegerNumbers = field.isIntegerNumbers
  }
}
