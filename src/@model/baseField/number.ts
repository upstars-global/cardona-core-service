import { ITextBaseField, TextBaseField } from './text'
import NumberField from '../../components/templates/FieldGenerator/_components/NumberField.vue'

export interface INumberBaseField extends ITextBaseField {
  readonly withPositiveNumbers?: boolean
  readonly isIntegerNumbers?: boolean
}
export class NumberBaseField extends TextBaseField implements INumberBaseField {
  readonly component = NumberField
  readonly withPositiveNumbers?: boolean
  readonly isIntegerNumbers?: boolean

  constructor(field: INumberBaseField) {
    super(field)
    this.withPositiveNumbers = field.withPositiveNumbers
    this.isIntegerNumbers = field.isIntegerNumbers
  }
}
