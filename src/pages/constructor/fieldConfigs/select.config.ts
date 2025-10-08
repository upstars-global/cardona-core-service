import type { BaseFieldConfig } from '../types'
import {getBaseConfig, getBooleanConfigParam} from '../fieldConfigs/base.config'

// const selectConfig: BaseFieldConfig = {
//   type: 'select',
//   options: {
//     ...baseConfig,
//     items: [], // масив значень { label, value }
//     multiple: false,
//     clearable: true,
//     validationRules: { required: false },
//     options: [
//       ...baseConfig.options,
//     ],
//   },
// }
const selectConfig: BaseFieldConfig = getBaseConfig({
  type: 'select',
  options: {
    items: [],
    validationRules: { required: false },
    configParams: [
      getBooleanConfigParam('multiple'),
      getBooleanConfigParam('clearable'),
    ],
  },
})

export default selectConfig
