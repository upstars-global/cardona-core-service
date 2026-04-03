import { defineStore } from 'pinia'

export const useBaseListSelection = defineStore('baseListSelection', {
  state: () => ({
    selectedIds: new Set<string>(),
  }),
  getters: {
    getAllSelectedIds: ({ selectedIds }) => selectedIds,
  },
  actions: {
    syncPageSelection(pageIds: string[], selectedPageIds: string[]) {
      const newSelectedIds = new Set(this.selectedIds)

      for (const id of pageIds)
        newSelectedIds.delete(id)

      for (const id of selectedPageIds)
        newSelectedIds.add(id)

      this.selectedIds = newSelectedIds
    },

    clearSelectedIds() {
      this.selectedIds = new Set()
    },
  },
})
