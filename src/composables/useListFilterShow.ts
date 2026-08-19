import { useStorage } from '@vueuse/core'
import { computed } from 'vue'

export function useListFilterShow(key: string) {
  const filterStates = useStorage<Record<string, boolean>>('list-filters-state', {})

  Object.keys(localStorage)
    .filter(item => item.includes('show-filter-list-'))
    .forEach(deprecatedKey => {
      const entityKey = deprecatedKey.replace('show-filter-list-', '')

      filterStates.value[entityKey] = localStorage.getItem(deprecatedKey) === 'true'

      localStorage.removeItem(deprecatedKey)
    })

  const isFiltersShown = computed(() => filterStates.value[key] ?? false)
  const setFilterShown = (value: boolean) => filterStates.value[key] = value

  return {
    isFiltersShown,
    setFilterShown,
  }
}
