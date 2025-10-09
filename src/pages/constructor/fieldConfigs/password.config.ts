import type { BaseFieldConfig } from '../types'
import {
  getBaseConfig,
  getBooleanConfigParam,
  getSelectConfigParam,
  getTextConfigParam,
} from '../fieldConfigs/base.config'
import { ConstructorFieldType } from '../constants'
import { DataPickerPosition } from '@/@model/templates/baseField/date'

const passwordConfig: BaseFieldConfig = getBaseConfig({
  type: ConstructorFieldType.PasswordBaseField,
  options: {
    items: [],
    validationRules: { required: false },
    configParams: [
      getBooleanConfigParam('withPasswordGenerator'),
      getBooleanConfigParam('showPassword'),
    ],
  },
})

export default passwordConfig
