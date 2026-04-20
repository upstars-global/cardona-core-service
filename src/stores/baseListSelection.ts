import { defineStore } from 'pinia'

export const useBaseListSelection = defineStore('baseListSelection', {
  state: () => ({
    selectedIds: {} as Record<string, Set<string>>,
  }),
  getters: {
    getAllSelectedIds: ({ selectedIds }) => (entityName: string) => selectedIds[entityName],
    getAllSelectedIdsArr: ({ selectedIds }) => (entityName: string) => selectedIds[entityName] ? [...selectedIds[entityName]] : [],
  },
  actions: {
    syncPageSelection(entityName: string, pageIds: string[], selectedPageIds: string[]) {
      const newSelectedIds = new Set(this.selectedIds[entityName])

      for (const id of pageIds)
        newSelectedIds.delete(id)

      for (const id of selectedPageIds)
        newSelectedIds.add(id)

      this.selectedIds[entityName] = newSelectedIds
    },

    clearSelectedIds(entityName: string) {
      this.selectedIds[entityName] = new Set()
    },
  },
})
