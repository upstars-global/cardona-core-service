import { markRaw } from 'vue'
import type { IRatesBaseField } from '../../../@model/templates/baseField/rates'
import CurrencyField from '../../../components/templates/FieldGenerator/_components/CurrencyField.vue'
import { division, multiplication } from '../../../helpers/math-operations'
import { BaseField } from '../../../@model/templates/baseField/base'

export type CurrencyValue = number | string
export interface ICurrencyBaseField extends IRatesBaseField {
  value: CurrencyValue
}

export class CurrencyBaseField extends BaseField {
  readonly component: Component = markRaw(CurrencyField)
  protected _value?: CurrencyValue
  readonly isCents?: boolean
  readonly withString?: boolean
  readonly isIntegerNumbers?: boolean
  readonly withPositiveNumbers?: boolean

  constructor(data: ICurrencyBaseField) {
    super(data)
    this.isCents = data.isCents ?? true
    this.withString = data.withString
    this.isIntegerNumbers = data.isIntegerNumbers
    this._value = this.getInitialValue(data.value)
  }

  transformField(): CurrencyValue {
    if (!this._value)
      return ''

    return this.getTransformedValue(this._value)
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
