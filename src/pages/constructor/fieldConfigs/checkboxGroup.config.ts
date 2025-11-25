import type { BaseFieldConfig } from '../types'
import { getBaseConfig } from '../fieldConfigs/base.config'
import { ConstructorFieldType } from '../constants'

const checkboxGroupConfig: BaseFieldConfig = getBaseConfig({
  type: ConstructorFieldType.CheckGroupBaseField,
})

export default checkboxGroupConfig
