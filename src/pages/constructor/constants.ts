export enum ConstructorFieldType {
  TextBaseField = 'TextBaseField',
  TextareaBaseField = 'TextareaBaseField',
  TagsBaseField = 'TagsBaseField',
  NumberBaseField = 'NumberBaseField',
  NumberRangeBaseField = 'NumberRangeBaseField',
  SelectBaseField = 'SelectBaseField',
  SwitchBaseField = 'SwitchBaseField',
  MultiSelectBaseField = 'MultiSelectBaseField',
  CheckBaseField = 'CheckBaseField',
  CheckGroupBaseField = 'CheckGroupBaseField',
  CurrencyField = 'CurrencyBaseField',
  ConditionsBaseField = 'ConditionsBaseField',
  DateBaseField = 'DateBaseField',
  TimeBaseField = 'TimeBaseField',
  PasswordBaseField = 'PasswordBaseField',
  PhoneBaseField = 'PhoneBaseField',
  RadioBaseField = 'RadioBaseField',
  RatesBaseField = 'RatesBaseField',
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
