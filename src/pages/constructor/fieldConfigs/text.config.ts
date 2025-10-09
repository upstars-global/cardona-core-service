import type { BaseFieldConfig } from '../types'
import { getBaseConfig, getBooleanConfigParam, getTextConfigParam } from '../fieldConfigs/base.config'
import { ConstructorFieldType } from '../constants'

const textConfig: BaseFieldConfig = getBaseConfig({
  type: ConstructorFieldType.TextBaseField,
  options: {
    value: '',
    validationRules: { required: true },
    configParams: [
      getBooleanConfigParam('clearable'),
      getTextConfigParam('append'),
      getTextConfigParam('prepend'),
    ],
  },
})

export default textConfig
