import type { Component } from 'vue'
import RatesField from '../../../components/templates/FieldGenerator/_components/RatesField.vue'
import { division, multiplication } from '../../../helpers/math-operations'
import type { IBaseField } from './base'
import { BaseField } from './base'

export interface RatesValueItem {
  readonly currency: string
  readonly value?: number
}

export interface IRatesBaseField extends IBaseField {
  readonly value?: RatesValueItem[]
  readonly isCents?: boolean
  readonly trackBy?: string
}

export class RatesBaseField extends BaseField implements IRatesBaseField {
  readonly component: Component = RatesField
  protected _value?: Required<RatesValueItem>[]
  readonly trackBy: string
  readonly isCents: boolean

  constructor(field: IRatesBaseField) {
    super(field)
    this.trackBy = field.trackBy ?? 'value'
    this.isCents = field.isCents ?? true
    this._value = field.value?.map(item => ({
      currency: item.currency,
      value: !item[this.trackBy]
        ? 0
        : this.isCents
          ? division(item[this.trackBy], 100)
          : item[this.trackBy],
    }))
  }

  transformField() {
    if (!this._value)
      return []

    return this._value.map(({ currency, value }) => ({
      currency,
      [this.trackBy]:
        value === 0 ? value : !value ? null : this.isCents ? multiplication(value, 100) : +value,
    }))
  }
}
