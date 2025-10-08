import type { BaseFieldConfig } from './types'

export function createField(config: BaseFieldConfig) {
  const { type, options } = config
  console.log(type)
  switch (type) {
    case 'text':
      return `new TextBaseField(${JSON.stringify(options, null, 2)})`
    case 'textarea':
      return `new TextareaBaseField(${JSON.stringify(options, null, 2)})`
    case 'select':
      return `new SelectBaseField(${JSON.stringify(options, null, 2)})`
    default:
      throw new Error(`Unknown field type: ${type}`)
  }
}
