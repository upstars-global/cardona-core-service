import { Component } from 'vue'
import store from '../../store'
import { BaseField, IBaseField } from './base'
import { OptionsItem } from '../../@model'
import SelectField from '../../components/templates/FieldGenerator/_components/SelectField.vue'

type SelectValue = OptionsItem | string | number | null

export interface ISelectBaseField<T> extends IBaseField {
  readonly value?: T | SelectValue
  readonly options?: Array<T>
  readonly fetchOptionsActionName?: string
  readonly staticFilters?: Record<string, string>
}

export class SelectBaseField<T extends OptionsItem = OptionsItem>
  extends BaseField
  implements ISelectBaseField<T>
{
  readonly component: Component = SelectField
  protected _value?: T | SelectValue
  public options?: Array<T>
  readonly fetchOptionsActionName?: string
  readonly staticFilters?: Record<string, string>

  constructor(field: ISelectBaseField<T>) {
    super(field)
    this._value = field.value
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

  transformField(trackBy = 'id') {
    return this.value?.[trackBy] ?? this.value ?? ''
  }
}
