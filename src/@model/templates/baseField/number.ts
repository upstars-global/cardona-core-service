import { markRaw } from 'vue'
import type { NumberOrString } from '../../index'
import NumberField from '../../../components/templates/FieldGenerator/_components/NumberField.vue'
import { NUMBER_FIELD_MAX_VALUE } from '../../../utils/constants'
import type { IANumberBaseField } from './base'
import { ANumberBaseField } from './base'

export interface INumberBaseField extends IANumberBaseField {
  readonly value?: NumberOrString
}

export class NumberBaseField extends ANumberBaseField implements INumberBaseField {
  readonly component = markRaw(NumberField)
  protected _value?: NumberOrString

  constructor(field: INumberBaseField) {
    const defaultMaxValueRule = !field.validationRules?.max_value ? { max_value: NUMBER_FIELD_MAX_VALUE } : {}
    if (!field.validationRules?.max_value) {
      field.validationRules = {
        ...defaultMaxValueRule,
        ...field.validationRules,
      }
    }
    super(field)
    this._value = field.value ?? ''
  }
}
