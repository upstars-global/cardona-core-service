export enum ConstructorFieldType {
  CheckBaseField = 'CheckBaseField',
  CurrencyField = 'CurrencyBaseField',
  CheckGroupBaseField = 'CheckGroupBaseField',
  ConditionsBaseField = 'ConditionsBaseField',
  DateBaseField = 'DateBaseField',
  MultiSelectBaseField = 'MultiSelectBaseField',
  NumberBaseField = 'NumberBaseField',
  NumberRangeBaseField = 'NumberRangeBaseField',
  PasswordBaseField = 'PasswordBaseField',
  PhoneBaseField = 'PhoneBaseField',
  RadioBaseField = 'RadioBaseField',
  RatesBaseField = 'RatesBaseField',
  SelectBaseField = 'SelectBaseField',
  SwitchBaseField = 'SwitchBaseField',
  TagsBaseField = 'TagsBaseField',
  TextBaseField = 'TextBaseField',
  TextareaBaseField = 'TextareaBaseField',
  TimeBaseField = 'TimeBaseField',
  UsersListBaseField = 'UsersListBaseField',
  RichTextBaseField = 'RichTextBaseField',
}

export const FIELD_OPTIONS = Object.values(ConstructorFieldType)

export const fieldsWithPlaceholder = [
  ConstructorFieldType.UsersListBaseField,
  ConstructorFieldType.TextareaBaseField,
  ConstructorFieldType.NumberRangeBaseField,
  ConstructorFieldType.NumberBaseField,
  ConstructorFieldType.TextBaseField,
  ConstructorFieldType.RichTextBaseField,
  ConstructorFieldType.SelectBaseField,
]

export const fieldsWithLocalization = [
  ConstructorFieldType.TextBaseField,
  ConstructorFieldType.RichTextBaseField,
  ConstructorFieldType.TextareaBaseField,
]
