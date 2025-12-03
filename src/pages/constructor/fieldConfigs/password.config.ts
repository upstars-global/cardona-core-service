import type { BaseFieldConfig } from '../types'
import {
  getBaseConfig,
  getBooleanConfigParam,
} from '../fieldConfigs/base.config'
import { ConstructorFieldType } from '../constants'

const passwordConfig: BaseFieldConfig = getBaseConfig({
  type: ConstructorFieldType.PasswordBaseField,
  options: {
    configParams: [
      getBooleanConfigParam('withPasswordGenerator'),
      getBooleanConfigParam('showPassword'),
    ],
  },
})

export default passwordConfig
