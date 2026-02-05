// Overwrite staticPrimaryColor
import type { ThemeDefinition } from 'vuetify'
import { GREY } from '../../plugins/vuetify/colors'

export const staticLightPrimaryColor = '#6D60F0'
export const staticDarkPrimaryColor = '#8B81F3'

// Combine with on-secondary 64%
// 'light-secondary': '#A0A2A6'

export const light: ThemeDefinition = {
  dark: false,
  colors: {
    // General
    'primary': staticLightPrimaryColor,
    'secondary': '#787A80',
    'warning': '#F08C35',
    'error': '#EA3D3E',
    'success': '#0DB157',
    'info': '#649DFA',
    'white': '#FFFFFF',

    // Background / Surface
    'background': '#F9F9FA',
    'surface': '#FFFFFF',
    'surface-variant': '#181C2E',
    'surface-disabled': '#F4F4F7',
    'surface-hover': '#F4F4F7',
    'surface-invert': '#1F1C32',
    'surface-header': '#615E78',

    // On colors (text/icons)
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
  },
  variables: {
    // Border
    'border-color': '#1F1C32',
    'border-opacity': 0.32,
    'border-hover-opacity': 0.62,

    // States
    'hover-opacity': 0.08,
    'focus-opacity': 0.9,
    'pressed-opacity': 0.16,
    'selected-opacity': 0.24,
    'activated-opacity': 0.16,
    'disabled-opacity': 0.64,

    // Text emphasis
    'high-emphasis-opacity': 0.9,
    'medium-emphasis-opacity': 0.9,
    'low-emphasis-opacity': 0.62,
    'text-disabled-opacity': 0.32,

    // Surface header (з alpha)
    'surface-header-opacity': 0.08,

    // Theme specific
    'theme-overlay-multiplier': 1,

    // Layouts
    'island-layout-bg': '#181C2E',
    'island-page-bg': '#F9F9FA',
    'island-menu-section-color': GREY.light['grey-200'],
    'island-menu-item-color': GREY.light['grey-100'],
    'island-project-select-color': GREY.light['grey-100'],
    'island-project-select-bg': GREY.dark['grey-100'],
    'island-card-bg': '#FFFFFF',
    'island-border-color': GREY.light['grey-200'],
    'island-text-general': '#353347',
    'island-skeleton': GREY.dark['grey-600'],
    'island-active-nav-bg': GREY.light['grey-200'],
  },
}

// Combine with on-secondary 64%
// 'light-secondary': '#DDDEDF'

export const dark: ThemeDefinition = {
  dark: true,
  colors: {
    // General
    'primary': staticDarkPrimaryColor,
    'secondary': '#A0A2A6',
    'warning': '#F08C35',
    'error': '#F76A6A',
    'success': '#2CC972',
    'info': '#3B83F7',
    'white': '#FFFFFF',

    // Background / Surface
    'background': '#0E1017',
    'surface': '#161822',
    'surface-variant': '#13151F',
    'surface-disabled': '#1F1C32',
    'surface-hover': '#1F1C32',
    'surface-invert': '#F4F4F7',
    'surface-header': '#373645',

    // On colors (text/icons)
    'on-background': '#F4F4F7',
    'on-surface': '#F4F4F7',
    'on-surface-variant': '#F4F4F7',
    'on-primary': '#161822',
    'on-secondary': '#161822',
    'on-warning': '#161822',
    'on-error': '#161822',
    'on-success': '#161822',
    'on-info': '#161822',
    'text-invert': '#1F1C32',

    // Border
    'border-focused': '#5957DF',
    'border-system': '#373645',
  },
  variables: {
    // Border
    'border-color': '#F4F4F7',
    'border-opacity': 0.32,
    'border-hover-opacity': 0.62,

    // States
    'hover-opacity': 0.08,
    'focus-opacity': 0.9,
    'pressed-opacity': 0.16,
    'selected-opacity': 0.24,
    'activated-opacity': 0.16,
    'disabled-opacity': 0.64,

    // Text emphasis
    'high-emphasis-opacity': 0.9,
    'medium-emphasis-opacity': 0.9,
    'low-emphasis-opacity': 0.62,
    'text-disabled-opacity': 0.32,

    // Surface header (з alpha)
    'surface-header-opacity': 0.08,

    // Theme specific
    'theme-overlay-multiplier': 1,

    // Layouts
    'island-layout-bg': '#13151F',
    'island-page-bg': '#0E1017',
    'island-menu-section-color': GREY.light['grey-200'],
    'island-menu-item-color': GREY.dark['grey-100'],
    'island-project-select-color': GREY.light['grey-100'],
    'island-project-select-bg': GREY.dark['grey-100'],
    'island-card-bg': '#161822',
    'island-border-color': '#3A3C50',
    'island-text-general': '#D5D5DE',
    'island-skeleton': GREY.light['grey-200'],
    'island-active-nav-bg': GREY.light['grey-200'],
  },
}
