import type { BaseFieldConfig } from '../types'
import {
  getBaseConfig,
  getBooleanConfigParam,
  getSelectConfigParam,
  getTextConfigParam,
} from '../fieldConfigs/base.config'
import { ConstructorFieldType } from '../constants'
import { DataPickerPosition } from '@/@model/templates/baseField/date'

const dateConfig: BaseFieldConfig = getBaseConfig({
  type: ConstructorFieldType.DateBaseField,
  options: {
    items: [],
    validationRules: { required: false },
    configParams: [

      getBooleanConfigParam('isRangeMode'),
      getBooleanConfigParam('isStartDateNow'),
      getBooleanConfigParam('withTime'),
      getBooleanConfigParam('allowFutureDate'),
      getTextConfigParam('separator'),
      getTextConfigParam('maxDateTo'),
      getSelectConfigParam('position', [Object.values(DataPickerPosition)]),
    ],
  },
})

export default dateConfig
