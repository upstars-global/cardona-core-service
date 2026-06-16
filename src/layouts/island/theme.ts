// Island layout theme definitions.
//
// ARCHITECTURE:
// This file is the single source of truth for the island layout's visual tokens.
// It is used in two ways:
//
//   1. Vuetify theme registration (plugins/vuetify/index.ts):
//      Registers 'island-light' / 'island-dark' as named Vuetify themes.
//      VThemeProvider in island/index.vue activates them, scoping all Vuetify
//      CSS custom properties (--v-theme-*) to the island layout component tree.
//
//   2. Body-level CSS var sync (island/index.vue — syncBodyVars):
//      Some island vars are needed on <body> for SCSS selectors like
//      body[data-layout="island"] that run outside VThemeProvider's DOM scope
//      (teleported dropdowns, body background, etc.).
//      island/index.vue reads `bodyLayoutVarKeys` and sets them via
//      document.body.style.setProperty on mount/theme-change.
//
// ADDING A NEW LAYOUT:
//   1. Create src/layouts/<name>/theme.ts (copy this file as template)
//   2. Create src/layouts/<name>/index.vue with VThemeProvider + VDefaultsProvider
//   3. Register themes in src/plugins/vuetify/index.ts
//   4. Create src/assets/styles/layouts/<name>/index.scss
//
// CSS VARIABLE FORMAT:
//   `colors`    → auto-converted to RGB triplets by Vuetify → --v-theme-<key>: R, G, B
//   `variables` → stored as-is                              → --v-<key>: value
//
//   Island layout color vars are stored as RGB triplet strings in `variables`
//   (e.g. '24, 28, 46') so that SCSS can use them with rgba():
//   `background-color: rgba(var(--v-island-layout-bg)) !important`

import type { ThemeDefinition } from 'vuetify'
import { COLORS } from '../../plugins/vuetify/colors'

export const staticLightPrimaryColor = '#6D60F0'
export const staticDarkPrimaryColor = '#8B81F3'

// Keys of island-specific variables that must be synced to <body>
// as `--v-<key>` for body[data-layout="island"] SCSS rules that target
// teleported elements (outside VThemeProvider's DOM scope).
// Keep in sync with the `variables` sections below.
export const bodyLayoutVarKeys = [
  'island-layout-bg',
  'island-page-bg',
  'island-card-bg',
  'island-border-color',
  'island-active-nav-bg',
  'island-menu-section-color',
  'island-menu-item-color',
  'island-project-select-color',
  'island-project-select-bg',
  'island-text-general',
  // Standard Vuetify variables overridden in island theme, needed by teleported elements
  // (flatpickr calendar — data-picker.scss) that live on <body>, outside VThemeProvider.
  'border-color',           // data-picker: SVG fill on nav arrows
  'high-emphasis-opacity',  // data-picker: input text opacity
] as const

// Keys of island colors that must be synced to <body> as `--v-theme-<key>: R,G,B`
// for body[data-layout="island"] SCSS rules targeting teleported elements.
// VThemeProvider only scopes CSS vars to its subtree; teleported content (flatpickr,
// appendToBody dropdowns) sits directly on <body> and cannot inherit them.
// Keep in sync with the `colors` sections below.
export const bodyThemeColorKeys = [
  'border-system',  // base-select.scss: dropdown border; data-picker.scss: calendar border
  'skeleton-bg',    // base-select.scss: dropdown shadow; data-picker.scss: calendar shadow
  'on-background',  // data-picker.scss: numInput text color
] as const

export const light: ThemeDefinition = {
  dark: false,
  colors: {
    // ── Standard Vuetify colors ─────────────────────────────────────────────
    // Stored as hex → auto-converted to RGB triplets → --v-theme-<key>: R, G, B
    'primary': staticLightPrimaryColor,
    'secondary': '#787A80',
    'warning': '#F08C35',
    'error': '#EA3D3E',
    'success': '#0DB157',
    'info': '#3B83F7',
    'white': '#FFFFFF',

    // Background / Surface
    'background': '#F9F9FA',
    'surface': '#FFFFFF',
    'surface-variant': '#181C2E',
    'surface-disabled': '#F4F4F7',
    'surface-hover': '#F4F4F7',
    'surface-invert': '#1F1C32',
    'surface-header': '#615E78',

    // On colors (text / icons)
    'on-background': '#1F1C32',
    'on-surface': '#1F1C32',
    'on-surface-variant': '#F4F4F7',
    'on-primary': '#FFFFFF',
    'on-secondary': '#FFFFFF',
    'on-warning': '#FFFFFF',
    'on-error': '#FFFFFF',
    'on-success': '#FFFFFF',
    'on-info': '#FFFFFF',
    'text-invert': '#F4F4F7',

    // Border
    'border-focused': '#4C4BD8',
    'border-system': '#E9E9F0',

    // Skeleton shimmer (used in skeleton.scss via --v-theme-skeleton-*)
    'skeleton-primary': '#D8D8DA',
    'skeleton-secondary': '#FFFFFF',
    'skeleton-bg': '#84819D',
  },
  variables: {
    // ── Standard Vuetify variables ──────────────────────────────────────────
    'border-color': '#1F1C32',
    'border-opacity': 0.32,
    'border-hover-opacity': 0.62,

    'hover-opacity': 0.08,
    'focus-opacity': 0.9,
    'pressed-opacity': 0.16,
    'selected-opacity': 0.24,
    'activated-opacity': 0.16,
    'disabled-opacity': 0.64,

    'high-emphasis-opacity': 0.9,
    'medium-emphasis-opacity': 0.9,
    'low-emphasis-opacity': 0.62,
    'text-disabled-opacity': 0.32,

    'surface-header-opacity': 0.08,
    'theme-overlay-multiplier': 1,

    'c-table-head-bg': '#E9E9F0',

    // ── Island layout tokens — RGB triplets ─────────────────────────────────
    // Stored as 'R, G, B' strings so SCSS can use rgba(var(--v-island-*)).
    // Also synced to <body> via bodyLayoutVarKeys for body-level SCSS rules.
    'island-layout-bg': '24, 28, 46',          // #181C2E  — sidebar / layout bg
    'island-page-bg': '249, 249, 250',          // #F9F9FA  — navbar / page content bg
    'island-card-bg': '255, 255, 255',          // #FFFFFF  — card / modal / table bg
    'island-border-color': '233, 233, 240',     // #E9E9F0  — dropdown border
    'island-active-nav-bg': '97, 94, 120',      // #615E78  — nav item hover bg
    'island-menu-section-color': '233, 233, 240', // #E9E9F0 (grey-200 light)
    'island-menu-item-color': '244, 244, 247',  // #F4F4F7 (grey-100 light)
    'island-project-select-color': '244, 244, 247', // #F4F4F7
    'island-project-select-bg': '47, 51, 73',   // #2F3349 (grey-100 dark)
    'island-text-general': '53, 51, 71',        // #353347
    'island-skeleton': '170, 179, 222',         // #AAB3DE (grey-600 dark)

    // ── Non-color layout tokens ─────────────────────────────────────────────
    'base-list-border-radius': '1rem',
  },
}

export const dark: ThemeDefinition = {
  dark: true,
  colors: {
    // ── Standard Vuetify colors ─────────────────────────────────────────────
    'primary': staticDarkPrimaryColor,
    'secondary': '#A0A2A6',
    'warning': '#F08C35',
    'error': '#F76A6A',
    'success': '#2CC972',
    'info': '#649DFA',
    'white': '#FFFFFF',

    // Background / Surface
    'background': '#0E1017',
    'surface': '#161822',
    'surface-variant': '#13151F',
    'surface-disabled': '#1F1C32',
    'surface-hover': '#1F1C32',
    'surface-invert': '#F4F4F7',
    'surface-header': '#373645',

    // On colors (text / icons)
    'on-background': '#F4F4F7',
    'on-surface': '#F4F4F7',
    'on-surface-variant': '#F4F4F7',
    'on-primary': '#FFFFFF',
    'on-secondary': '#FFFFFF',
    'on-warning': '#FFFFFF',
    'on-error': '#FFFFFF',
    'on-success': '#FFFFFF',
    'on-info': '#FFFFFF',
    'text-invert': '#1F1C32',

    // Border
    'border-focused': '#5957DF',
    'border-system': '#373645',

    // Skeleton shimmer
    'skeleton-primary': '#D8D8DA',
    'skeleton-secondary': '#FFFFFF',
    'skeleton-bg': '#ADABBE',
  },
  variables: {
    // ── Standard Vuetify variables ──────────────────────────────────────────
    'border-color': '#F4F4F7',
    'border-opacity': 0.32,
    'border-hover-opacity': 0.62,

    'hover-opacity': 0.08,
    'focus-opacity': 0.9,
    'pressed-opacity': 0.16,
    'selected-opacity': 0.24,
    'activated-opacity': 0.16,
    'disabled-opacity': 0.64,

    'high-emphasis-opacity': 0.9,
    'medium-emphasis-opacity': 0.9,
    'low-emphasis-opacity': 0.62,
    'text-disabled-opacity': 0.32,

    'surface-header-opacity': 0.08,
    'theme-overlay-multiplier': 1,

    'c-table-head-bg': '#373645',

    // ── Island layout tokens — RGB triplets ─────────────────────────────────
    'island-layout-bg': '19, 21, 31',           // #13151F
    'island-page-bg': '14, 16, 23',             // #0E1017
    'island-card-bg': '22, 24, 34',             // #161822
    'island-border-color': '58, 60, 80',        // #3A3C50
    'island-active-nav-bg': '233, 233, 240',    // #E9E9F0 (grey-200 light)
    'island-menu-section-color': '233, 233, 240', // #E9E9F0 (grey-200 light)
    'island-menu-item-color': '47, 51, 73',     // #2F3349 (grey-100 dark)
    'island-project-select-color': '244, 244, 247', // #F4F4F7
    'island-project-select-bg': '47, 51, 73',   // #2F3349
    'island-text-general': '213, 213, 222',     // #D5D5DE
    'island-skeleton': '233, 233, 240',         // #E9E9F0 (grey-200 light)

    // ── Non-color layout tokens ─────────────────────────────────────────────
    'base-list-border-radius': '1rem',
  },
}
