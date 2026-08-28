import { createPinia } from 'pinia'
import type { App } from 'vue'
import { useUserPlugin } from '../stores/plugins/userPlugin'
import { useInitState } from '../stores/plugins/useInitState'

export const store = createPinia()
store.use(useInitState)
store.use(useUserPlugin)

export default function (app: App) {
  app.use(store)
}
