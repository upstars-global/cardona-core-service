import { BaseField } from './base'
import { TextBaseField } from './text'
import { NumberBaseField } from './number'
import { TextareaBaseField } from './textarea'
import { PasswordBaseField } from './password'
import { SelectBaseField } from './select'
import { MultiSelectBaseField } from './multi-select'
import { RatesBaseField } from './rates'
import { TimeBaseField } from './time'
import { PhoneBaseField } from './phone'
import { ConditionsBaseField } from './conditions'
import { UsersListBaseField } from './users-list'
import { SwitchBaseField } from './switch'
import { CheckBaseField } from './check'
import { CheckGroupBaseField } from './check-group'
import { DateBaseField } from './date'
import { FormDateBaseField } from './formDate'
import { RadioBaseField } from './radio'
import { RichTextBaseField } from './rich-text'
import { TagsBaseField } from './tags'

export const getInstanceClass = (instance: object) => {
  const fields = [
    TagsBaseField,
    RichTextBaseField,
    RadioBaseField,
    CheckGroupBaseField,
    CheckBaseField,
    DateBaseField,
    FormDateBaseField,
    SwitchBaseField,
    UsersListBaseField,
    ConditionsBaseField,
    TimeBaseField,
    PhoneBaseField,
    SelectBaseField,
    MultiSelectBaseField,
    RatesBaseField,
    PasswordBaseField,
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
  PasswordBaseField,
  SelectBaseField,
  MultiSelectBaseField,
  RatesBaseField,
  TimeBaseField,
  PhoneBaseField,
  ConditionsBaseField,
  UsersListBaseField,
  SwitchBaseField,
  RadioBaseField,
  DateBaseField,
  FormDateBaseField,
  CheckBaseField,
  RichTextBaseField,
  CheckGroupBaseField,
  TagsBaseField,
}
