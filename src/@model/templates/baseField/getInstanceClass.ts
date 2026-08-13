import { TextBaseField } from './text'
import { NumberBaseField } from './number'
import { NumberRangeBaseField } from './number-range'
import { TextareaBaseField } from './textarea'
import { PasswordBaseField } from './password'
import { SelectBaseField } from './select'
import { DummySelectBaseField } from './dummySelect'
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
import { RadioBaseField } from './radio'
import { RichTextBaseField } from './rich-text'
import { TagsBaseField } from './tags'
import { CurrencyBaseField } from './currency'
import { ColorBaseField } from './color'
import { GradientBaseField } from './gradient'

export const getInstanceClass = (instance: object) => {
  // TODO: The order in the method is important, since some classes inherit from each other
  // For example, DummySelectBaseField is inherited from SelectBaseField
  // and the check dummySelectInstance instanceof SelectBaseField will return true

  const fields = [
    ColorBaseField,
    GradientBaseField,
    TagsBaseField,
    RichTextBaseField,
    RadioBaseField,
    CheckGroupBaseField,
    CheckBaseField,
    DateBaseField,
    SwitchBaseField,
    UsersListBaseField,
    ConditionsBaseField,
    TimeBaseField,
    PhoneBaseField,
    DummySelectBaseField,
    SelectBaseField,
    MultiSelectBaseField,
    RatesBaseField,
    PasswordBaseField,
    TextareaBaseField,
    NumberRangeBaseField,
    NumberBaseField,
    TextBaseField,
    CurrencyBaseField,
  ]

  return fields.find(field => instance instanceof field)
}
