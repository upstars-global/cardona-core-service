import { expect } from 'vitest'
import coreFilters from '../../src/components/FiltersBlock/filters'
import type { BaseListConfig, FilterListItem, UseListType } from '../../src/@model/templates/baseList'
import { DateBaseField, NumberRangeBaseField } from '../../src/@model/templates/baseField'
import productFilters from '@filterConfig'

const allFilters = { ...coreFilters, ...productFilters } as Record<string, unknown>

interface FiltersCheckOptions {
  useList: () => UseListType<object, object, object>
  config: BaseListConfig

  /** Model keys that are intentionally not in config.filterList (e.g. filled by a custom slot or inline filter). */
  ignoreModelKeys?: string[]
}

/** Payload keys the real `transformFilters` produces for one filterList item. */
const getPayloadKeys = ({ type, key }: FilterListItem): string[] => {
  const field = allFilters[type]

  if (field instanceof DateBaseField)
    return field.keys?.length ? field.keys : [`${key}From`, `${key}To`]
  if (field instanceof NumberRangeBaseField)
    return [`${key}From`, `${key}To`]

  return [key]
}

/** Keys the ListFilterModel constructor really keeps — it drops everything it doesn't know. */
const getAcceptedKeys = (ListFilterModel: new (...args: never[]) => object, probeKeys: string[]) => {
  const probe = Object.fromEntries(probeKeys.map(key => [key, '__probe__']))
  const model = new (ListFilterModel as new (data: object) => object)(probe) as Record<string, unknown>

  return probeKeys.filter(key => model[key] === '__probe__')
}

/**
 * Cross-checks `config.filterList` / `staticFilters` against `useList.ListFilterModel`:
 * - config → model: every payload key a configured filter produces must survive the model constructor,
 *   otherwise the filter is shown in the UI but silently never reaches the API;
 * - model → config: every model key must be reachable from the config (filter, search, static filter),
 *   otherwise the model declares a filter nobody can set.
 * Also fails on a filter `type` that has no registered field (the list would crash on mount).
 */
export const expectFiltersMatchModel = ({ useList, config, ignoreModelKeys = [] }: FiltersCheckOptions) => {
  const { ListFilterModel } = useList()
  const filterList = config.filterList ?? []
  const staticKeys = Object.keys(config.staticFilters ?? {})

  expect(ListFilterModel, 'useList must return ListFilterModel').toBeTypeOf('function')

  const unknownTypes = filterList.filter(({ type }) => !allFilters[type]).map(({ type }) => type)

  expect(unknownTypes, 'filterList types without a registered field').toEqual([])

  const configKeys = [...new Set([...filterList.flatMap(getPayloadKeys), ...staticKeys])]
  const accepted = getAcceptedKeys(ListFilterModel!, configKeys)
  const missingInModel = configKeys.filter(key => !accepted.includes(key))

  expect(missingInModel, 'in config, but ListFilterModel drops them').toEqual([])

  const modelKeys = Object.keys(new ListFilterModel!({}))
  const reachable = [...configKeys, ...(config.withSearch ? ['search'] : []), ...ignoreModelKeys]
  const missingInConfig = modelKeys.filter(key => !reachable.includes(key))

  expect(missingInConfig, 'in ListFilterModel, but not reachable from config').toEqual([])

  return { configKeys, modelKeys }
}
