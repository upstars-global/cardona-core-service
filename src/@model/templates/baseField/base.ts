import type { Component } from 'vue'
import type { TranslateResult } from 'vue-i18n'
import store from '../../../store'
import type { IValidationConfig } from '../../../@model/validations'
import type { OptionsItem } from '../../../@model'
import type { PermissionType } from '@permissions'

export interface IBaseField {
  readonly key: string
  readonly id?: string
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
  protected abstract component: Component
  protected abstract _value?: any
  readonly key: string
  readonly id: string
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
    this.id = field.id ?? field.key
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

// Abstract select
export type SelectValue = OptionsItem | string | number

export interface ITransformFieldOptions {
  trackBy?: string
}

export interface IASelectBaseField<T> extends IBaseField {
  readonly options?: Array<T>
  readonly fetchOptionsActionName?: string
  readonly staticFilters?: Record<string, string>
  readonly withCalculatePosition?: boolean
}

export abstract class ASelectBaseField<T extends OptionsItem = OptionsItem>
  extends BaseField
  implements IASelectBaseField<T> {
  public options?: Array<T>
  readonly fetchOptionsActionName?: string
  readonly preloadOptionsByIds?: boolean
  readonly staticFilters: Record<string, string>
  readonly calculatePositionCb?: CallableFunction
  selectedOptions?: Array<T>

  protected constructor(field: IASelectBaseField<T>) {
    super(field)
    this.options = field.options
    this.fetchOptionsActionName = field.fetchOptionsActionName
    this.staticFilters = field.staticFilters || {}
    this.calculatePositionCb = field.withCalculatePosition ? this.calculatePosition : undefined
  }

  calculatePosition({ dropdownList }) {
    dropdownList.style.position = 'fixed'
  }

  async fetchOptions(search: string) {
    if (this.fetchOptionsActionName) {
      if (this.preloadOptionsByIds && this.value?.length && search === undefined) {
        const { list: selectedOptions } = await store.dispatch(this.fetchOptionsActionName, {
          perPage: 50,
          filter: {
            ids: this.value.map(item => item?.id || item),
          },
        })

        this.selectedOptions = selectedOptions?.map((option: string | T): OptionsItem | T =>
          typeof option === 'string' ? { id: option, name: option } : option,
        ) || []
      }

      const { list } = await store.dispatch(this.fetchOptionsActionName, {
        perPage: 50,
        filter: {
          search,
          ...this.staticFilters,
        },
      })

      this.options = [...(this.selectedOptions || []), ...list]
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
