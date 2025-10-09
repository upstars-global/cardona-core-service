import type { BaseFieldConfig } from '../types'
import {
  getBaseConfig,
  getBooleanConfigParam,
  getSelectConfigParam,
  getTextConfigParam,
} from '../fieldConfigs/base.config'
import { ConstructorFieldType } from '../constants'
import { DataPickerPosition } from '@/@model/templates/baseField/date'

const timeConfig: BaseFieldConfig = getBaseConfig({
  type: ConstructorFieldType.TimeBaseField,
})

export default timeConfig
