import NumberRangeField from '../../components/templates/FieldGenerator/_components/NumberRangeField.vue'
import { INumberBaseField, NumberBaseField } from './number'

export class NumberRangeBaseField extends NumberBaseField {
  readonly component = NumberRangeField

  constructor(field: INumberBaseField) {
    super(field)
  }
}
