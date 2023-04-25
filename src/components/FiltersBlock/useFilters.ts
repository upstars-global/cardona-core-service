import { ref } from 'vue'
import { FieldInfo } from '../../@model/field'
import { FilterType } from '../../@model/filter'
import { FilterListItem } from '../../components/templates/BaseList/model'
import allFilters from './filters'
import productFilters from '@filterConfig'

export const useFilters = (initFilters: Array<FilterListItem | FilterType>) => {
  const filters = ref<FieldInfo[]>([])
  const selectedFilters = ref<FieldInfo[]>([])

  filters.value = initFilters.map((filter: FilterListItem | FilterType): FieldInfo => {
    console.log(filter)
    return typeof filter !== 'string'
      ? productFilters[filter.type] || allFilters[filter.type]
      : productFilters[filter] || allFilters[filter] // TODO: Поправить после того как все списки будут сделаны на базовом листе
  })

  const onChangeSelectedFilters = (filters: FieldInfo[]) => {
    selectedFilters.value = filters
  }

  return {
    filters,
    selectedFilters,
    onChangeSelectedFilters,
  }
}
