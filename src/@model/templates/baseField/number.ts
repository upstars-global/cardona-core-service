import type { NumberOrString } from '../../index'
import NumberField from '../../../components/templates/FieldGenerator/_components/NumberField.vue'
import type { IANumberBaseField } from './base'
import { ANumberBaseField } from './base'

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
