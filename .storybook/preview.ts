import type { Preview } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3-vite'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Vuetify base styles (must come before project overrides)
import 'vuetify/styles'
// Iconify icon definitions — all .tabler-* and .custom-* mask-image classes.
// This is the bundled output of `npm run build:icons` and must be loaded
// before any component renders a <v-icon>, otherwise icons appear as empty boxes.
import '../src/plugins/iconify/icons.css'
// Vuetify component overrides (@core)
import '../src/@core/scss/template/libs/vuetify/index.scss'
// Project-level component overrides
import '../src/assets/styles/styles.scss'

import { themes } from '../src/plugins/vuetify/theme'
import defaults from '../src/plugins/vuetify/defaults'
import { icons } from '../src/plugins/vuetify/icons'
import { fullDateDirective } from '../src/directives/date'
import '../src/extensions/array'
import '../src/extensions/string'
import enMessages from '../src/plugins/i18n/locales/en.json'

const vuetify = createVuetify({
  components,
  directives,
  theme: { themes },
  defaults,
  icons,
})

const pinia = createPinia()
setActivePinia(pinia)

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', name: 'StorybookHome', component: { template: '<div/>' } }],
})

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en: enMessages },
})

export const mockModal = {
  showModal: () => {},
  hideModal: () => {},
  registerModal: () => {},
  unregisterModal: () => {},
  modals: {},
}

setup((app) => {
  app.use(vuetify)
  app.use(pinia)
  app.use(router)
  app.use(i18n)
  app.directive('full-date', fullDateDirective)
  app.provide('modal', mockModal)
})

const preview: Preview = {
  decorators: [
    () => ({
      template: '<v-app style="background: transparent; min-height: unset;"><story /></v-app>',
    }),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
