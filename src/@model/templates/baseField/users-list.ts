import type { Component } from 'vue'
import { markRaw } from 'vue'
import UsersListField from '../../../components/templates/FieldGenerator/_components/UsersListField.vue'
import type { IBaseField } from './base'
import { BaseField } from './base'

export interface IUsersListBaseField extends IBaseField {
  readonly value?: Array<string>
}

export class UsersListBaseField extends BaseField implements IUsersListBaseField {
  readonly component: Component = markRaw(UsersListField)
  protected _value?: Array<string>

  constructor(field: IUsersListBaseField) {
    super(field)
    this._value = field.value
  }
}
