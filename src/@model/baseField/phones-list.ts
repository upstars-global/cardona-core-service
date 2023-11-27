import { Component } from 'vue'
import { BaseField, IBaseField } from './base'
import PhonesList from '../../components/templates/FieldGenerator/_components/PhonesList.vue'

export type IPhonesListValue = Array<{ phone: string; country: string }>
export interface IPhonesListBaseField extends IBaseField {
  readonly value?: IPhonesListValue
}

export class PhonesListBaseField extends BaseField implements IPhonesListBaseField {
  readonly component: Component = PhonesList
  protected _value?: IPhonesListValue

  constructor(field: IPhonesListBaseField) {
    super(field)
    this._value = field.value
  }
}
