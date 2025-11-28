import type { BaseFieldConfig } from '../types'
import {
  getBaseConfig,
  getBooleanConfigParam,
} from '../fieldConfigs/base.config'
import { ConstructorFieldType } from '../constants'

const switchConfig: BaseFieldConfig = getBaseConfig({
  type: ConstructorFieldType.SwitchBaseField,
  options: {
    configParams: [
      getBooleanConfigParam('withState'),
    ],
  },
})

export default switchConfig
