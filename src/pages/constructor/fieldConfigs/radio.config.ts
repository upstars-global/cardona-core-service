import type { BaseFieldConfig } from '../types'
import { getBaseConfig, getBooleanConfigParam, getTextConfigParam } from '../fieldConfigs/base.config'
import { ConstructorFieldType } from '../constants'

const radioConfig: BaseFieldConfig = getBaseConfig({
  type: ConstructorFieldType.RadioBaseField,
})

export default radioConfig
