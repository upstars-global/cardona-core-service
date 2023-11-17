import type { Component } from 'vue'
import store from '../../../store'
import type { IBaseField } from './base'
import { BaseField } from './base'
import SelectField from "../../../components/templates/FieldGenerator/_components/SelectField.vue";
import {OptionsItem} from "../../index";

type SelectValue = OptionsItem | string | number | null

interface ITransformFieldOptions {
  trackBy?: string
  isStringDefaultValue?: boolean
}

export interface ISelectBaseField<T> extends IBaseField {
  readonly value?: T | SelectValue
  readonly options?: Array<T>
  readonly fetchOptionsActionName?: string
  readonly staticFilters?: Record<string, string>
}

export class SelectBaseField<T extends OptionsItem = OptionsItem>
  extends BaseField
  implements ISelectBaseField<T> {
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
        typeof option === 'string' ? { id: option, name: option } : option,
      )
    }
  }

  transformField(options: ITransformFieldOptions = {}) {
    const { trackBy = 'id', isStringDefaultValue = true } = options
    const value = this.value?.[trackBy] ?? this.value

    return value || !isStringDefaultValue ? value : ''
  }
}
