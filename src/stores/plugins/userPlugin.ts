import { useUserStore } from '../user'

export function useUserPlugin({ store }) {
  Object.defineProperty(store, '$selectedProjectAlias', {
    get() {
      return useUserStore()?.getSelectedProject?.alias || ''
    },
  })
}
