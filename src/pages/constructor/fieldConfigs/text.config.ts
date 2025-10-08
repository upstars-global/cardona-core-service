import type { BaseFieldConfig } from '../types'
import {getBaseConfig, getBooleanConfigParam, getTextConfigParam} from '@/pages/constructor/fieldConfigs/base.config'

const textConfig: BaseFieldConfig = getBaseConfig({
  type: 'text',
  options: {
    value: '',
    validationRules: { required: true },
    configParams: [
      getBooleanConfigParam('clearable'),
      getTextConfigParam('append'),
      getTextConfigParam('prepend'),
    ],
  },
})

export default textConfig
