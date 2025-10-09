import type { BaseFieldConfig } from '../types'
import { ConstructorFieldType } from '../constants'
import { getBaseConfig, getBooleanConfigParam, getTextConfigParam } from '../fieldConfigs/base.config'

const textareaConfig: BaseFieldConfig = getBaseConfig({
  type: ConstructorFieldType.SelectBaseField,
  options: {
    configParams: [
      getBooleanConfigParam('counter'),
      getTextConfigParam('rows'),
      getTextConfigParam('maxLength'),
      getBooleanConfigParam('maxLength'),
    ],
  },
})

export default textareaConfig
