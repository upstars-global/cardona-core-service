import { ref } from 'vue'
import { Filter } from '../../@model/filter'
import { FilterListItem } from '../templates/BaseList/model'
import coreFilters from './filters'
import productFilters from '@filterConfig'

const allFilters = { ...coreFilters, ...productFilters }
export const useFilters = (initFilters: Array<FilterListItem>) => {
  const filters = ref<Filter[]>([])
  const selectedFilters = ref<Filter[]>([])

  filters.value = initFilters.map((filter) => allFilters[filter.type])

  const onChangeSelectedFilters = (filters: Filter[]) => {
    selectedFilters.value = filters
  }

  return {
    filters,
    selectedFilters,
    onChangeSelectedFilters,
  }
}
