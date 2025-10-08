import type { BaseFieldConfig } from '../types'
import { getBaseConfig } from '../fieldConfigs/base.config'

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
    items: [], // масив значень { label, value }
    multiple: false,
    clearable: true,
    label: '',
    placeholder: '',
    description: '',
    validationRules: { required: false },
  },
})

export default selectConfig
