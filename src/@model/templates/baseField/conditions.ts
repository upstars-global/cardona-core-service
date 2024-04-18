import type { Component } from 'vue'
import { markRaw } from 'vue'
import store from '../../../store'
import ConditionsField from '../../../components/templates/FieldGenerator/_components/ConditionsField.vue'
import type { IBaseField } from './base'
import { BaseField } from './base'

export interface IConditionsBaseField extends IBaseField {
  readonly value?: string
  readonly fetchOptionsActionName: string
}

export class ConditionsBaseField extends BaseField implements IConditionsBaseField {
  readonly component: Component = markRaw(ConditionsField)
  protected _value?: string
  readonly fetchOptionsActionName: string

  constructor(field: IConditionsBaseField) {
    super(field)
    this._value = field.value
    this.fetchOptionsActionName = field.fetchOptionsActionName
  }

  async fetchOptions() {
    if (this.fetchOptionsActionName)
      return await store.dispatch(this.fetchOptionsActionName)
  }
}
