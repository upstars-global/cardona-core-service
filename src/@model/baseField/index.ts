import { BaseField } from './base'
import { TextBaseField } from './text'
import { NumberBaseField } from './number'
import { SelectBaseField } from './select'
import { TimeBaseField } from './time'
import { UsersListBaseField } from './users-list'

export const getInstanceClass = (instance: object) => {
  const fields = [TimeBaseField, SelectBaseField, NumberBaseField, TextBaseField]

  return fields.find((field) => instance instanceof field)
}

export {
  BaseField,
  TextBaseField,
  NumberBaseField,
  SelectBaseField,
  TimeBaseField,
  UsersListBaseField,
}
