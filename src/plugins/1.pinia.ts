import { createPinia } from 'pinia'
import type { App } from 'vue'
import { useUserPlugin } from '../stores/plugins/userPlugin'
import { useResetState } from '../stores/plugins/useResetState'

export const store = createPinia()
store.use(useResetState)
store.use(useUserPlugin)

export default function (app: App) {
  app.use(store)
}
