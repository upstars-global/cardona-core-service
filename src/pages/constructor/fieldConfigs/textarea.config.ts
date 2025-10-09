import type { BaseFieldConfig } from '../types'
import { ConstructorFieldType } from '../constants'
import { getBaseConfig, getBooleanConfigParam, getTextConfigParam } from '../fieldConfigs/base.config'

const textareaConfig: BaseFieldConfig = getBaseConfig({
  type: ConstructorFieldType.SelectBaseField,
  options: {
    items: [],
    validationRules: { required: false },
    configParams: [
      getBooleanConfigParam('counter'),
      getTextConfigParam('rows'),
      getTextConfigParam('maxLength'),
      getBooleanConfigParam('maxLength'),
    ],
  },
})

export default textareaConfig
