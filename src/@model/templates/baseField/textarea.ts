import { Component } from 'vue'
import { BaseField, IBaseField } from './base'
import TextareaField from "../../../components/templates/FieldGenerator/_components/TextareaField.vue";

export interface ITextareaBaseField extends IBaseField {
  readonly value?: string
  readonly counter?: boolean
  readonly rows?: number
  readonly maxLength?: number
}

export class TextareaBaseField extends BaseField implements ITextareaBaseField {
  readonly component: Component = TextareaField
  protected _value?: string
  readonly counter?: boolean
  readonly rows: number
  readonly maxLength?: number

  constructor(field: ITextareaBaseField) {
    super(field)
    this._value = field.value
    this.counter = field.counter
    this.rows = field.rows ?? 4
    this.maxLength = field.maxLength ? field.maxLength : field.counter ? 100 : undefined
  }

  transformField() {
    return this._value ?? ''
  }
}