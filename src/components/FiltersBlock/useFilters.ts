import { ref } from 'vue'
import { FieldInfo } from '@model/field'
import { FilterType } from '@model/filter'
import { FilterListItem } from '@/components/templates/BaseList/model'
import allFilters from './filters'

export const useFilters = (initFilters: Array<FilterListItem | FilterType>) => {
  const filters = ref<FieldInfo[]>([])
  const selectedFilters = ref<FieldInfo[]>([])

  filters.value = initFilters.map(
    (filter: FilterListItem | FilterType): FieldInfo =>
      typeof filter !== 'string' ? allFilters[filter.type] : allFilters[filter] // TODO: Поправить после того как все списки будут сделаны на базовом листе
  )

  const onChangeSelectedFilters = (filters: FieldInfo[]) => {
    selectedFilters.value = filters
  }

  return {
    filters,
    selectedFilters,
    onChangeSelectedFilters,
  }
}
