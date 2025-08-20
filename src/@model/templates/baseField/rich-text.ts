import type { Component } from 'vue'
import { markRaw } from 'vue'
import RichTextField from '../../../components/templates/FieldGenerator/_components/RichTextField.vue'
import type { IBaseField } from './base'
import { BaseField } from './base'

export interface IRichTextBaseField extends IBaseField {
  readonly value?: string
  readonly config?: Record<string, unknown>
}

export class RichTextBaseField extends BaseField implements IRichTextBaseField {
  readonly component: Component = markRaw(RichTextField)
  protected _value?: string
  readonly config?: Record<string, unknown>

  constructor(field: IRichTextBaseField) {
    super(field)
    this._value = field.value ?? ''
    this.config = field.config
  }

  transformField() {
    return this._value ?? ''
  }
}
