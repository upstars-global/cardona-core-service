import type { BaseFieldConfig } from '../types'
import { getNumberBaseConfig } from '../fieldConfigs/base.config'
import { ConstructorFieldType } from '../constants'

const numberConfig: BaseFieldConfig = getNumberBaseConfig({
  type: ConstructorFieldType.NumberBaseField,
})

export default numberConfig
