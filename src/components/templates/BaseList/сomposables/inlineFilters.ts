import { ref } from 'vue'
import type { BaseField } from '../../../../@model/templates/baseField'
import type { FilterListItem } from '../../../../@model/templates/baseList'
import { useFilters } from '../../../FiltersBlock/useFilters'
import { transformFormData } from '../../../../helpers'

export const useInlineFilters = (
  inlineFilterConfig: FilterListItem[] | undefined = [],
  onFilterChange: () => void,
) => {
  const { filters: filterFields } = useFilters(inlineFilterConfig)

  inlineFilterConfig.forEach((config, index) => {
    if (config.defaultValue !== undefined) {
      filterFields.value[index].value = config.defaultValue
    }
  })

  const buildPayload = (): Record<string, unknown> => {
    if (!inlineFilterConfig?.length)
      return {}

    const data: Record<string, BaseField> = {}

    filterFields.value.forEach(field => {
      data[field.key] = field
    })

    return transformFormData(data)
  }

  const inlineFilters = ref<Record<string, unknown>>(buildPayload())

  const changeInlineFilters = (value: Record<string, unknown>) => {
    inlineFilters.value = value
    onFilterChange()
  }

  const onFieldUpdate = (fields: BaseField[]) => {
    const data = fields.reduce<Record<string, BaseField>>((acc, field) => {
      acc[field.key] = field

      return acc
    }, {})

    changeInlineFilters(transformFormData(data) as Record<string, unknown>)
  }

  return { inlineFilters, changeInlineFilters, filterFields, onFieldUpdate }
}
