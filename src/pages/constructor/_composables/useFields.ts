import type { ParsedField } from '../types'

const EXCLUDED_KEYS = ['key', 'label', 'value', 'validationRules']

export function applyConfigOptions(field: ParsedField, configOptions: Record<string, any>) {
  // базові, доступні через чекбокси у UI
  field.extra = {
    placeholder: false,
    info: false,
    validationRules: false,
    selectedRules: [],
    rulesParams: {},
  }

  // копіюємо ВСЕ з options (окрім системних) у extra,
  // щоб такі як clearfix автоматично з’являлись
  Object.entries(configOptions || {}).forEach(([key, val]) => {
    if (EXCLUDED_KEYS.includes(key))
      return
    field.extra![key] = val
  })
}

export function updateExtras(field: ParsedField, prefix: string) {
  const name = field.name
  if (!field.extra)
    return

  field.args.label = `i18n.t('page.${prefix}.${name}')`

  if (field.extra.placeholder)
    field.args.placeholder = `i18n.t('page.${prefix}.${name}Placeholder')`
  else
    delete field.args.placeholder

  if (field.extra.info)
    field.args.info = `i18n.t('page.${prefix}.${name}Info')`
  else
    delete field.args.info

  if (field.extra.validationRules && field.extra.selectedRules.length > 0) {
    const rules = field.extra.selectedRules.map(rule => {
      const param = field.extra.rulesParams[rule]

      return param ? `${rule}: ${param}` : `${rule}: true`
    }).join(', ')

    field.args.validationRules = `{ ${rules} }`
  }
  else {
    delete field.args.validationRules
  }
}

export function syncConfigOptions(field: ParsedField, prefix: string) {
  if (!field.extra)
    return

  // Спочатку i18n/validation (як і раніше)
  updateExtras(field, prefix)

  // Потім — усі інші параметри з extra → у args
  Object.entries(field.extra).forEach(([key, val]) => {
    if (['placeholder', 'info', 'validationRules', 'selectedRules', 'rulesParams'].includes(key))
      return

    if (typeof val === 'boolean') {
      if (val)
        field.args[key] = 'true'
      else delete field.args[key]
    }
    else if (typeof val === 'string') {
      if (val.trim())
        field.args[key] = `'${val}'`
      else delete field.args[key]
    }
    else if (Array.isArray(val)) {
      if (val.length)
        field.args[key] = JSON.stringify(val)
      else delete field.args[key]
    }
    else if (typeof val === 'number') {
      if (!Number.isNaN(val))
        field.args[key] = String(val)
      else delete field.args[key]
    }
  })
}

export function convertToRaw(field: ParsedField) {
  ;(field as any).__savedExtra = field.extra
  delete (field as any).extra

  field.className = 'raw'
  field.args = { raw: `this.${field.name} = data?.${field.name}` }
  field.isRaw = true
}

export function convertToBase(field: ParsedField, prefix: string) {
  field.className = 'TextBaseField'
  field.args = {
    key: `'${field.name}'`,
    value: `data?.${field.name}`,
  }
  field.isRaw = false

  const saved = (field as any).__savedExtra

  field.extra = saved ?? {
    placeholder: false,
    info: false,
    validationRules: false,
    selectedRules: [],
    rulesParams: {},
  }

  updateExtras(field, prefix)
  syncConfigOptions(field, prefix)
}
