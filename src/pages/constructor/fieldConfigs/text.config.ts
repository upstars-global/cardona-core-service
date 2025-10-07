import type { BaseFieldConfig } from '../types'

const textConfig: BaseFieldConfig = {
  type: 'text',
  options: {
    key: '',
    label: 'Text field',
    value: '',
    validationRules: { required: true },
  },
  configParams: [
    {
      key: 'append',
      input: 'text',
      value: '',
    },
  ],
}

export default textConfig
