import type { BaseFieldConfig } from '../types'
import { getBaseConfig } from '../fieldConfigs/base.config'
import { ConstructorFieldType } from '../constants'

const richTextConfig: BaseFieldConfig = getBaseConfig({
  type: ConstructorFieldType.RichTextBaseField,
})

export default richTextConfig
