/**
 * Vuetify theme overrides з Figma (Vuexy-4, node 4221-53623)
 * Містить тільки значення що відрізняються від cardona-core-service/island/theme
 */

import type { ThemeDefinition } from 'vuetify'

export const staticLightPrimaryColor = '#7367F0'
export const staticDarkPrimaryColor = '#7367F0'

export const light: ThemeDefinition = {
  dark: false,
  colors: {
    'primary': '#7367F0',
    'secondary': '#808390',
    'success': '#53D28C',
    'error': '#FF4C51',
    'warning': '#FF9F43',
    'info': '#33C8DA',
    'background': '#F8F7FA',
    'on-background': '#2F2B3D',
    'on-surface': '#2F2B3D',
  },
  variables: {
    'high-emphasis-opacity': 0.90,
    'medium-emphasis-opacity': 0.70,
    'low-emphasis-opacity': 0.55,
    'text-disabled-opacity': 0.40,
    'hover-opacity': 0.06,
    'focus-opacity': 0.10,
    'selected-opacity': 0.08,
    'disabled-opacity': 0.30,
  },
}

export const dark: ThemeDefinition = {
  dark: true,
  colors: {
    'primary': '#7367F0',
    'secondary': '#808390',
    'success': '#53D28C',
    'error': '#FF4C51',
    'warning': '#FF9F43',
    'info': '#33C8DA',
    'background': '#13151F',
    'on-background': '#E1DEF5',
    'on-surface': '#E1DEF5',
  },
  variables: {
    'high-emphasis-opacity': 0.90,
    'medium-emphasis-opacity': 0.70,
    'low-emphasis-opacity': 0.55,
    'text-disabled-opacity': 0.40,
    'hover-opacity': 0.06,
    'focus-opacity': 0.10,
    'selected-opacity': 0.08,
    'disabled-opacity': 0.30,
  },
}
