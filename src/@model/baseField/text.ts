import { Component } from 'vue'
import { TranslateResult } from 'vue-i18n'
import { BaseField, IBaseField } from './base'
import TextField from '@/components/templates/FieldGenerator/_components/TextField.vue'

export interface ITextBaseField extends IBaseField {
  readonly value?: string | number
  readonly prepend?: TranslateResult
  readonly append?: TranslateResult
}

export class TextBaseField extends BaseField implements ITextBaseField {
  readonly component: Component = TextField
  protected _value?: string | number
  readonly prepend?: TranslateResult
  readonly append?: TranslateResult

  constructor(field: ITextBaseField) {
    super(field)
    this._value = field.value
    this.prepend = field.prepend
    this.append = field.append
  }
}
