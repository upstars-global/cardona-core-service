import type { ThemeDefinition } from 'vuetify'

const COLORS = {
  light: {
    'grey-50': '#FAFAFA', // Misc/grey-light
    'grey-100': '#F8F7FA', // Misc/body-bg
    'grey-200': '#F3F2F5', // Misc/chat-bg
    'grey-300': '#F1F0F2', // Misc/track-bg
    'grey-400': '#EEEDF0', // Misc/avatar-bg
    'grey-500': '#DBDADE', // midpoint interpolated
    'grey-600': '#B0AEB8', // interpolated
    'grey-700': '#7D7B89', // interpolated
    'grey-800': '#4A4859', // interpolated (tooltip-background)
    'grey-900': '#2F2B3D', // Theme/text-primary base hex
  },
  dark: {
    'grey-50': '#353A52', // Misc/grey-light
    'grey-100': '#2F3349', // Misc/table-header
    'grey-200': '#373B50', // Misc/avatar-bg
    'grey-300': '#3A3F57', // Misc/track-bg
    'grey-400': '#444564', // interpolated (tooltip-background)
    'grey-500': '#565976', // interpolated
    'grey-600': '#696D8A', // interpolated
    'grey-700': '#9295AB', // interpolated
    'grey-800': '#B8BACC', // interpolated
    'grey-900': '#E1DEF5', // Theme/text-primary base hex (dark)
  },
} as const

export const staticPrimaryColor = '#7367F0'

export const themes: Record<string, ThemeDefinition> = {
  light: {
    dark: false,

    colors: {
      // Vuetify semantic palette — Color Palette tokens
      'primary': '#7367F0', // primary-main
      'secondary': '#808390', // secondary-main
      'success': '#28C76F', // success-main
      'info': '#00BAD1', // info-main
      'warning': '#FF9F43', // warning-main
      'error': '#FF4C51', // error-main

      // on-* colors
      // on-primary: @core reads ×8 ($tooltip-text-color, $snackbar-color, nav active text)
      'on-primary': '#FFFFFF',

      // on-surface: most-read theme var in @core (×36) — from Theme/text-primary base
      'on-surface': '#2F2B3D',

      // on-background: @core reads ×13 — h1-h6, body overrides in _overrides.scss
      'on-background': COLORS.light['grey-900'],

      // Surfaces — Misc tokens
      // background: @core reads ×11 (nav fade gradient, fullcalendar, shepherd, timeline)
      'background': '#F8F7FA', // Misc/body-bg
      // surface: @core reads ×17 (layout, cards, apex-chart, fullcalendar, badge border, nav bg)
      // REQUIRED — initCore.ts copies this to skin-default-surface at init
      'surface': '#FFFFFF', // Misc/paper

      // Skin system — initCore.ts reads at skin switch (lines 56–57)
      'skin-bordered-background': '#FFFFFF', // = surface → flat appearance
      'skin-bordered-surface': '#FFFFFF', // = surface

      // Grey scale — grey-50 and grey-300 read by @core SCSS
      // grey-50: apex-chart tooltip bg ×4
      // grey-300: v-switch track border + thumb bg ×2
      'grey-50': COLORS.light['grey-50'],
      'grey-100': COLORS.light['grey-100'],
      'grey-200': COLORS.light['grey-200'],
      'grey-300': COLORS.light['grey-300'],
      'grey-400': COLORS.light['grey-400'],
      'grey-500': COLORS.light['grey-500'],
      'grey-600': COLORS.light['grey-600'],
      'grey-700': COLORS.light['grey-700'],
      'grey-800': COLORS.light['grey-800'],
      'grey-900': COLORS.light['grey-900'],

      // App-level surfaces — Misc tokens (not read by @core SCSS directly)
      'chat-bg': '#F3F2F5', // Misc/chat-bg
      'track-bg': '#F1F0F2', // Misc/track-bg
      'avatar-bg': '#EEEDF0', // Misc/avatar-bg
      'table-header': '#FFFFFF', // Misc/table-header
      'snackbar': '#2F2B3D', // Misc/snackbar

      // Scrollbar
      'perfect-scrollbar-thumb': COLORS.light['grey-500'],

      // Social/brand — static, never change between themes
      'bg-facebook': '#4267B2',
      'bg-twitter': '#1DA1F2',
      'bg-linkedin': '#007BB6',
    },

    variables: {
      // Border
      // MUST be in variables (not colors) to generate --v-border-color
      // @core reads --v-border-color ×24 (components, mixins, skins, apex-chart, fullcalendar)
      // Source: Theme/text-primary base hex = on-surface base
      'border-color': '#2F2B3D',

      // Source: Theme/input-border alpha = 0.22 (general UI border weight)
      'border-opacity': 0.22,

      // Emphasis opacities — Theme group token alphas
      'high-emphasis-opacity': 0.9, // Theme/text-primary alpha
      'medium-emphasis-opacity': 0.7, // Theme/text-secondary alpha
      'disabled-opacity': 0.4, // Theme/text-disabled alpha

      // Interaction state opacities — Theme/action-* token alphas
      'hover-opacity': 0.06, // Theme/action-hover alpha
      'focus-opacity': 0.1, // Theme/action-focus alpha
      'selected-opacity': 0.08, // Theme/action-selected alpha
      'activated-opacity': 0.16, // Theme/action-disabled-bg alpha
      'pressed-opacity': 0.14, // not in tokens — Vuetify standard
      'dragged-opacity': 0.1, // not in tokens — Vuetify standard

      // Overlay — Theme/backdrop-overlay token
      'overlay-scrim-background': '#2F2B3D', // backdrop-overlay base hex
      'overlay-scrim-opacity': 0.5, // backdrop-overlay alpha

      // Shadows — @core reads ×26 across all 24 elevation levels
      'shadow-key-umbra-color': '#2F2B3D',

      // Tooltip + snackbar
      // @core: $snackbar-background = $tooltip-background-color = rgb(var(--v-tooltip-background))
      'tooltip-background': COLORS.light['grey-800'],

      // Code element
      // base/_misc.scss: code { color: rgb(var(--v-code-color)) }
      'code-color': '#d400ff',

      // Switch states — not in tokens, preserve Vuexy values
      'switch-opacity': 0.2,
      'switch-disabled-track-opacity': 0.3,
      'switch-disabled-thumb-opacity': 0.4,
      'switch-checked-disabled-opacity': 0.3,

      // Border radius
      // template/_components.scss: .v-alert--density-default { border-radius: var(--v-border-radius) }
      // Aligned with SCSS $border-radius-root: 6px (Border Radius/border-radius-md token)
      'border-radius': '6px',

      // Table (app-level — not read by @core)
      'table-bg': COLORS.light['grey-50'],

      // Opacity utilities (app-level — not in @core SCSS)
      'alert-opacity': 0.16,
      'badge-opacity': 0.16,
      'opacity-grey': 0.24,
      'muted-placeholder-opacity': 0.7,
      'body-opacity': 0.9,
    },
  },

  // ────────────────────────────────────────────────────────────────────────────

  dark: {
    dark: true,

    colors: {
      // Vuetify semantic palette — identical token values to light
      'primary': '#7367F0',
      'secondary': '#808390',
      'success': '#28C76F',
      'info': '#00BAD1',
      'warning': '#FF9F43',
      'error': '#FF4C51',

      // on-* colors
      'on-primary': '#FFFFFF',

      // Theme/text-primary base hex (dark) = #E1DEF5
      'on-surface': '#E1DEF5',
      'on-background': COLORS.dark['grey-900'],

      // Surfaces — Misc tokens (dark)
      // Note: dark token has paper = body-bg = #181C2E (no layer separation by default)
      'background': '#181C2E', // Misc/body-bg (dark)
      'surface': '#181C2E', // Misc/paper (dark)  ← REQUIRED: @core reads ×17

      // Skin system
      // bordered: Misc/table-header (#2F3349) gives visible card elevation on dark bg
      'skin-bordered-background': '#2F3349', // Misc/table-header (dark)
      'skin-bordered-surface': '#2F3349', // Misc/table-header (dark)

      // Grey scale — dark anchors
      'grey-50': COLORS.dark['grey-50'],
      'grey-100': COLORS.dark['grey-100'],
      'grey-200': COLORS.dark['grey-200'],
      'grey-300': COLORS.dark['grey-300'],
      'grey-400': COLORS.dark['grey-400'],
      'grey-500': COLORS.dark['grey-500'],
      'grey-600': COLORS.dark['grey-600'],
      'grey-700': COLORS.dark['grey-700'],
      'grey-800': COLORS.dark['grey-800'],
      'grey-900': COLORS.dark['grey-900'],

      // App-level surfaces — Misc tokens (dark)
      'chat-bg': '#202534', // Misc/chat-bg (dark)
      'track-bg': '#3A3F57', // Misc/track-bg (dark)
      'avatar-bg': '#373B50', // Misc/avatar-bg (dark)
      'table-header': '#2F3349', // Misc/table-header (dark)
      'snackbar': '#F7F4FF', // Misc/snackbar (dark)

      // Scrollbar
      'perfect-scrollbar-thumb': COLORS.dark['grey-300'],

      // Social/brand — static
      'bg-facebook': '#4267B2',
      'bg-twitter': '#1DA1F2',
      'bg-linkedin': '#007BB6',
    },

    variables: {
      // Border
      // Theme/text-primary base hex (dark) = #E1DEF5
      'border-color': '#E1DEF5',
      'border-opacity': 0.22, // Theme/input-border alpha (same in dark token)

      // Emphasis opacities — dark token alphas equal light token alphas
      'high-emphasis-opacity': 0.9,
      'medium-emphasis-opacity': 0.7,
      'disabled-opacity': 0.4,

      // Interaction state opacities — dark token alphas equal light token alphas
      'hover-opacity': 0.06,
      'focus-opacity': 0.1,
      'selected-opacity': 0.08,
      'activated-opacity': 0.16,
      'pressed-opacity': 0.14,
      'dragged-opacity': 0.1,

      // Overlay — Theme/backdrop-overlay dark token: base=#171925, alpha=0.6
      'overlay-scrim-background': '#171925',
      'overlay-scrim-opacity': 0.6,

      // Shadows — darker than #181C2E background for visible elevation
      'shadow-key-umbra-color': '#0F1422',

      // Tooltip + snackbar
      'tooltip-background': COLORS.dark['grey-400'],

      // Code element
      'code-color': '#d400ff',

      // Switch states — higher opacity in dark for visibility on dark surfaces
      'switch-opacity': 0.4,
      'switch-disabled-track-opacity': 0.4,
      'switch-disabled-thumb-opacity': 0.8,
      'switch-checked-disabled-opacity': 0.3,

      // Border radius — aligned with SCSS $border-radius-root: 6px
      'border-radius': '6px',

      // Table
      'table-bg': COLORS.dark['grey-100'],

      // Opacity utilities
      'alert-opacity': 0.16,
      'badge-opacity': 0.16,
      'opacity-grey': 0.24,
      'muted-placeholder-opacity': 0.7,
      'body-opacity': 0.9,
    },
  },

}

export default themes
