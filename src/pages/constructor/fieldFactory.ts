import type { BaseFieldConfig } from './types'
import { ConstructorFieldType } from './constants'

export function createField(config: BaseFieldConfig) {
  const { type, options } = config

  if (!Object.values(ConstructorFieldType).includes(type))
    throw new Error(`Unknown field type: ${type}`)

  return `new ${type}(${JSON.stringify(options, null, 2)})`
}
