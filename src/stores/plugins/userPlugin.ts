import { useUserStore } from '../user'

export function useUserPlugin({ store }) {
  // store.$selectedProject = useUserStore()?.getSelectedProject || {}
  // store.$selectedProjectAlias = useUserStore()?.getSelectedProject?.alias || ''
  Object.defineProperty(store, '$selectedProjectAlias', {
    get() {
      return useUserStore()?.getSelectedProject?.alias || ''
    },
  })
}
