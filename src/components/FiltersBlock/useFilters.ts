import { ref } from 'vue'
import { FieldInfo } from '../../@model/field'
import { FilterListItem } from '../../components/templates/BaseList/model'
import coreFilters from './filters'
import productFilters from '@filterConfig'

const allFilters = { ...coreFilters, ...productFilters }
export const useFilters = (initFilters: Array<FilterListItem>) => {
  const filters = ref<FieldInfo[]>([])
  const selectedFilters = ref<FieldInfo[]>([])

  filters.value = initFilters.map((filter: FilterListItem): FieldInfo => allFilters[filter.type])

  const onChangeSelectedFilters = (filters: FieldInfo[]) => {
    selectedFilters.value = filters
  }

  return {
    filters,
    selectedFilters,
    onChangeSelectedFilters,
  }
}
