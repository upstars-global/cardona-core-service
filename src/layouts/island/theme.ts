// Overwrite staticPrimaryColor
import type { ThemeDefinition } from 'vuetify'
import { COLORS } from '../../plugins/vuetify/colors'

export const staticLightPrimaryColor = '#7367F0' // old: '#6D60F0'
export const staticDarkPrimaryColor = '#7367F0' // old: '#8B81F3'

// Combine with on-secondary 64%
// 'light-secondary': '#A0A2A6'

export const light: ThemeDefinition = {
  dark: false,
  colors: {
    // General
    'primary': staticLightPrimaryColor,
    'secondary': '#808390', // old: '#787A80'
    'warning': '#FF9F43', // old: '#F08C35'
    'error': '#FF4C51', // old: '#EA3D3E'
    'success': '#53D28C', // old: '#0DB157'
    'info': '#33C8DA', // old: '#3B83F7'
    'white': '#FFFFFF',

    // Background / Surface
    'background': '#F8F7FA', // old: '#F9F9FA'
    'surface': '#FFFFFF',
    'surface-variant': '#181C2E',
    'surface-disabled': '#F4F4F7',
    'surface-hover': '#F4F4F7',
    'surface-invert': '#1F1C32',
    'surface-header': '#615E78',

    // On colors (text/icons)
    'on-background': '#2F2B3D', // old: '#1F1C32'
    'on-surface': '#2F2B3D', // old: '#1F1C32'
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

    // Backdrop
    'backdrop-overlay': '#2F2B3D',

    // Tokens (base: #2F2B3D)
    'text-primary': '#2F2B3D',
    'text-secondary': '#2F2B3D',
    'text-subtitle': '#2F2B3D',
    'text-disabled': '#2F2B3D',
    'action-active': '#2F2B3D',
    'action-hover': '#2F2B3D',
    'action-focus': '#2F2B3D',
    'action-selected': '#2F2B3D',
    'action-disabled': '#2F2B3D',
    'action-disabled-bg': '#2F2B3D',
    'outline-border': '#2F2B3D',
    'input-border': '#2F2B3D',
    'divider': '#2F2B3D',
    'filled-input-bg': '#2F2B3D',
    'chip-background': '#2F2B3D',
  },
  variables: {
    // Border
    'border-color': '#1F1C32',
    'border-opacity': 0.32,
    'border-hover-opacity': 0.62,

    // States
    'hover-opacity': 0.06, // old: 0.08
    'focus-opacity': 0.10, // old: 0.9
    'pressed-opacity': 0.16,
    'selected-opacity': 0.08, // old: 0.24
    'activated-opacity': 0.16,
    'disabled-opacity': 0.30, // old: 0.64

    // Text emphasis
    'high-emphasis-opacity': 0.90,
    'medium-emphasis-opacity': 0.70, // old: 0.9
    'low-emphasis-opacity': 0.55, // old: 0.62
    'text-disabled-opacity': 0.40, // old: 0.32

    // Surface header (з alpha)
    'surface-header-opacity': 0.08,

    // Tokens
    'action-active-opacity': 0.60,
    'outline-border-opacity': 0.24,
    'input-border-opacity': 0.22,
    'divider-opacity': 0.12,
    'backdrop-overlay-opacity': 0.50,

    // Theme specific
    'theme-overlay-multiplier': 1,

    'c-table-head-bg': '#E9E9F0',

    // Layouts
    'island-layout-bg': '#13151F',
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
    'secondary': '#808390', // old: '#A0A2A6'
    'warning': '#FF9F43', // old: '#F08C35'
    'error': '#FF4C51', // old: '#F76A6A'
    'success': '#53D28C', // old: '#2CC972'
    'info': '#33C8DA', // old: '#649DFA'
    'white': '#FFFFFF',

    // Background / Surface
    'background': '#13151F', // old: '#0E1017'
    'surface': '#161822',
    'surface-variant': '#13151F',
    'surface-disabled': '#1F1C32',
    'surface-hover': '#1F1C32',
    'surface-invert': '#F4F4F7',
    'surface-header': '#373645',

    // On colors (text/icons)
    'on-background': '#E1DEF5', // old: '#F4F4F7'
    'on-surface': '#E1DEF5', // old: '#F4F4F7'
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

    // Backdrop
    'backdrop-overlay': '#171925',

    // Tokens (base: #E1DEF5)
    'text-primary': '#E1DEF5',
    'text-secondary': '#E1DEF5',
    'text-subtitle': '#E1DEF5',
    'text-disabled': '#E1DEF5',
    'action-active': '#E1DEF5',
    'action-hover': '#E1DEF5',
    'action-focus': '#E1DEF5',
    'action-selected': '#E1DEF5',
    'action-disabled': '#E1DEF5',
    'action-disabled-bg': '#E1DEF5',
    'outline-border': '#E1DEF5',
    'input-border': '#E1DEF5',
    'divider': '#E1DEF5',
    'filled-input-bg': '#E1DEF5',
    'chip-background': '#E1DEF5',
  },
  variables: {
    // Border
    'border-color': '#F4F4F7',
    'border-opacity': 0.32,
    'border-hover-opacity': 0.62,

    // States
    'hover-opacity': 0.06, // old: 0.08
    'focus-opacity': 0.10, // old: 0.9
    'pressed-opacity': 0.16,
    'selected-opacity': 0.08, // old: 0.24
    'activated-opacity': 0.16,
    'disabled-opacity': 0.30, // old: 0.64

    // Text emphasis
    'high-emphasis-opacity': 0.90,
    'medium-emphasis-opacity': 0.70, // old: 0.9
    'low-emphasis-opacity': 0.55, // old: 0.62
    'text-disabled-opacity': 0.40, // old: 0.32

    // Surface header (з alpha)
    'surface-header-opacity': 0.08,

    // Tokens
    'action-active-opacity': 0.60,
    'outline-border-opacity': 0.24,
    'input-border-opacity': 0.22,
    'divider-opacity': 0.12,
    'backdrop-overlay-opacity': 0.60,

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
