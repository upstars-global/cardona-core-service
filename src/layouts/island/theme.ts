// Overwrite staticPrimaryColor
import type { ThemeDefinition } from 'vuetify'
import { COLORS } from '../../plugins/vuetify/colors'

export const staticLightPrimaryColor = '#7367F0'
export const staticDarkPrimaryColor = '#7367F0'

// Combine with on-secondary 64%
// 'light-secondary': '#A0A2A6'

export const light: ThemeDefinition = {
  dark: false,
  colors: {
    // General
    'primary': staticLightPrimaryColor,
    'secondary': '#808390',
    'warning': '#FF9F43',
    'error': '#FF4C51',
    'success': '#53D28C',
    'info': '#33C8DA',
    'white': '#FFFFFF',

    // Background / Surface
    'background': '#F8F7FA',
    'surface': '#FFFFFF',
    'surface-variant': '#181C2E',
    'surface-disabled': '#F4F4F7',
    'surface-hover': '#F4F4F7',
    'surface-invert': '#1F1C32',
    'surface-header': '#615E78',

    // On colors (text/icons)
    'on-background': '#2F2B3D',
    'on-surface': '#2F2B3D',
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

    // skeleton
    'skeleton-primary': '#D8D8DA',
    'skeleton-secondary': '#FFFFFF',
    'skeleton-bg': '#84819D',
  },
  variables: {
    // Border
    'border-color': '#1F1C32',
    'border-opacity': 0.32,
    'border-hover-opacity': 0.62,

    // States
    'hover-opacity': 0.06,
    'focus-opacity': 0.10,
    'pressed-opacity': 0.16,
    'selected-opacity': 0.08,
    'activated-opacity': 0.16,
    'disabled-opacity': 0.30,

    // Text emphasis
    'high-emphasis-opacity': 0.90,
    'medium-emphasis-opacity': 0.70,
    'low-emphasis-opacity': 0.55,
    'text-disabled-opacity': 0.40,

    // Surface header (з alpha)
    'surface-header-opacity': 0.08,

    // Theme specific
    'theme-overlay-multiplier': 1,

    'c-table-head-bg': '#E9E9F0',

    // Layouts
    'island-layout-bg': '#181C2E',
    'island-page-bg': '#F9F9FA',
    'island-menu-section-color': COLORS.light['grey-200'],
    'island-menu-item-color': COLORS.light['grey-100'],
    'island-project-select-color': COLORS.light['grey-100'],
    'island-project-select-bg': COLORS.dark['grey-100'],
    'island-card-bg': '#FFFFFF',
    'island-border-color': COLORS.light['grey-200'],
    'island-text-general': '#353347',
    'island-skeleton': COLORS.dark['grey-600'],
    'island-active-nav-bg': COLORS.light['grey-600'],
    'base-list-border-radius': '1rem',
  },
}

// Combine with on-secondary 64%
// 'light-secondary': '#DDDEDF'

export const dark: ThemeDefinition = {
  dark: true,
  colors: {
    // General
    'primary': staticDarkPrimaryColor,
    'secondary': '#808390',
    'warning': '#FF9F43',
    'error': '#FF4C51',
    'success': '#53D28C',
    'info': '#33C8DA',
    'white': '#FFFFFF',

    // Background / Surface
    'background': '#13151F',
    'surface': '#161822',
    'surface-variant': '#13151F',
    'surface-disabled': '#1F1C32',
    'surface-hover': '#1F1C32',
    'surface-invert': '#F4F4F7',
    'surface-header': '#373645',

    // On colors (text/icons)
    'on-background': '#E1DEF5',
    'on-surface': '#E1DEF5',
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

    // skeleton
    'skeleton-primary': '#D8D8DA',
    'skeleton-secondary': '#FFFFFF',
    'skeleton-bg': '#ADABBE',
  },
  variables: {
    // Border
    'border-color': '#F4F4F7',
    'border-opacity': 0.32,
    'border-hover-opacity': 0.62,

    // States
    'hover-opacity': 0.06,
    'focus-opacity': 0.10,
    'pressed-opacity': 0.16,
    'selected-opacity': 0.08,
    'activated-opacity': 0.16,
    'disabled-opacity': 0.30,

    // Text emphasis
    'high-emphasis-opacity': 0.90,
    'medium-emphasis-opacity': 0.70,
    'low-emphasis-opacity': 0.55,
    'text-disabled-opacity': 0.40,

    // Surface header (з alpha)
    'surface-header-opacity': 0.08,

    // Theme specific
    'theme-overlay-multiplier': 1,

    'c-table-head-bg': '#373645',

    // Layouts
    'island-layout-bg': '#13151F',
    'island-page-bg': '#0E1017',
    'island-menu-section-color': COLORS.light['grey-200'],
    'island-menu-item-color': COLORS.dark['grey-100'],
    'island-project-select-color': COLORS.light['grey-100'],
    'island-project-select-bg': COLORS.dark['grey-100'],
    'island-card-bg': '#161822',
    'island-border-color': '#3A3C50',
    'island-text-general': '#D5D5DE',
    'island-skeleton': COLORS.light['grey-200'],
    'island-active-nav-bg': COLORS.light['grey-200'],
    'base-list-border-radius': '1rem',
  },
}
