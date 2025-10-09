import type { BaseFieldConfig } from '../types'
import {
  getBaseConfig,
} from '../fieldConfigs/base.config'
import { ConstructorFieldType } from '../constants'

const timeConfig: BaseFieldConfig = getBaseConfig({
  type: ConstructorFieldType.TimeBaseField,
})

export default timeConfig
