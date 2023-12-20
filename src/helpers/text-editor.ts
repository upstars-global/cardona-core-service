import { difference } from 'lodash'
import type { FieldTranslationsLocale, LocaleVariable } from '../@model/translations'

export const getVariablesFromLocale = (localeText: string): string[] => {
  const regex = /\{([^}]+)\}/g
  const matches = localeText.match(regex)

  return (matches?.map(match => match?.slice(1, -1)).filter(Boolean) || []) as string[]
}
export const getExcessKeyVariable = (
  allVariablesKeys: Array<string>,
  actualVariables: LocaleVariable,
): string => {
  return difference(allVariablesKeys, Object.keys(actualVariables)).at(0) || ''
}

export const getVariablesFromAllLocaleText = (metaTitle: FieldTranslationsLocale) =>
  Object.entries(metaTitle || {})
    ?.map(([_, value]: any) => value.value)
    ?.join('') || ''
export const filterString = (inputString: string, localeVariables: string): string => {
  const removedVariable = inputString?.replaceAll(
    `<span class="variable-box">{${localeVariables}}</span>`,
    '',
  )

  const existOnlySpaces = !removedVariable?.replaceAll('&nbsp;', '').trim().length
  if (existOnlySpaces)
    return ''

  return removedVariable
}
