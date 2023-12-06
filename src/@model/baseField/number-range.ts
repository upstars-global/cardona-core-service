import NumberRangeField from '../../components/templates/FieldGenerator/_components/NumberRangeField.vue'
import { IANumberBaseField, ANumberBaseField } from './base'
import { NumberOrString, NumberRangeBaseValue } from '../../@model'
import { division, multiplication } from '../../helpers/math-operations'

export interface INumberRangeBaseField extends IANumberBaseField {
  value?: NumberRangeBaseValue
  isCurrency?: boolean
}

export class NumberRangeBaseField extends ANumberBaseField implements INumberRangeBaseField {
  readonly component = NumberRangeField
  protected _value?: NumberRangeBaseValue
  isCurrency: boolean

  constructor(field: INumberRangeBaseField) {
    super(field)
    this.isCurrency = field.isCurrency ?? true
    this._value = this.isCurrency ? this.divisionValue(field.value) : field.value
  }

  transformField(key = this.key): Record<string, string | number> {
    return {
      [`${key}From`]: this.getTransformValue(this._value?.from),
      [`${key}To`]: this.getTransformValue(this._value?.to),
    }
  }

  private divisionValue(value?: NumberRangeBaseValue): NumberRangeBaseValue {
    return {
      from: value?.from && division(value.from, 100),
      to: value?.to && division(value.to, 100),
    }
  }

  private getTransformValue(value?: NumberOrString): NumberOrString {
    return value && this.isCurrency ? multiplication(value, 100) : value
  }
}
