import { store } from '@/plugins/1.pinia'
import { RESET_SKIP_STORES } from '@/stores/plugins/useInitState'

export const resetAllStores = () => {
  ;(store as any)._s.forEach((s: { $id: string; $reset: () => void }) => {
    if ([...RESET_SKIP_STORES, 'authCore'].includes(s.$id))
      return
    s.$reset()
  })
}
