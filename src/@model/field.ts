import store from '../store'
import { OptionsItem } from './index'
import { TranslateResult } from 'vue-i18n'

export enum FieldType {
  Password = 'password',
  Textarea = 'textarea', // TODO: https://upstars.atlassian.net/browse/BAC-1985
  TextareaWithCounter = 'textarea-with-counter', // TODO: https://upstars.atlassian.net/browse/BAC-1985
  RichText = 'rich-text',
  Check = 'check', // TODO: https://upstars.atlassian.net/browse/BAC-1983
  CheckGroup = 'check-group',
  DummySelect = 'dummy-select',
  Tags = 'tags',
  Radio = 'radio', // TODO: https://upstars.atlassian.net/browse/BAC-1984
  DateBtnOnly = 'date-btn-only',
  Date = 'date', // TODO: https://upstars.atlassian.net/browse/BAC-1961
  DateRange = 'date-range', // TODO: https://upstars.atlassian.net/browse/BAC-1961
  DateTime = 'date-time', // TODO: https://upstars.atlassian.net/browse/BAC-1961
  Switch = 'switch', // TODO: https://upstars.atlassian.net/browse/BAC-1962
  SwitchWithState = 'switch-with-state', // TODO: https://upstars.atlassian.net/browse/BAC-1962
  SumRange = 'sum-range',
  Phone = 'phone',
  Rates = 'rates', // TODO: https://upstars.atlassian.net/browse/BAC-1860
}

export interface IFieldInfo {
  readonly type: FieldType
  readonly key: string
  readonly value?: any
  readonly label: TranslateResult
  readonly options?: Array<any>
  readonly fetchOptionsActionName?: string
  readonly staticFilters?: Record<string, string>
  readonly validationRules?: string
  form?: object | null
  readonly isLocalization?: boolean
  readonly placeholder?: TranslateResult
  readonly description?: TranslateResult
  readonly info?: string
  readonly append?: string
  readonly prepend?: string
  readonly permission?: string
  readonly maxLength?: number
}

export class FieldInfo<T = {}> {
  readonly type: FieldType
  readonly key: string
  private _value: any
  readonly label: TranslateResult
  public options?: Array<T>
  readonly fetchOptionsActionName?: string
  readonly staticFilters?: Record<string, string>
  public form?: object | null
  readonly validationRules?: string
  readonly isLocalization?: boolean
  readonly placeholder?: TranslateResult
  readonly description?: TranslateResult
  readonly info?: string
  readonly append?: string
  readonly prepend?: string
  readonly permission?: string
  readonly maxLength?: number

  constructor({
    type,
    key,
    value,
    label,
    options,
    fetchOptionsActionName,
    staticFilters,
    validationRules,
    form,
    isLocalization,
    placeholder,
    description,
    info,
    append,
    prepend,
    permission,
    maxLength,
  }: IFieldInfo) {
    this.type = type
    this.key = key
    this._value = value
    this.label = label
    this.options = options
    this.fetchOptionsActionName = fetchOptionsActionName
    this.staticFilters = staticFilters || {}
    this.form = form
    this.validationRules = validationRules
    this.isLocalization = isLocalization
    this.placeholder = placeholder
    this.description = description
    this.info = info
    this.append = append
    this.prepend = prepend
    this.permission = permission
    this.maxLength = maxLength
  }

  get value() {
    if (this.type === FieldType.Tags) {
      return this._value || []
    } else {
      return this._value
    }
  }

  checkSelectValue(value: string | OptionsItem): OptionsItem {
    return typeof value === 'string' ? this.convertStringToOptionsItem(value) : value
  }

  convertStringToOptionsItem(value: string): OptionsItem {
    return { id: value, name: value } as OptionsItem
  }

  async fetchOptions(search: string = '') {
    if (this.fetchOptionsActionName) {
      const { list } = await store.dispatch(this.fetchOptionsActionName, {
        perPage: 50,
        filter: {
          search,
          ...this.staticFilters,
        },
      })
      this.options = list.map((option: string | OptionsItem) => this.checkSelectValue(option))
    }
  }
}
