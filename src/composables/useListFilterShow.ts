import { useStorage } from '@vueuse/core'
import { computed } from 'vue'

export function useListFilterShow(key: string) {
  const filterStates = useStorage('list-filters-state', {})

  const deprecatedKeys = Object.keys(localStorage)
    .filter(item => item.includes('show-filter-list-'))

  const entityKeys = deprecatedKeys
    .map(item => item.replace('show-filter-list-', ''))

  entityKeys.forEach(entityKey => {
    filterStates.value[entityKey] = localStorage.getItem(entityKey) === 'true'
  })

  deprecatedKeys.forEach(key => {
    localStorage.removeItem(key)
  })

  const isFiltersShown = computed(() => key in filterStates.value ? filterStates.value[key] : false)
  const setFilterShown = value => filterStates.value[key] = value

  return {
    isFiltersShown,
    setFilterShown,
  }
}
