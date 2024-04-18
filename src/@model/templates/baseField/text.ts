import type { Component } from 'vue'
import type { TranslateResult } from 'vue-i18n'
import { markRaw } from 'vue'
import TextField from '../../../components/templates/FieldGenerator/_components/TextField.vue'
import type { IBaseField } from './base'
import { BaseField } from './base'

export interface ITextBaseField extends IBaseField {
  readonly value?: string | number
  readonly prepend?: TranslateResult
  readonly append?: TranslateResult
}

export class TextBaseField extends BaseField implements ITextBaseField {
  readonly component: Component = markRaw(TextField)
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
