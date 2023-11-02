import { ANumberBaseField, IANumberBaseField } from './base'
import NumberField from '../../components/templates/FieldGenerator/_components/NumberField.vue'
import { NumberOrString } from '../index'

export interface INumberBaseField extends IANumberBaseField {
  readonly value?: NumberOrString
}

export class NumberBaseField extends ANumberBaseField implements INumberBaseField {
  readonly component = NumberField
  protected _value?: NumberOrString

  constructor(field: INumberBaseField) {
    super(field)
    this._value = field.value
  }
}
