export type ConfigParamValue = string | boolean | Array<{ label: string; value: string }>
export interface ConfigParams {
  key: string
  input: ParamInputs
  value: ConfigParamValue
}

export interface BaseFieldConfig {
  type: 'text' | 'textarea' | 'select'
  options: Record<string, any>
  configParams?: Array<ConfigParams>
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
  className: string
  args: Record<string, string>
  readonly: boolean
  rawType: string
  isRaw: boolean
  extra?: ExtraOptions
}

export enum ParamInputs {
  Text = 'text',
  Boolean = 'boolean',
  Select = 'select',
}
