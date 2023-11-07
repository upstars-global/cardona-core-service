import { Component } from 'vue'
import { BaseField, IBaseField } from './base'
import RadioField from '../../components/templates/FieldGenerator/_components/RadioField.vue'
import { TranslateResult } from 'vue-i18n'

export interface RadioOption {
  text: TranslateResult
  value: string | boolean
}

export interface IRadioBaseField extends IBaseField {
  readonly value?: string | boolean
  readonly options: RadioOption[]
}

export class RadioBaseField extends BaseField implements IRadioBaseField {
  readonly component: Component = RadioField
  protected _value?: string | boolean
  readonly options: RadioOption[]

  constructor(field: IRadioBaseField) {
    super(field)
    this._value = field.value
    this.options = field.options
  }

  transformField() {
    return this._value ?? ''
  }
}
