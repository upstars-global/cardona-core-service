import type { Component } from 'vue'
import { markRaw } from 'vue'
import RatesField from '../../../components/templates/FieldGenerator/_components/RatesField.vue'
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
  readonly withString?: boolean
  readonly isIntegerNumbers?: boolean
}

export class RatesBaseField extends BaseField implements IRatesBaseField {
  readonly component: Component = markRaw(RatesField)
  protected _value?: Required<RatesValueItem>[]
  readonly trackBy: string
  readonly isCents: boolean
  readonly withString?: boolean
  readonly isIntegerNumbers?: boolean

  constructor(field: IRatesBaseField) {
    super(field)
    this.trackBy = field.trackBy ?? 'value'
    this.isCents = field.isCents ?? true
    this.withString = field.withString
    this.isIntegerNumbers = field.isIntegerNumbers
    this._value = field.value?.map(item => {
      return {
        currency: item.currency,
        value: item[this.trackBy],
      }
    })
  }

  transformField(): RatesValueItem[] {
    if (!this._value)
      return []

    return this._value.map(item => ({
      currency: item.currency,
      [this.trackBy]: this.getTransformedValue(item.value),
    }))
  }

  protected getTransformedValue(value: number) {
    if (value === 0)
      return value

    if (!value)
      return null

    return this.withString ? value : +value
  }
}
