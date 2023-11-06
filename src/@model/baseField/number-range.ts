import NumberRangeField from '../../components/templates/FieldGenerator/_components/NumberRangeField.vue'
import { IANumberBaseField, ANumberBaseField } from './base'
import { NumberOrString } from '../index'

type NumberRangeBaseValue = {
  from: NumberOrString
  to: NumberOrString
}

export interface INumberRangeBaseField extends IANumberBaseField {
  value?: NumberRangeBaseValue
}

export class NumberRangeBaseField extends ANumberBaseField implements INumberRangeBaseField {
  readonly component = NumberRangeField
  protected _value?: NumberRangeBaseValue

  constructor(field: INumberRangeBaseField) {
    super(field)
    this._value = field.value
  }
}