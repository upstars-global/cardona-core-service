import { ITextBaseField, TextBaseField } from './text'
import NumberField from '../../components/templates/FieldGenerator/_components/NumberField.vue'

export interface INumberBaseField extends ITextBaseField {
  readonly withPositiveNumbers?: boolean
}
export class NumberBaseField extends TextBaseField implements INumberBaseField {
  readonly component = NumberField
  readonly withPositiveNumbers?: boolean

  constructor(field: INumberBaseField) {
    super(field)
    this.withPositiveNumbers = field.withPositiveNumbers
  }
}
