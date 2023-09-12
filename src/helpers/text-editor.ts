import { FieldTranslationsLocale, LocaleVariable } from '../@model/translations'
import { difference } from 'lodash'

export const getVariablesFromLocale = (localeText: string): string[] => {
  const regex = /\{([^}]+)\}/g
  const matches = localeText.match(regex)
  return (matches?.map((match) => match?.slice(1, -1)).filter(Boolean) || []) as string[]
}
export const getExcessKeyVariable = (
  allVariablesKeys: Array<string>,
  actualVariables: LocaleVariable
): string => {
  return difference(allVariablesKeys, Object.keys(actualVariables.value)).at(0) || ''
}

export const getVariablesFromAllLocaleText = (metaTitle: FieldTranslationsLocale) =>
  Object.entries(metaTitle || {})
    .map(([_, value]: any) => value.value)
    ?.join('') || ''
