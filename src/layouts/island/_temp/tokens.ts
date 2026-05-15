/**
 * Design tokens з Figma (Vuexy-4)
 * Джерела: Dark.tokens.json + Light.tokens.json
 *
 * Ці токени містять alpha і не підходять для Vuetify colors/variables напряму.
 * Використовуй як CSS custom properties або в SCSS.
 */

export const darkTokens = {
  // Text
  'text-primary': '#E1DEF5E5',   // alpha 0.898
  'text-secondary': '#E1DEF5B2', // alpha 0.698
  'text-subtitle': '#E1DEF58C',  // alpha 0.549
  'text-disabled': '#E1DEF566',  // alpha 0.400

  // Actions
  'action-active': '#E1DEF599',      // alpha 0.600
  'action-hover': '#E1DEF50F',       // alpha 0.059
  'action-focus': '#E1DEF51A',       // alpha 0.102
  'action-selected': '#E1DEF514',    // alpha 0.078
  'action-disabled': '#E1DEF54D',    // alpha 0.302
  'action-disabled-bg': '#E1DEF529', // alpha 0.161

  // Borders / Dividers
  'outline-border': '#E1DEF53D',  // alpha 0.239
  'input-border': '#E1DEF538',    // alpha 0.220
  'divider': '#E1DEF51F',         // alpha 0.122

  // Backgrounds
  'filled-input-bg': '#E1DEF50F',   // alpha 0.059
  'chip-background': '#E1DEF514',   // alpha 0.078
  'backdrop-overlay': '#17192599',  // alpha 0.600
} as const

export const lightTokens = {
  // Text
  'text-primary': '#2F2B3DE5',   // alpha 0.898
  'text-secondary': '#2F2B3DB2', // alpha 0.698
  'text-subtitle': '#2F2B3D8C',  // alpha 0.549
  'text-disabled': '#2F2B3D66',  // alpha 0.400

  // Actions
  'action-active': '#2F2B3D99',      // alpha 0.600
  'action-hover': '#2F2B3D0F',       // alpha 0.059
  'action-focus': '#2F2B3D1A',       // alpha 0.102
  'action-selected': '#2F2B3D14',    // alpha 0.078
  'action-disabled': '#2F2B3D4D',    // alpha 0.302
  'action-disabled-bg': '#2F2B3D29', // alpha 0.161

  // Borders / Dividers
  'outline-border': '#2F2B3D3D',  // alpha 0.239
  'input-border': '#2F2B3D38',    // alpha 0.220
  'divider': '#2F2B3D1F',         // alpha 0.122

  // Backgrounds
  'filled-input-bg': '#2F2B3D0F',  // alpha 0.059
  'chip-background': '#2F2B3D14',  // alpha 0.078
  'backdrop-overlay': '#2F2B3D80', // alpha 0.500
} as const

export type DarkTokenKey = keyof typeof darkTokens
export type LightTokenKey = keyof typeof lightTokens
