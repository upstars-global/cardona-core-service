import type { BaseFieldConfig, ConfigParams, ExtraOptions, ParsedField } from '../types'
import { byClass } from '../fieldConfigs/index'
import { ConstructorFieldType } from '../constants'

// Keys that should not be included in field.args
export const SYSTEM_KEYS = ['placeholder', 'info', 'description', 'validationRules', 'selectedRules', 'rulesParams']
const NON_ARG_KEYS = new Set<keyof ExtraOptions>(['validationRules', 'selectedRules', 'rulesParams'])
const KEY_RAW = 'raw'

const DEFAULT_EXTRA: ExtraOptions = {
  placeholder: false,
  info: false,
  description: false,
  validationRules: false,
  selectedRules: [],
  rulesParams: {},
}

// Initializes field.extra using configParams and i18nKeys
export function applyConfigOptions(
  field: ParsedField,
  configOptions: Record<string, any>,
  configParams?: ConfigParams[],
): void {
  field.extra = { ...DEFAULT_EXTRA }

  for (const param of configParams || [])
    field.extra[param.key as keyof ExtraOptions] = configOptions[param.key] ?? param.value
  if (field.className === KEY_RAW)
    return
  const i18nKeys = byClass[field.className]?.i18nKeys || []
  for (const key of i18nKeys) {
    if (key !== 'label' && !(key in field.extra))
      field.extra[key as keyof ExtraOptions] = false
  }
}

// Full sync of field.args based on field.extra and config
export function syncConfigOptions(field: ParsedField, prefix: string): void {
  field.i18nPrefix = prefix
  if (!field.extra)
    return

  updateI18nExtras(field)
  updateValidationRules(field)
  applyExtraToArgs(field)
}

// Updates only i18n and validationRules in field.args
export function updateExtras(field: ParsedField, prefix: string): void {
  field.i18nPrefix = prefix
  updateI18nExtras(field)
  updateValidationRules(field)
}

// Converts field to raw mode
export function convertToRaw(field: ParsedField): void {
  ;(field as any).__savedExtra = field.extra
  delete (field as any).extra

  field.className = KEY_RAW
  field.args = {
    raw: `this.${field.name} = data?.${field.name}`,
  }
  field.isRaw = true
}

// Converts field back to base mode (e.g. TextBaseField)
export function convertToBase(field: ParsedField, prefix: string): void {
  field.className = ConstructorFieldType.TextBaseField
  field.args = {
    key: `'${field.name}'`,
    value: `data?.${field.name}`,
  }
  field.isRaw = false

  field.extra = (field as any).__savedExtra ?? { ...DEFAULT_EXTRA }
  syncConfigOptions(field, prefix)
}

// Generates i18n-related args based on i18nKeys and field.extra
function updateI18nExtras(field: ParsedField): void {
  if (field.className === KEY_RAW)
    return
  const config: BaseFieldConfig = byClass[field.className]
  const keys: string[] = config?.i18nKeys || []
  const { extra, args, name, i18nPrefix } = field

  for (const key of keys) {
    const base = `page.${i18nPrefix}.${name}${capitalizeSuffix(key)}`
    if (key === 'label')
      args.label = `i18n.t('${base}')`
    else
      toggleArg(extra?.[key as keyof ExtraOptions] === true, args, key, `i18n.t('${base}')`)
  }
}

// Generates validationRules arg based on selectedRules and params
function updateValidationRules(field: ParsedField): void {
  const { extra, args } = field

  if (extra?.validationRules && extra.selectedRules.length > 0) {
    const rules = extra.selectedRules.map(rule => {
      const param = extra.rulesParams[rule]

      return param ? `${rule}: ${param}` : `${rule}: true`
    }).join(', ')

    args.validationRules = `{ ${rules} }`
  }
  else {
    delete args.validationRules
  }
}

// Applies all extra values (non-system, non-i18n) into field.args
function applyExtraToArgs(field: ParsedField): void {
  if (field.className === KEY_RAW)
    return
  const config = byClass[field.className]
  const i18nKeys = config?.i18nKeys || []
  const { extra, args, name, i18nPrefix } = field

  for (const [key, val] of Object.entries(extra || {})) {
    if (NON_ARG_KEYS.has(key as keyof ExtraOptions))
      continue

    const setArg = (v: string) => { args[key] = v }
    const delArg = () => { delete args[key] }

    if (i18nKeys.includes(key)) {
      val === true
        ? setArg(`i18n.t('page.${i18nPrefix}.${name}${capitalize(key)}')`)
        : delArg()
      continue
    }

    switch (typeof val) {
      case 'boolean':
        val ? setArg('true') : delArg()
        break
      case 'string':
        val.trim() ? setArg(`'${val}'`) : delArg()
        break
      case 'number':
        !Number.isNaN(val) ? setArg(String(val)) : delArg()
        break
      default:
        if (Array.isArray(val))
          val.length ? setArg(JSON.stringify(val)) : delArg()
    }
  }
}

// Adds or removes a key from args depending on a condition
function toggleArg(condition: boolean, args: Record<string, string>, key: string, value: string): void {
  if (condition)
    args[key] = value
  else
    delete args[key]
}

// Capitalizes a suffix like "Placeholder" or "Description"
function capitalizeSuffix(key: string): string {
  return key === 'label' ? '' : capitalize(key)
}

// Capitalizes a string (e.g. "info" → "Info")
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
