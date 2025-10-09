import type { BaseFieldConfig } from '../types'
import { getBaseConfig, getBooleanConfigParam, getTextConfigParam } from '../fieldConfigs/base.config'
import { ConstructorFieldType } from '../constants'

const phoneConfig: BaseFieldConfig = getBaseConfig({
  type: ConstructorFieldType.PhoneBaseField,
})

export default phoneConfig
