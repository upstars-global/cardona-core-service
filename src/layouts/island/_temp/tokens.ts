/**
 * Design tokens з Figma (Vuexy-4)
 * Джерела: Dark.tokens.json + Light.tokens.json
 *
 * Ці токени містять alpha і не підходять для Vuetify colors/variables напряму.
 * Використовуй як CSS custom properties або в SCSS.
 */

const darkBase = '#E1DEF5'
const darkBackdrop = '#171925'
const lightBase = '#2F2B3D'

export const darkTokens = {
  // Text
  'text-primary': darkBase,
  'text-primary-opacity': 0.90,
  'text-secondary': darkBase,
  'text-secondary-opacity': 0.70,
  'text-subtitle': darkBase,
  'text-subtitle-opacity': 0.55,
  'text-disabled': darkBase,
  'text-disabled-opacity': 0.40,

  // Actions
  'action-active': darkBase,
  'action-active-opacity': 0.60,
  'action-hover': darkBase,
  'action-hover-opacity': 0.06,
  'action-focus': darkBase,
  'action-focus-opacity': 0.10,
  'action-selected': darkBase,
  'action-selected-opacity': 0.08,
  'action-disabled': darkBase,
  'action-disabled-opacity': 0.30,
  'action-disabled-bg': darkBase,
  'action-disabled-bg-opacity': 0.16,

  // Borders / Dividers
  'outline-border': darkBase,
  'outline-border-opacity': 0.24,
  'input-border': darkBase,
  'input-border-opacity': 0.22,
  'divider': darkBase,
  'divider-opacity': 0.12,

  // Backgrounds
  'filled-input-bg': darkBase,
  'filled-input-bg-opacity': 0.06,
  'chip-background': darkBase,
  'chip-background-opacity': 0.08,
  'backdrop-overlay': darkBackdrop,
  'backdrop-overlay-opacity': 0.60,
} as const

export const lightTokens = {
  // Text
  'text-primary': lightBase,
  'text-primary-opacity': 0.90,
  'text-secondary': lightBase,
  'text-secondary-opacity': 0.70,
  'text-subtitle': lightBase,
  'text-subtitle-opacity': 0.55,
  'text-disabled': lightBase,
  'text-disabled-opacity': 0.40,

  // Actions
  'action-active': lightBase,
  'action-active-opacity': 0.60,
  'action-hover': lightBase,
  'action-hover-opacity': 0.06,
  'action-focus': lightBase,
  'action-focus-opacity': 0.10,
  'action-selected': lightBase,
  'action-selected-opacity': 0.08,
  'action-disabled': lightBase,
  'action-disabled-opacity': 0.30,
  'action-disabled-bg': lightBase,
  'action-disabled-bg-opacity': 0.16,

  // Borders / Dividers
  'outline-border': lightBase,
  'outline-border-opacity': 0.24,
  'input-border': lightBase,
  'input-border-opacity': 0.22,
  'divider': lightBase,
  'divider-opacity': 0.12,

  // Backgrounds
  'filled-input-bg': lightBase,
  'filled-input-bg-opacity': 0.06,
  'chip-background': lightBase,
  'chip-background-opacity': 0.08,
  'backdrop-overlay': lightBase,
  'backdrop-overlay-opacity': 0.50,
} as const

export type DarkTokenKey = keyof typeof darkTokens
export type LightTokenKey = keyof typeof lightTokens
