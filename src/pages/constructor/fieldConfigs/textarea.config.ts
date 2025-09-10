import type { BaseFieldConfig } from '../types'

const textareaConfig: BaseFieldConfig = {
  type: 'textarea',
  options: {
    key: '',
    label: 'Textarea field',
    value: '',
    rows: 4,
    validationRules: { required: false },
  },
}

export default textareaConfig
