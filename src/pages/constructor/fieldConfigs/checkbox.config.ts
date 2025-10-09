import type { BaseFieldConfig } from '../types'
import { getBaseConfig, getBooleanConfigParam, getTextConfigParam } from '../fieldConfigs/base.config'
import { ConstructorFieldType } from '../constants'

const checkboxConfig: BaseFieldConfig = getBaseConfig({
  type: ConstructorFieldType.CheckBaseField,
})

export default checkboxConfig
