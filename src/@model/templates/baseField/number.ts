import type { ITextBaseField } from './text'
import { TextBaseField } from './text'

export interface INumberBaseField extends ITextBaseField {
  readonly withPositiveNumbers?: boolean
}
export class NumberBaseField extends TextBaseField implements INumberBaseField {
  readonly component = {}
  readonly withPositiveNumbers?: boolean

  constructor(field: INumberBaseField) {
    super(field)
    this.withPositiveNumbers = field.withPositiveNumbers
  }
}
