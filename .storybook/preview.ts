import type { Preview } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3-vite'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import { fullDateDirective } from '../src/directives/date'

const vuetify = createVuetify({ components, directives })

setup((app) => {
  app.use(vuetify)
  app.directive('full-date', fullDateDirective)
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
