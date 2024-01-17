import { ref } from 'vue'
import type { BaseField } from '../../@model/templates/baseField'
import type { FilterListItem } from '../../@model/templates/baseList'
import coreFilters from './filters'
import productFilters from '@filterConfig'

const allFilters = { ...coreFilters, ...productFilters }
export const useFilters = (initFilters: Array<FilterListItem>) => {
  const filters = ref<BaseField[]>([])
  const selectedFilters = ref<BaseField[]>([])

  filters.value = initFilters.map(filter => allFilters[filter.type])

  const onChangeSelectedFilters = (filters: BaseField[]) => {
    selectedFilters.value = filters
  }

  return {
    filters,
    selectedFilters,
    onChangeSelectedFilters,
  }
}
