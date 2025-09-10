import type { BaseFieldConfig } from '../types'

const selectConfig: BaseFieldConfig = {
  type: 'select',
  options: {
    key: '',
    label: 'Select field',
    value: null,
    items: [], // масив значень { label, value }
    multiple: false,
    clearable: true,
    validationRules: { required: false },
  },
}

export default selectConfig
