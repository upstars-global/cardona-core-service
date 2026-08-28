import type { PiniaPluginContext } from 'pinia'
import { cloneDeep } from 'lodash'

declare module 'pinia' {
  export interface PiniaCustomProperties {
    $reset: () => void
  }
}
const SKIP_STORES = ['config', 'layout-config']

export function useResetState({ store }: PiniaPluginContext) {
  if (SKIP_STORES.includes(store.$id))
    return

  const initialState = cloneDeep(store.$state)

  store.$reset = () => store.$patch(s => Object.assign(s, cloneDeep(initialState)))
}
