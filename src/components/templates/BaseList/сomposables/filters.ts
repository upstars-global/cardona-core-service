import {
  BaseField,
  DateBaseField,
  MultiSelectBaseField,
  NumberRangeBaseField,
  SelectBaseField,
} from '../../../../@model/templates/baseField'
import type { FilterListItem, IBaseListConfig } from '../../../../@model/templates/baseList'

export const transformFilters = (appliedFilters: BaseField[], config: IBaseListConfig) => {
  return appliedFilters.reduce((acc, filter) => {
    const { key, trackBy = 'name' }: FilterListItem = config?.filterList?.find(
      ({ type }: FilterListItem) => type === filter.key,
    ) as FilterListItem

    if (filter instanceof SelectBaseField) {
      acc[key] = filter.transformField({ trackBy, isStringDefaultValue: false })
    }
    else if (filter instanceof MultiSelectBaseField) {
      acc[key] = filter.transformField({ trackBy })
    }
    else if (filter instanceof DateBaseField || filter instanceof NumberRangeBaseField) {
      const transformedFilterValue = filter.transformField(key)

      if (!transformedFilterValue)
        return acc
      else if (typeof transformedFilterValue === 'string')
        acc[key] = transformedFilterValue
      else acc = { ...acc, ...transformedFilterValue }
    }
    else if (filter instanceof BaseField) {
      acc[key] = filter.transformField()
    }

    return acc
  }, {})
}
