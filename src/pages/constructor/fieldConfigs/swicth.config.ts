import type { BaseFieldConfig } from '../types'
import {
  getBaseConfig,
  getBooleanConfigParam,
  getSelectConfigParam,
  getTextConfigParam,
} from '../fieldConfigs/base.config'
import { ConstructorFieldType } from '../constants'
import { DataPickerPosition } from '@/@model/templates/baseField/date'

const switchConfig: BaseFieldConfig = getBaseConfig({
  type: ConstructorFieldType.SwitchBaseField,
  options: {
    items: [],
    validationRules: { required: false },
    configParams: [
      getBooleanConfigParam('withState'),
    ],
  },
})

export default switchConfig
