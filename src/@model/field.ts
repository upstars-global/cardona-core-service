import store from '@/store'
import { OptionsItem } from '@model/index'

export enum FieldType {
  Text = 'text',
  Number = 'number',
  Textarea = 'textarea',
  TextareaWithCounter = 'textarea-with-counter',
  RichText = 'rich-text',
  Check = 'check',
  CheckGroup = 'check-group',
  Select = 'select',
  MultiSelect = 'multi-select',
  DummySelect = 'dummy-select',
  Percent = 'percent',
  Minute = 'minute',
  Tags = 'tags',
  Radio = 'radio',
  Date = 'date', // TODO: https://upstars.atlassian.net/browse/BAC-853
  DateRange = 'date-range',
  DateTime = 'date-time',
  Switch = 'switch',
  SwitchWithState = 'switch-with-state',
  SumRange = 'sum-range',
  Phone = 'phone',
}

export interface IFieldInfo {
  readonly type: FieldType
  readonly key: string
  readonly value?: any
  readonly label: string
  readonly options?: Array<any>
  readonly fetchOptionsActionName?: string
  readonly staticFilters?: Record<string, string>
  readonly validationRules?: string
  form?: object | null
  readonly isLocalization?: boolean
  readonly placeholder?: string
  readonly description?: string
  readonly info?: string
  readonly append?: string
  readonly permission?: string
}

export class FieldInfo<T = {}> {
  readonly type: FieldType
  readonly key: string
  private _value: any
  readonly label: string
  public options?: Array<T>
  readonly fetchOptionsActionName?: string
  readonly staticFilters?: Record<string, string>
  public form?: object | null
  readonly validationRules?: string
  readonly isLocalization?: boolean
  readonly placeholder?: string
  readonly description?: string
  readonly info?: string
  readonly append?: string
  readonly permission?: string

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
    permission,
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
    this.permission = permission
  }

  get value() {
    if (this.type === FieldType.Select) {
      return this._value ? this.checkSelectValue(this._value) : null
    } else if (this.type === FieldType.MultiSelect) {
      return Array.isArray(this._value)
        ? this._value.map((item) => this.checkSelectValue(item))
        : !!this._value
        ? [this.checkSelectValue(this._value)]
        : []
    } else if (this.type === FieldType.Tags) {
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
