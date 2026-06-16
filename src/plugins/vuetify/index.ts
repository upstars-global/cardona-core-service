// LAYOUT THEME REGISTRATION PATTERN
// Each layout that needs isolated Vuetify theming registers its themes here.
// The layout's index.vue then uses VThemeProvider to activate the correct theme.
//
// To add a new layout's theme:
//   1. Create src/layouts/<name>/theme.ts (export `light` and `dark` as ThemeDefinition)
//   2. Import and register below as '<name>-light' / '<name>-dark'
//   3. In src/layouts/<name>/index.vue, use VThemeProvider with the theme name
//
// Theme naming convention: '<layout>-light' / '<layout>-dark'

import { resolveVuetifyTheme } from '../../@core/utils/vuetify'
import { deepMerge } from '@antfu/utils'
import type { App } from 'vue'
import { useI18n } from 'vue-i18n'
import { createVuetify } from 'vuetify'
import { VBtn } from 'vuetify/components/VBtn'
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'
import { getI18n } from '../../plugins/i18n'
import defaults from './defaults'
import { icons } from './icons'
import { staticPrimaryColor, themes } from './theme'

// ── Layout themes ──────────────────────────────────────────────────────────────
import { light as islandLight, dark as islandDark } from '../../layouts/island/theme'

// Styles
import { cookieRef } from '@/@layouts/stores/config'
import '@core/scss/template/libs/vuetify/index.scss'
import 'vuetify/styles'

export default function (app: App) {
  // Merge global themes with per-user cookie primary color overrides
  const cookieThemeValues = {
    defaultTheme: resolveVuetifyTheme(),
    themes: {
      light: {
        colors: {
          primary: cookieRef('lightThemePrimaryColor', staticPrimaryColor).value,
        },
      },
      dark: {
        colors: {
          primary: cookieRef('darkThemePrimaryColor', staticPrimaryColor).value,
        },
      },
    },
  }

  const baseThemes = deepMerge({ themes }, cookieThemeValues)

  const vuetify = createVuetify({
    aliases: {
      IconBtn: VBtn,
    },
    defaults,
    icons,
    theme: {
      ...baseThemes,
      themes: {
        ...baseThemes.themes,
        // ── Layout-specific themes ─────────────────────────────────────────
        // Activated via VThemeProvider in each layout's index.vue.
        // Provides full CSS variable isolation for Vuetify components
        // within the layout tree.
        'island-light': islandLight,
        'island-dark': islandDark,
      },
    },
    locale: {
      adapter: createVueI18nAdapter({ i18n: getI18n(), useI18n }),
    },
  })

  app.use(vuetify)
}
