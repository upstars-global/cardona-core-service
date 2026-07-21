export { BaseField } from './base'
export { TextBaseField } from './text'
export { NumberBaseField } from './number'
export { NumberRangeBaseField } from './number-range'
export { TextareaBaseField } from './textarea'
export { PasswordBaseField } from './password'
export { SelectBaseField } from './select'
export { DummySelectBaseField } from './dummySelect'
export { MultiSelectBaseField } from './multi-select'
export { RatesBaseField } from './rates'
export { TimeBaseField } from './time'
export { PhoneBaseField } from './phone'
export { ConditionsBaseField } from './conditions'
export { UsersListBaseField } from './users-list'
export { SwitchBaseField } from './switch'
export { CheckBaseField } from './check'
export { CheckGroupBaseField } from './check-group'
export { DateBaseField } from './date'
export { RadioBaseField } from './radio'
export { RichTextBaseField } from './rich-text'
export { TagsBaseField } from './tags'
export { CurrencyBaseField } from './currency'

export { getInstanceClass } from './getInstanceClass'

export enum FieldGeneratorSlots {
  ErrorMessage = 'error-message',
  Description = 'description',
  SelectedOptionName = 'selected-option-name',
  InfoText = 'info-text',
}
