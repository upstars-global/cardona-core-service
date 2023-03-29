import { ITextBaseField, TextBaseField } from './text'
import NumberField from '../../components/templates/FieldGenerator/_components/NumberField.vue'

export class NumberBaseField extends TextBaseField implements ITextBaseField {
  readonly component = NumberField

  constructor(field: ITextBaseField) {
    super(field)
  }
}
