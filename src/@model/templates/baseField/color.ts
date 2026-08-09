import type { Component } from 'vue'
import { markRaw } from 'vue'
import ColorField from '../../../components/templates/FieldGenerator/_components/ColorField.vue'
import type { IATextBaseField } from './base'
import { ATextBaseField } from './base'

export interface IColorBaseField extends IATextBaseField {
  readonly value?: string
}

export class ColorBaseField extends ATextBaseField implements IColorBaseField {
  readonly component: Component = markRaw(ColorField)
  protected _value?: string

  constructor(field: IColorBaseField) {
    super(field)
    this._value = field.value
  }
}
