import { vi } from 'vitest'
import { config } from '@vue/test-utils'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export const vuetify = createVuetify({
  components,
  directives,
})

vi.mock('*.css', () => ({}))
vi.mock('*.scss', () => ({}))

config.global.plugins = [vuetify]
