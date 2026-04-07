import { ref } from 'vue'
import type { BaseField } from '../../../../@model/templates/baseField'
import type { FilterListItem } from '../../../../@model/templates/baseList'
import { useFilters } from '../../../FiltersBlock/useFilters'
import { transformFormData } from '../../../../helpers'

export const useQuickFilters = (
  quickFilterConfig: FilterListItem[] | undefined,
  onFilterChange: () => void,
) => {
  const { filters: filterFields } = useFilters(quickFilterConfig ?? [])

  const buildPayload = (): Record<string, unknown> => {
    if (!quickFilterConfig?.length)
      return {}

    const data: Record<string, BaseField> = {}

    filterFields.value.forEach(field => {
      data[field.key] = field
    })

    return transformFormData(data)
  }

  const quickFilters = ref<Record<string, unknown>>(buildPayload())

  const changeQuickFilters = (value: Record<string, unknown>) => {
    quickFilters.value = value
    onFilterChange()
  }

  const onFieldUpdate = (fields: BaseField[]) => {
    const data = fields.reduce<Record<string, BaseField>>((acc, field) => {
      acc[field.key] = field

      return acc
    }, {})

    changeQuickFilters(transformFormData(data) as Record<string, unknown>)
  }

  return { quickFilters, changeQuickFilters, filterFields, onFieldUpdate }
}
