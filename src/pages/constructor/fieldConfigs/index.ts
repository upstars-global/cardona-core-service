import { ConstructorFieldType } from '../constants'
import type { BaseFieldConfig } from '../types'
import text from './text.config'
import textarea from './textarea.config'
import select from './select.config'
import checkboxConfig from './checkbox.config'

export { text, textarea, select }

export const byClass: Record<ConstructorFieldType, BaseFieldConfig> = {
  [ConstructorFieldType.TextBaseField]: text,
  [ConstructorFieldType.TextareaBaseField]: textarea,
  [ConstructorFieldType.SelectBaseField]: select,
  [ConstructorFieldType.CheckBaseField]: checkboxConfig,
}
