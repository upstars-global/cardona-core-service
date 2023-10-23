import { BaseField } from './base'
import { TextBaseField } from './text'
import { NumberBaseField } from './number'
import { SelectBaseField } from './select'
import { MultiSelectBaseField } from './multi-select'
import { TimeBaseField } from './time'
import { ConditionsBaseField } from './conditions'
import { UsersListBaseField } from './users-list'

export const getInstanceClass = (instance: object) => {
  const fields = [
    UsersListBaseField,
    ConditionsBaseField,
    TimeBaseField,
    SelectBaseField,
    MultiSelectBaseField,
    NumberBaseField,
    TextBaseField,
  ]

  return fields.find((field) => instance instanceof field)
}

export {
  BaseField,
  TextBaseField,
  NumberBaseField,
  SelectBaseField,
  MultiSelectBaseField,
  TimeBaseField,
  ConditionsBaseField,
  UsersListBaseField,
}
