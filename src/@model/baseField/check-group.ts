import { Component } from 'vue'
import { BaseField, IBaseField } from './base'
import { OptionsItem } from '../index'
import CheckGroupField from '../../components/templates/FieldGenerator/_components/CheckGroupField.vue'

interface CheckGroupOptionsItem extends OptionsItem {
  readonly disabled?: boolean
}

export interface ICheckGroupBaseField extends IBaseField {
  readonly value?: string[]
  readonly options: CheckGroupOptionsItem[]
}

export class CheckGroupBaseField extends BaseField implements ICheckGroupBaseField {
  readonly component: Component = CheckGroupField
  protected _value?: string[]
  readonly options: CheckGroupOptionsItem[]

  constructor(field: ICheckGroupBaseField) {
    super(field)
    this._value = field.value
    this.options = field.options
  }

  transformField() {
    return this._value ?? []
  }
}
