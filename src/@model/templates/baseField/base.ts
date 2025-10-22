import type { Component } from 'vue'
import type { TranslateResult } from 'vue-i18n'
import type { IValidationConfig } from '../../../@model/validations'
import type { OptionsItem } from '../../../@model'
import { i18n } from '../../../plugins/i18n'
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
  readonly fetchOptionsAction?: CallableFunction
  readonly staticFilters?: Record<string, string>
  readonly withCalculatePosition?: boolean
  readonly preloadOptionsByIds?: boolean
  readonly filterable?: boolean
  readonly infiniteLoading?: boolean
  readonly localeKey?: string
}

export abstract class ASelectBaseField<T extends OptionsItem | string = OptionsItem | string>
  extends BaseField
  implements IASelectBaseField<T> {
  public options?: Array<T | OptionsItem>
  readonly fetchOptionsAction?: CallableFunction
  readonly preloadOptionsByIds?: boolean
  readonly staticFilters: Record<string, string>
  readonly calculatePositionCb?: CallableFunction
  selectedOptions?: Array<T>
  readonly filterable: boolean
  readonly infiniteLoading?: boolean
  readonly localeKey: string
  pageNumber: number
  private prevSearch = ''
  allowLoadMore = true

  protected constructor(field: IASelectBaseField<T>) {
    super(field)
    this.localeKey = field?.localeKey || ''
    this.options = this.getOptionItems(field?.options)
    this.fetchOptionsAction = field.fetchOptionsAction
    this.preloadOptionsByIds = field.preloadOptionsByIds
    this.staticFilters = field.staticFilters || {}
    this.calculatePositionCb = field.withCalculatePosition ? this.calculatePosition : undefined
    this.filterable = field.filterable ?? true
    this.infiniteLoading = field.infiniteLoading
    this.pageNumber = 1
  }

  calculatePosition({ dropdownList }) {
    dropdownList.style.position = 'fixed'
  }

  private getOptionName(value: string): string {
    if (this.localeKey)
      return i18n.t(`options.${this.localeKey}.${value}`)
    if (i18n.te(`options.${value}`))
      return i18n.t(`options.${value}`)

    return value
  }

  private getOptionItems(list: T[] | undefined): OptionsItem[] | undefined {
    return list?.map((option: T | OptionsItem): OptionsItem =>
      typeof option === 'string'
        ? { id: option, name: this.getOptionName(option) }
        : { ...option, name: this.getOptionName(option.name) },
    )
  }

  private async fetchOptionList(
    filters: { search?: string; ids?: string[] } = {},
    resetPage = false,
  ): Promise<OptionsItem[] | undefined> {
    if (resetPage)
      this.pageNumber = 1

    this.prevSearch = filters.search || ''

    const { list = [] } = await this.fetchOptionsAction({
      perPage: 50,
      pageNumber: this.pageNumber,
      filter: {
        ...this.staticFilters,
        ...filters,
      },
    })

    this.allowLoadMore = list.length === 50

    return this.getOptionItems(list)
  }

  async getOptions(filters: { search?: string; ids?: string[] } = {}) {
    if (!filters.search)
      filters.search = ''
    const resetPage = this.prevSearch !== filters.search

    return await this.fetchOptionList(filters, resetPage)
  }

  async reinitOptions(filters?: { search?: string; ids?: string[] } = {}) {
    return await this.fetchOptionList(filters, true)
  }

  async fetchOptions(search?: string) {
    if (this.fetchOptionsAction) {
      const isExistsValue = this.value?.length || this.value?.id

      if (this.preloadOptionsByIds && isExistsValue && search === undefined) {
        const ids = Array.isArray(this.value) ? this.value.map(item => item?.id || item) : [this.value?.id || this.value]

        this.selectedOptions = await this.getOptions({ ids })
      }
      const options = await this.getOptions({ search })

      this.options = this.selectedOptions ? [...this.selectedOptions, ...options] : options
    }
  }

  async loadMore(search: string) {
    if (!this.allowLoadMore)
      return
    this.pageNumber++

    const options = await this.getOptions({ search })

    this.options = [...this.options, ...options]
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
