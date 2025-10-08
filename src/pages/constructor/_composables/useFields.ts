import type { ConfigParams, ParsedField } from '../types'
import { byClass } from '@/pages/constructor/fieldConfigs'

const EXCLUDED_KEYS = ['key', 'label', 'value', 'validationRules']
export const SYSTEM_KEYS = ['placeholder', 'info', 'description', 'validationRules', 'selectedRules', 'rulesParams']

const DEFAULT_EXTRA = {
  placeholder: false,
  info: false,
  description: false,
  validationRules: false,
  selectedRules: [],
  rulesParams: {},
}

// TODO generate locale field more general
export function applyConfigOptions(
  field: ParsedField,
  configOptions: Record<string, any>,
  configParams?: ConfigParams[],
) {
  field.extra = { ...DEFAULT_EXTRA }

  // 1. Ініціалізувати параметри з configParams
  for (const param of configParams || []) {
    const { key, value } = param

    field.extra[key] = configOptions[key] ?? value
  }

  // 2. Додатково ініціалізувати i18nKeys, якщо не існують
  const i18nKeys = byClass[field.className]?.i18nKeys || []
  for (const key of i18nKeys) {
    if (key === 'label')
      continue // не boolean
    if (!(key in field.extra))
      field.extra[key] = false
  }
}

export function syncConfigOptions(field: ParsedField, prefix: string) {
  if (!field.extra)
    return

  updateI18nExtras(field, prefix)
  updateValidationRules(field)
  applyExtraToArgs(field)
}

function capitalizeSuffix(key: string): string {
  return key === 'label' ? '' : capitalize(key)
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function updateI18nExtras(field: ParsedField, prefix: string) {
  const config = byClass[field.className]
  const keys = config?.i18nKeys || []
  const { extra, args, name } = field

  for (const key of keys) {
    const base = `page.${prefix}.${name}${capitalizeSuffix(key)}`

    if (key === 'label')
      args.label = `i18n.t('${base}')`
    else
      toggleArg(extra[key], args, key, `i18n.t('${base}')`)
  }
}

function updateValidationRules(field: ParsedField) {
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

function applyExtraToArgs(field: ParsedField) {
  const config = byClass[field.className]
  const i18nKeys = config?.i18nKeys || []
  const extra = field.extra!
  const args = field.args

  for (const [key, val] of Object.entries(extra)) {
    // Пропускаємо системні (validationRules, selectedRules, rulesParams)
    if (['validationRules', 'selectedRules', 'rulesParams'].includes(key))
      continue

    const setArg = (v: string) => (args[key] = v)
    const delArg = () => delete args[key]

    if (i18nKeys.includes(key)) {
      // Це i18n boolean поле
      if (val === true)
        setArg(`i18n.t('page.${field.i18nPrefix}.${field.name}${capitalize(key)}')`)
      else
        delArg()
      continue
    }

    // Обробка інших типів (звичайні поля)
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

function toggleArg(condition: boolean, args: Record<string, string>, key: string, value: string) {
  if (condition)
    args[key] = value
  else delete args[key]
}

export function convertToRaw(field: ParsedField) {
  ;(field as any).__savedExtra = field.extra
  delete (field as any).extra

  field.className = 'raw'
  field.args = {
    raw: `this.${field.name} = data?.${field.name}`,
  }
  field.isRaw = true
}

export function convertToBase(field: ParsedField, prefix: string) {
  field.className = 'TextBaseField'
  field.args = {
    key: `'${field.name}'`,
    value: `data?.${field.name}`,
  }
  field.isRaw = false

  field.extra = (field as any).__savedExtra ?? { ...DEFAULT_EXTRA }

  syncConfigOptions(field, prefix)
}
export function updateExtras(field: ParsedField, prefix: string) {
  updateI18nExtras(field, prefix)
  updateValidationRules(field)
}
