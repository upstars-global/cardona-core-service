import { Component } from 'vue'
import { ATextBaseField, IATextBaseField } from './base'
import TextField from '../../components/templates/FieldGenerator/_components/TextField.vue'
import { NumberOrString } from '../index'

export interface ITextBaseField extends IATextBaseField {
  readonly value?: NumberOrString
}

export class TextBaseField extends ATextBaseField implements ITextBaseField {
  readonly component: Component = TextField
  protected _value?: NumberOrString

  constructor(field: ITextBaseField) {
    super(field)
    this._value = field.value
  }
}
