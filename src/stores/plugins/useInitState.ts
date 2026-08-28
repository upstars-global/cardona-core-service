import type { PiniaPluginContext } from 'pinia'
import { cloneDeep } from 'lodash'

declare module 'pinia' {
  export interface PiniaCustomProperties {
    $reset: () => void
  }
}
export const RESET_SKIP_STORES = ['config', 'layout-config']

export function useInitState({ store }: PiniaPluginContext) {
  if (RESET_SKIP_STORES.includes(store.$id))
    return

  const initialState = cloneDeep(store.$state)

  store.$reset = () => store.$patch(s => Object.assign(s, cloneDeep(initialState)))
}
