import type { Component } from 'vue'
import { markRaw } from 'vue'
import CheckGroupField from '../../../components/templates/FieldGenerator/_components/CheckGroupField.vue'
import type { OptionsItem } from '../../../@model'
import type { IBaseField } from './base'
import { BaseField } from './base'

interface CheckGroupOptionsItem extends OptionsItem {
  readonly disabled?: boolean
}

export interface ICheckGroupBaseField extends IBaseField {
  readonly value?: string[]
  readonly options: CheckGroupOptionsItem[]
}

export class CheckGroupBaseField extends BaseField implements ICheckGroupBaseField {
  readonly component: Component = markRaw(CheckGroupField)
  protected _value?: string[]
  readonly options: CheckGroupOptionsItem[]

  constructor(field: ICheckGroupBaseField) {
    super(field)
    this._value = field.value || []
    this.options = field.options
  }

  transformField() {
    return this._value ?? []
  }
}
