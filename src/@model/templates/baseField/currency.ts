import { markRaw } from 'vue'
import type { RatesValueItem } from '../../../@model/templates/baseField/rates'
import CurrencyField from '../../../components/templates/FieldGenerator/_components/CurrencyField.vue'
import { division, multiplication } from '../../../helpers/math-operations'
import { BaseField } from '../../../@model/templates/baseField/base'

export class CurrencyBaseField extends BaseField {
  readonly component: Component = markRaw(CurrencyField)
  protected _value?: Required<RatesValueItem>
  readonly isCents?: boolean
  readonly trackBy?: string
  readonly withString?: boolean
  readonly isIntegerNumbers?: boolean

  constructor(data: any) {
    super(data)
    this.trackBy = data.trackBy ?? 'value'
    this.isCents = data.isCents ?? true
    this.withString = data.withString
    this.isIntegerNumbers = data.isIntegerNumbers
    this._value = {
      ...data.value,
      value: this.getInitialValue(data.value?.[this.trackBy]),
    }
  }

  transformField(): RatesValueItem {
    if (!this._value)
      return { currency: '', value: Number.NaN }

    return {
      currency: this._value.currency,
      [this.trackBy]: this.getTransformedValue(this._value.value),
    }
  }

  protected getInitialValue(value: number): number {
    if (!value)
      return 0

    if (this.isCents && !this.withString)
      return division(value, 100)

    return value
  }

  protected getTransformedValue(value: number) {
    if (value === 0)
      return value

    if (!value)
      return null

    if (this.isCents && !this.withString)
      return multiplication(value, 100)

    return this.withString ? value : +value
  }
}
