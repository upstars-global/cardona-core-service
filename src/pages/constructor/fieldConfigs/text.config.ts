import type { BaseFieldConfig } from '../types'
import { getBaseConfig, getBooleanConfigParam, getTextConfigParam } from '../fieldConfigs/base.config'
import { ConstructorFieldType } from '../constants'

const textConfig: BaseFieldConfig = getBaseConfig({
  type: ConstructorFieldType.TextBaseField,
  options: {
    configParams: [
      getBooleanConfigParam('clearable'),
      getTextConfigParam('append'),
      getTextConfigParam('prepend'),
    ],
  },
})

export default textConfig
