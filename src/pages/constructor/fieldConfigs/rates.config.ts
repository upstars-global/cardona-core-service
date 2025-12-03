import type { BaseFieldConfig } from '../types'
import { getBaseConfig, getBooleanConfigParam, getTextConfigParam } from '../fieldConfigs/base.config'
import { ConstructorFieldType } from '../constants'

const ratesConfig: BaseFieldConfig = getBaseConfig({
  type: ConstructorFieldType.RatesBaseField,
  options: {
    configParams: [
      getTextConfigParam('trackBy'),
      getBooleanConfigParam('isCent'),
      getBooleanConfigParam('withString'),
      getBooleanConfigParam('isIntegerNumbers'),
    ],
  },
})

export default ratesConfig
