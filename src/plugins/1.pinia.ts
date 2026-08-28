import { createPinia } from 'pinia'
import type { App } from 'vue'
import { useUserPlugin } from '../stores/plugins/userPlugin'
import { resetStatePlugin } from '../stores/plugins/resetStatePlugin'

export const store = createPinia()
store.use(resetStatePlugin)
store.use(useUserPlugin)

export default function (app: App) {
  app.use(store)
}
