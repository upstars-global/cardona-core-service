import { Component } from 'vue'
import { BaseField, IBaseField } from './base'
import UsersListField from '@/components/templates/FieldGenerator/_components/UsersListField.vue'

export interface IUsersListBaseField extends IBaseField {
  readonly value?: Array<string>
}

export class UsersListBaseField extends BaseField implements IUsersListBaseField {
  readonly component: Component = UsersListField
  protected _value?: Array<string>

  constructor(field: IUsersListBaseField) {
    super(field)
    this._value = field.value
  }
}
