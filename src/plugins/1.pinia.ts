import { createPinia } from 'pinia'
import type { App } from 'vue'
import { useUserPlugin } from '../stores/plugins/userPlugin'

export const store = createPinia()
store.use(useUserPlugin)

export default function (app: App) {
  app.use(store)
}
