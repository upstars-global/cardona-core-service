import { BaseField } from './base'
import { TextBaseField } from './text'
import { NumberBaseField } from './number'
import { TextareaBaseField } from './textarea'
import { SelectBaseField } from './select'
import { MultiSelectBaseField } from './multi-select'
import { TimeBaseField } from './time'
import { ConditionsBaseField } from './conditions'
import { UsersListBaseField } from './users-list'
import { SwitchBaseField } from './switch'
import { CheckBaseField } from './check'
import { DateBaseField } from './date'
import { RadioBaseField } from './radio'
import { RichTextBaseField } from './rich-text'

export const getInstanceClass = (instance: object) => {
  const fields = [
    RichTextBaseField,
    RadioBaseField,
    CheckBaseField,
    DateBaseField,
    SwitchBaseField,
    UsersListBaseField,
    ConditionsBaseField,
    TimeBaseField,
    SelectBaseField,
    MultiSelectBaseField,
    TextareaBaseField,
    NumberBaseField,
    TextBaseField,
  ]

  return fields.find((field) => instance instanceof field)
}

export {
  BaseField,
  TextBaseField,
  NumberBaseField,
  TextareaBaseField,
  SelectBaseField,
  MultiSelectBaseField,
  TimeBaseField,
  ConditionsBaseField,
  UsersListBaseField,
  SwitchBaseField,
  RadioBaseField,
  DateBaseField,
  CheckBaseField,
  RichTextBaseField,
}
