import type { ConstructorFieldType } from './constants'

export type ConfigParamValue = string | boolean | Array<{ label: string; value: string }>
export interface ConfigParams {
  key: string
  input: ParamInputs
  value: ConfigParamValue
}

export interface BaseFieldConfig {
  type: ConstructorFieldType
  options: Record<string, unknown>
  configParams?: Array<ConfigParams>
  className?: string
  readonly?: boolean
  i18nKeys?: string[] // <--- ось нове
}
export interface ExtraOptions {
  placeholder: boolean
  info: boolean
  description: boolean
  validationRules: boolean
  selectedRules: string[]
  rulesParams: Record<string, string>
}

export interface ParsedField {
  name: string
  className: ConstructorFieldType | 'raw'
  args: Record<string, string>
  readonly: boolean
  rawType: string
  isRaw: boolean
  extra?: ExtraOptions
  i18nPrefix?: string
}

export enum ParamInputs {
  Text = 'text',
  Boolean = 'boolean',
  Select = 'select',
}
