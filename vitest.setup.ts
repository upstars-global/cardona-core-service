import { vi } from 'vitest'
import { config } from '@vue/test-utils'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { dayDateDirective, fullDateDirective, fullDateWithSecondsDirective } from './src/directives/date'
import { currency } from './src/directives/currency'
import { getI18n } from './src/plugins/i18n'
import './src/extensions/index'

const projectDirective = {
  'day-date': dayDateDirective,
  'full-date': fullDateDirective,
  'full-date-with-seconds': fullDateWithSecondsDirective,
  'currency': currency,
}

// vue-flatpickr-component
export const vuetify = createVuetify({
  components,
  directives: {
    ...directives,
    ...projectDirective,
  },
})

vi.mock('*.css', () => ({}))
vi.mock('*.scss', () => ({}))

vi.mock('./src/helpers/clipboard', () => ({
  copyToClipboard: vi.fn(),
}))

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

config.global.plugins = [vuetify, getI18n()]
