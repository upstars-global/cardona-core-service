import { vi } from 'vitest'
import { config } from '@vue/test-utils'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { dayDateDirective, fullDateDirective, fullDateWithSecondsDirective } from './src/directives/date'
import { currency } from './src/directives/currency'

const projectDirective = {
  'day-date': dayDateDirective,
  'full-date': fullDateDirective,
  'full-date-with-seconds': fullDateWithSecondsDirective,
  'currency': currency,
}

export const vuetify = createVuetify({
  components,
  directives: {
    ...directives,
    ...projectDirective,
  },
})

vi.mock('*.css', () => ({}))
vi.mock('*.scss', () => ({}))

config.global.plugins = [vuetify]
