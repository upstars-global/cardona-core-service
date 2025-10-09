import type { BaseFieldConfig } from '../types'
import { getBaseConfig, getBooleanConfigParam } from '../fieldConfigs/base.config'
import { ConstructorFieldType } from '../constants'

const selectConfig: BaseFieldConfig = getBaseConfig({
  type: ConstructorFieldType.SelectBaseField,
  options: {
    items: [],
    validationRules: { required: false },
    configParams: [
      getBooleanConfigParam('multiple'),
      getBooleanConfigParam('clearable'),
    ],
  },
})

export default selectConfig
