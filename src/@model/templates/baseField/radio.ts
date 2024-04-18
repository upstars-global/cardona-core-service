import type { Component } from 'vue'
import { markRaw } from 'vue'
import type { TranslateResult } from 'vue-i18n'
import RadioField from '../../../components/templates/FieldGenerator/_components/RadioField.vue'
import type { IBaseField } from './base'
import { BaseField } from './base'

export interface RadioOption {
  text: TranslateResult
  value: string | boolean
}

export interface IRadioBaseField extends IBaseField {
  readonly value?: string | boolean
  readonly options: RadioOption[]
}

export class RadioBaseField extends BaseField implements IRadioBaseField {
  readonly component: Component = markRaw(RadioField)
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
