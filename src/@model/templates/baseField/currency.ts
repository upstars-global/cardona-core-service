import type { RatesValueItem } from '../../../@model/templates/baseField/rates'
import type { IBaseField } from '@/@model/templates/baseField/base'

export interface ICurrencyBaseField extends IBaseField {
  readonly value?: RatesValueItem
  readonly isCents?: boolean
  readonly trackBy?: string
  readonly withString?: boolean
  readonly isIntegerNumbers?: boolean
}

// export class CurrencyBaseField extends RatesBaseField {
//   readonly component: Component = markRaw(RatesField)
//   protected _value?: Required<RatesValueItem>
//   readonly trackBy: string
//   readonly isCents: boolean
//   readonly withString?: boolean
//   readonly isIntegerNumbers?: boolean
//   constructor(data: ICurrencyBaseField) {
//     super(data)
//   }
// }
