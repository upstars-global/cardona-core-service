import type { ParsedField } from '../types'

export function updateExtras(field: ParsedField, prefix: string) {
  const name = field.name
  if (!field.extra)
    return

  if (field.extra.placeholder)
    field.args.placeholder = `i18n.t('page.${prefix}.${name}Placeholder')`
  else delete field.args.placeholder

  if (field.extra.info)
    field.args.info = `i18n.t('page.${prefix}.${name}Info')`
  else delete field.args.info

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

export function convertToRaw(field: ParsedField) {
  field.className = 'raw'
  field.args = { raw: `this.${field.name} = data?.${field.name}` }
  field.isRaw = true
  delete field.extra
}

export function convertToBase(field: ParsedField, prefix: string) {
  field.className = 'TextBaseField'
  field.args = {
    key: `'${field.name}'`,
    value: `data?.${field.name}`,
    label: `i18n.t('page.${prefix}.${field.name}')`,
  }
  field.isRaw = false
  field.extra = {
    placeholder: false,
    info: false,
    validationRules: false,
    selectedRules: [],
    rulesParams: {},
  }
  updateExtras(field, prefix)
}
