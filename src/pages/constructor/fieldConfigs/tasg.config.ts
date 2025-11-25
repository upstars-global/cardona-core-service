import type { BaseFieldConfig } from '../types'
import {
  getBaseConfig,
} from '../fieldConfigs/base.config'
import { ConstructorFieldType } from '../constants'

const tagsConfig: BaseFieldConfig = getBaseConfig({
  type: ConstructorFieldType.TagsBaseField,
})

export default tagsConfig
