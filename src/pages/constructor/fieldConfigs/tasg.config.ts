import type { BaseFieldConfig } from '../types'
import {
  getBaseConfig,
  getBooleanConfigParam,
  getSelectConfigParam,
  getTextConfigParam,
} from '../fieldConfigs/base.config'
import { ConstructorFieldType } from '../constants'
import { DataPickerPosition } from '@/@model/templates/baseField/date'

const tagsConfig: BaseFieldConfig = getBaseConfig({
  type: ConstructorFieldType.TagsBaseField,
})

export default tagsConfig
