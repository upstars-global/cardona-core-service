import type { BaseFieldConfig } from '../types'
import { getBaseConfig, getBooleanConfigParam } from '../fieldConfigs/base.config'
import { ConstructorFieldType } from '../constants'

const currencyConfig: BaseFieldConfig = getBaseConfig({
  type: ConstructorFieldType.CurrencyField,
  options: {
    items: [],
    validationRules: { required: false },
    configParams: [
      getBooleanConfigParam('isCent'),
      getBooleanConfigParam('isIntegerNumbers'),
      getBooleanConfigParam('withPositiveNumbers'),
    ],
  },
})

export default currencyConfig
