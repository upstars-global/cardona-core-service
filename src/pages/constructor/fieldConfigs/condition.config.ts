import type { BaseFieldConfig } from '../types'
import { getBaseConfig } from '../fieldConfigs/base.config'
import { ConstructorFieldType } from '../constants'

const conditionConfig: BaseFieldConfig = getBaseConfig({
  type: ConstructorFieldType.ConditionsBaseField,
})

export default conditionConfig
