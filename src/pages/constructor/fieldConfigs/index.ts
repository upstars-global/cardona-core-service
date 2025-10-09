import { ConstructorFieldType } from '../constants'
import type { BaseFieldConfig } from '../types'
import numberConfig from './number.config'
import numberRange from './numberRange.config'
import textConfig from './text.config'
import textareaConfig from './textarea.config'
import selectConfig from './select.config'
import checkboxConfig from './checkbox.config'
import checkboxGroup from './checkboxGroup.config'
import conditionConfig from './condition.config'
import currencyConfig from './currency.config'
import dateConfig from './date.config'
import multiSelectConfig from './multiSelect.config'
import passwordConfig from './password.config'
import phoneConfig from './phone.config'
import radioConfig from './radio.config'
import ratesConfig from './rates.config'
import richTextConfig from './richText.config'
import switchConfig from './swicth.config'
import tagsConfig from './tasg.config'
import timeConfig from './time.config'
import userListConfig from './userList.config'

export const byClass: Record<ConstructorFieldType, BaseFieldConfig> = {
  [ConstructorFieldType.TextBaseField]: textConfig,
  [ConstructorFieldType.TextareaBaseField]: textareaConfig,
  [ConstructorFieldType.SelectBaseField]: selectConfig,
  [ConstructorFieldType.CheckBaseField]: checkboxConfig,
  [ConstructorFieldType.CheckGroupBaseField]: checkboxGroup,
  [ConstructorFieldType.ConditionsBaseField]: conditionConfig,
  [ConstructorFieldType.CurrencyField]: currencyConfig,
  [ConstructorFieldType.DateBaseField]: dateConfig,
  [ConstructorFieldType.MultiSelectBaseField]: multiSelectConfig,
  [ConstructorFieldType.NumberBaseField]: numberConfig,
  [ConstructorFieldType.NumberRangeBaseField]: numberRange,
  [ConstructorFieldType.PasswordBaseField]: passwordConfig,
  [ConstructorFieldType.PhoneBaseField]: phoneConfig,
  [ConstructorFieldType.RadioBaseField]: radioConfig,
  [ConstructorFieldType.RatesBaseField]: ratesConfig,
  [ConstructorFieldType.RichTextBaseField]: richTextConfig,
  [ConstructorFieldType.SwitchBaseField]: switchConfig,
  [ConstructorFieldType.TagsBaseField]: tagsConfig,
  [ConstructorFieldType.TimeBaseField]: timeConfig,
  [ConstructorFieldType.UsersListBaseField]: userListConfig,
}
