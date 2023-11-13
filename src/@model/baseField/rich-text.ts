import { Component } from 'vue'
import { BaseField, IBaseField } from './base'
import RichTextField from '../../components/templates/FieldGenerator/_components/RichTextField.vue'

export interface IRichTextBaseField extends IBaseField {
  readonly value?: string
}

export class RichTextBaseField extends BaseField implements IRichTextBaseField {
  readonly component: Component = RichTextField
  protected _value?: string

  constructor(field: IRichTextBaseField) {
    super(field)
    this._value = field.value
  }

  transformField() {
    return this._value ?? ''
  }
}
