import type { App } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { setupGuards } from './guards'
import { redirects, routes } from './additional-routes'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    ...routes,
    ...redirects,
  ],
})

setupGuards(router)

export { router }

export default function (app: App) {
  app.use(router)
}
