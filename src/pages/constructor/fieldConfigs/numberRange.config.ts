import type { BaseFieldConfig } from '../types'
import { getBooleanConfigParam } from '../fieldConfigs/base.config'
import { ConstructorFieldType } from '../constants'
import numberConfig from './number.config'

numberConfig.configParams?.push(getBooleanConfigParam('isCurrency'))
numberConfig.type = ConstructorFieldType.NumberRangeBaseField

const numberRange: BaseFieldConfig = numberConfig

export default numberRange
