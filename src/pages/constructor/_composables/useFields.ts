import type { ParsedField } from '../types'

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
export function applyConfigOptions(field: ParsedField, configOptions: Record<string, any>, configParams?: OptionField[]) {
  field.extra = { ...DEFAULT_EXTRA }

  for (const param of configParams || []) {
    const { key, value } = param

    field.extra[key] = configOptions[key] ?? value
  }
}

export function syncConfigOptions(field: ParsedField, prefix: string) {
  if (!field.extra)
    return

  updateI18nExtras(field, prefix)
  updateValidationRules(field)
  applyExtraToArgs(field)
}

function updateI18nExtras(field: ParsedField, prefix: string) {
  const name = field.name
  const extra = field.extra!
  const args = field.args

  args.label = `i18n.t('page.${prefix}.${name}')`

  toggleArg(extra.placeholder, args, 'placeholder', `i18n.t('page.${prefix}.${name}Placeholder')`)
  toggleArg(extra.info, args, 'info', `i18n.t('page.${prefix}.${name}Info')`)
  toggleArg(extra.description, args, 'description', `i18n.t('page.${prefix}.${name}Description')`)
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
  for (const [key, val] of Object.entries(field.extra!)) {
    if (SYSTEM_KEYS.includes(key))
      continue

    const setArg = (v: string) => (field.args[key] = v)
    const delArg = () => delete field.args[key]

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
