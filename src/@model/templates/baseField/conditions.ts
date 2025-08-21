import type { Component } from 'vue'
import { markRaw } from 'vue'
import ConditionsField from '../../../components/templates/FieldGenerator/_components/ConditionsField.vue'
import type { IBaseField } from './base'
import { BaseField } from './base'

export interface IConditionsBaseField extends IBaseField {
  readonly value?: string
  readonly fetchOptionsAction: CallableFunction
}

export class ConditionsBaseField extends BaseField implements IConditionsBaseField {
  readonly component: Component = markRaw(ConditionsField)
  protected _value?: string
  readonly fetchOptionsAction: CallableFunction

  constructor(field: IConditionsBaseField) {
    super(field)
    this._value = field.value
    this.fetchOptionsAction = field.fetchOptionsAction
  }

  async fetchOptions() {
    if (this.fetchOptionsAction)
      return await this.fetchOptionsAction()
  }
}
