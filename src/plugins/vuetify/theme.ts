import type { ThemeDefinition } from 'vuetify'

export const staticPrimaryColor = '#6d60f0'

export const themes: Record<string, ThemeDefinition> = {
  light: {
    dark: false,
    colors: {
      // ── Required by Vuetify ─────────────────────────────────────────────────
      'background': '#ffffff', // White
      'surface': '#ffffff', // White
      'primary': '#6d60f0', // Purple500
      'secondary': '#6b7280', // Grey500
      'success': '#059669', // Green600
      'warning': '#fbbf24', // Yellow500
      'error': '#dd3737', // Red600
      'info': '#2a74e1', // Blue600

      'on-background': '#20222b', // Neutral800
      'on-surface': '#20222b', // Neutral800
      'on-primary': '#ffffff', // White
      'on-secondary': '#ffffff', // White
      'on-success': '#ffffff', // White
      'on-warning': '#ffffff', // White
      'on-error': '#ffffff', // White
      'on-info': '#ffffff', // White

      // ── Vuetify surface variants ─────────────────────────────────────────────
      // Vuetify uses these natively for elevated surfaces, inputs, etc.
      'surface-bright': '#ffffff', // White
      'surface-light': '#f7f8fa', // Neutral100
      'surface-variant': '#f7f8fa', // Neutral100
      'on-surface-variant': '#20222b', // Neutral800

      // ── Container / tonal pairs (Material You pattern, used in Vuetify 3) ───
      'primary-darken-1': '#574dd4', // Purple600
      'secondary-darken-1': '#5b616e', // Grey600

      'primary-container': '#e7e5ff', // Purple100
      'on-primary-container': '#6d60f0', // Purple500

      'secondary-container': '#edeef0', // Grey100
      'on-secondary-container': '#6b7280', // Grey500

      'error-container': '#fceaea', // Red100
      'on-error-container': '#dd3737', // Red600

      'success-container': '#d1fae5', // Green100
      'on-success-container': '#059669', // Green600

      'warning-container': '#fef3c7', // Yellow200
      'on-warning-container': '#d97706', // Yellow700

      'info-container': '#e5eefa', // Blue100
      'on-info-container': '#2a74e1', // Blue600

      // ── Inverse surface ──────────────────────────────────────────────────────
      'inverse-surface': '#1a1c24', // Neutral900
      'inverse-on-surface': '#ffffff', // White
      'inverse-primary': '#ada4ff', // Purple300

      // ── Outline ──────────────────────────────────────────────────────────────
      'outline': '#e6e6e8', // Neutral300
      'outline-variant': '#f0f0f2', // Neutral200

      // ── Custom semantic tokens ───────────────────────────────────────────────
      'sidebar': '#252833', // Neutral700
      'on-sidebar': '#ffffff', // White
      'tooltip-background': '#252833', // Neutral700
      'shadow': '#1a1c24', // Neutral900

      // ── Full primitive palette exposed for use in components ─────────────────
      'blue-100': '#e5eefa',
      'blue-200': '#c9dcf9',
      'blue-300': '#9fc1f4',
      'blue-400': '#74a5ef',
      'blue-500': '#4f8ce9',
      'blue-600': '#2a74e1',
      'blue-700': '#235fc0',
      'blue-800': '#1c4a9a',
      'blue-900': '#153675',

      'green-100': '#d1fae5',
      'green-200': '#a7f3d0',
      'green-300': '#6ee7b7',
      'green-400': '#34d399',
      'green-500': '#10b981',
      'green-600': '#059669',
      'green-700': '#047857',
      'green-800': '#065f46',
      'green-900': '#064e3b',

      'grey-100': '#edeef0',
      'grey-200': '#e5e7eb',
      'grey-300': '#d1d5db',
      'grey-400': '#9ca3af',
      'grey-500': '#6b7280',
      'grey-600': '#5b616e',
      'grey-700': '#4b505b',
      'grey-800': '#3a3f49',
      'grey-900': '#2a2e36',

      'neutral-100': '#f7f8fa',
      'neutral-200': '#f0f0f2',
      'neutral-300': '#e6e6e8',
      'neutral-400': '#888da0',
      'neutral-500': '#575e78',
      'neutral-600': '#303442',
      'neutral-700': '#252833',
      'neutral-800': '#20222b',
      'neutral-900': '#1a1c24',

      'purple-100': '#e7e5ff',
      'purple-200': '#cdc8ff',
      'purple-300': '#ada4ff',
      'purple-400': '#8a7cfc',
      'purple-500': '#6d60f0',
      'purple-600': '#574dd4',
      'purple-700': '#433cb8',
      'purple-800': '#2f2a8f',
      'purple-900': '#1f1b63',

      'red-100': '#fceaea',
      'red-200': '#f8cfcf',
      'red-300': '#f2a7a7',
      'red-400': '#eb7f7f',
      'red-500': '#e45757',
      'red-600': '#dd3737',
      'red-700': '#b72d2d',
      'red-800': '#912323',
      'red-900': '#6b1919',

      'violet-100': '#f5f0ff',
      'violet-200': '#ede3ff',
      'violet-300': '#e6daff',
      'violet-400': '#cbb7ff',
      'violet-500': '#b092ff',
      'violet-600': '#9c60f0',
      'violet-700': '#7c49c2',
      'violet-800': '#5b3593',
      'violet-900': '#3b2164',

      'yellow-100': '#fffbeb',
      'yellow-200': '#fef3c7',
      'yellow-300': '#fde68a',
      'yellow-400': '#fcd34d',
      'yellow-500': '#fbbf24',
      'yellow-600': '#f59e0b',
      'yellow-700': '#d97706',
      'yellow-800': '#b45309',
      'yellow-900': '#92400e',
    },

    variables: {
      // ── Vuetify native variable names (used internally by components) ────────
      'border-color': '#000000', // Vuetify uses this + border-opacity
      'border-opacity': 0.14, // replaces the old hex-alpha approach
      'shadow-color': '#000000',

      'high-emphasis-opacity': 0.98, // matches Vuetify light default
      'medium-emphasis-opacity': 0.56,
      'disabled-opacity': 0.38,
      'idle-opacity': 0.04,
      'hover-opacity': 0.04,
      'focus-opacity': 0.12,
      'selected-opacity': 0.08,
      'activated-opacity': 0.12,
      'pressed-opacity': 0.12,
      'dragged-opacity': 0.08,

      'theme-kbd': '#eeeeee',
      'theme-on-kbd': '#000000',
      'theme-code': '#f5f5f5',
      'theme-on-code': '#000000',
      'theme-on-dark': '#ffffff',
      'theme-on-light': '#000000',

      'elevation-overlay-color': 'black',
      'elevation-overlay-opacity-step': '2%',

      // ── Custom design-system tokens (accessed via var(--v-border-radius-*)) ──
      'border-radius-badge': 6, // px — Vuetify variables are unitless numbers
      'border-radius-button': 6,
      'border-radius-card': 6,
      'border-radius-chip': 6,
      'border-radius-field': 6,
      'border-radius-menu': 8,
      'border-radius-modal': 16,
      'border-radius-notification': 6,
      'border-radius-surface': 12,
      'border-radius-tooltip': 6,
      'border-radius-avatar': 999,

      'spacing-frame': 8,
      'spacing-body': 16,
      'spacing-table-cell': 8,
      'spacing-table-sides': 8,
      'spacing-gap-actions': 8,
      'spacing-gap-body': 16,

      // Switch-specific opacity (design system tokens)
      'switch-opacity': 20,
      'switch-checked-disabled-opacity': 30,
      'switch-disabled-thumb-opacity': 40,
    },
  },
  dark: {
    dark: true,
    colors: {
      // ── Required by Vuetify ─────────────────────────────────────────────────
      'background': '#20222b', // Neutral800
      'surface': '#1a1c24', // Neutral900
      'primary': '#6d60f0', // Purple500
      'secondary': '#6b7280', // Grey500
      'success': '#059669', // Green600
      'warning': '#fbbf24', // Yellow500
      'error': '#dd3737', // Red600
      'info': '#2a74e1', // Blue600

      'on-background': '#ffffff', // White
      'on-surface': '#ffffff', // White
      'on-primary': '#ffffff', // White
      'on-secondary': '#ffffff', // White
      'on-success': '#ffffff', // White
      'on-warning': '#ffffff', // White
      'on-error': '#ffffff', // White
      'on-info': '#ffffff', // White

      // ── Vuetify surface variants ─────────────────────────────────────────────
      'surface-bright': '#303442', // Neutral600
      'surface-light': '#252833', // Neutral700
      'surface-variant': '#20222b', // Neutral800
      'on-surface-variant': '#ffffff', // White

      // ── Container / tonal pairs ──────────────────────────────────────────────
      'primary-darken-1': '#433cb8', // Purple700
      'secondary-darken-1': '#4b505b', // Grey700

      'primary-container': '#2f2a8f', // Purple800
      'on-primary-container': '#e7e5ff', // Purple100

      'secondary-container': '#2a2e36', // Grey900
      'on-secondary-container': '#d1d5db', // Grey300

      'error-container': '#6b1919', // Red900
      'on-error-container': '#f8cfcf', // Red200

      'success-container': '#064e3b', // Green900
      'on-success-container': '#d1fae5', // Green100

      'warning-container': '#92400e', // Yellow900
      'on-warning-container': '#fef3c7', // Yellow200

      'info-container': '#153675', // Blue900
      'on-info-container': '#e5eefa', // Blue100

      // ── Inverse surface ──────────────────────────────────────────────────────
      'inverse-surface': '#f7f8fa', // Neutral100
      'inverse-on-surface': '#20222b', // Neutral800
      'inverse-primary': '#ada4ff', // Purple300

      // ── Outline ──────────────────────────────────────────────────────────────
      'outline': '#303442', // Neutral600
      'outline-variant': '#252833', // Neutral700

      // ── Custom semantic tokens ───────────────────────────────────────────────
      'sidebar': '#252833', // Neutral700 (same as light)
      'on-sidebar': '#ffffff', // White
      'tooltip-background': '#252833', // Neutral700
      'shadow': '#1a1c24', // Neutral900

      // ── Full primitive palette ───────────────────────────────────────────────
      'blue-100': '#e5eefa',
      'blue-200': '#c9dcf9',
      'blue-300': '#9fc1f4',
      'blue-400': '#74a5ef',
      'blue-500': '#4f8ce9',
      'blue-600': '#2a74e1',
      'blue-700': '#235fc0',
      'blue-800': '#1c4a9a',
      'blue-900': '#153675',

      'green-100': '#d1fae5',
      'green-200': '#a7f3d0',
      'green-300': '#6ee7b7',
      'green-400': '#34d399',
      'green-500': '#10b981',
      'green-600': '#059669',
      'green-700': '#047857',
      'green-800': '#065f46',
      'green-900': '#064e3b',

      'grey-100': '#edeef0',
      'grey-200': '#e5e7eb',
      'grey-300': '#d1d5db',
      'grey-400': '#9ca3af',
      'grey-500': '#6b7280',
      'grey-600': '#5b616e',
      'grey-700': '#4b505b',
      'grey-800': '#3a3f49',
      'grey-900': '#2a2e36',

      'neutral-100': '#f7f8fa',
      'neutral-200': '#f0f0f2',
      'neutral-300': '#e6e6e8',
      'neutral-400': '#888da0',
      'neutral-500': '#575e78',
      'neutral-600': '#303442',
      'neutral-700': '#252833',
      'neutral-800': '#20222b',
      'neutral-900': '#1a1c24',

      'purple-100': '#e7e5ff',
      'purple-200': '#cdc8ff',
      'purple-300': '#ada4ff',
      'purple-400': '#8a7cfc',
      'purple-500': '#6d60f0',
      'purple-600': '#574dd4',
      'purple-700': '#433cb8',
      'purple-800': '#2f2a8f',
      'purple-900': '#1f1b63',

      'red-100': '#fceaea',
      'red-200': '#f8cfcf',
      'red-300': '#f2a7a7',
      'red-400': '#eb7f7f',
      'red-500': '#e45757',
      'red-600': '#dd3737',
      'red-700': '#b72d2d',
      'red-800': '#912323',
      'red-900': '#6b1919',

      'violet-100': '#f5f0ff',
      'violet-200': '#ede3ff',
      'violet-300': '#e6daff',
      'violet-400': '#cbb7ff',
      'violet-500': '#b092ff',
      'violet-600': '#9c60f0',
      'violet-700': '#7c49c2',
      'violet-800': '#5b3593',
      'violet-900': '#3b2164',

      'yellow-100': '#fffbeb',
      'yellow-200': '#fef3c7',
      'yellow-300': '#fde68a',
      'yellow-400': '#fcd34d',
      'yellow-500': '#fbbf24',
      'yellow-600': '#f59e0b',
      'yellow-700': '#d97706',
      'yellow-800': '#b45309',
      'yellow-900': '#92400e',
    },

    variables: {
      // ── Vuetify native variables ─────────────────────────────────────────────
      'border-color': '#ffffff',
      'border-opacity': 0.12,
      'shadow-color': '#000000',

      'high-emphasis-opacity': 0.98, // matches Vuetify dark default
      'medium-emphasis-opacity': 0.56,
      'disabled-opacity': 0.50,
      'idle-opacity': 0.10,
      'hover-opacity': 0.04,
      'focus-opacity': 0.12,
      'selected-opacity': 0.08,
      'activated-opacity': 0.12,
      'pressed-opacity': 0.16,
      'dragged-opacity': 0.08,

      'theme-kbd': '#212529',
      'theme-on-kbd': '#ffffff',
      'theme-code': '#343434',
      'theme-on-code': '#cccccc',
      'theme-on-dark': '#ffffff',
      'theme-on-light': '#000000',

      'elevation-overlay-color': 'white',
      'elevation-overlay-opacity-step': '2%',

      // ── Custom design-system tokens ──────────────────────────────────────────
      'border-radius-badge': 6,
      'border-radius-button': 6,
      'border-radius-card': 6,
      'border-radius-chip': 8, // Dark token differs: 8px
      'border-radius-field': 6,
      'border-radius-menu': 6, // Dark token differs: 6px
      'border-radius-modal': 16,
      'border-radius-notification': 6,
      'border-radius-surface': 12,
      'border-radius-tooltip': 6,
      'border-radius-avatar': 999,

      'spacing-frame': 8,
      'spacing-body': 16,
      'spacing-table-cell': 8,
      'spacing-table-sides': 8,
      'spacing-gap-actions': 8,
      'spacing-gap-body': 16,

      'switch-opacity': 40,
      'switch-checked-disabled-opacity': 30,
      'switch-disabled-thumb-opacity': 80,
    },
  },
}

export default themes
