// Overwrite staticPrimaryColor
import type { ThemeDefinition } from 'vuetify'
import { COLORS } from '../../plugins/vuetify/colors'

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

    // skeleton
    'skeleton-primary': '#D8D8DA',
    'skeleton-secondary': '#FFFFFF',
    'skeleton-bg': '#84819D',

    // Skin fallbacks (required by initCore _handleSkinChanges — island ignores skin)
    'skin-bordered-background': '#F9F9FA',
    'skin-bordered-surface': '#FFFFFF',
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

    // Text emphasis (additional)
    'text-primary-opacity': 0.9,
    'text-secondary-opacity': 0.7,
    'text-subtitle-opacity': 0.55,

    // Action states (additional)
    'dragged-opacity': 0.08,
    'action-active-opacity': 0.6,
    'action-hover-opacity': 0.06,
    'action-selected-opacity': 0.08,
    'action-focus-opacity': 0.1,
    'action-disabled-opacity': 0.3,
    'action-disabled-bg-opacity': 0.16,

    // Border & divider
    'divider-opacity': 0.12,
    'outline-border-opacity': 0.24,
    'input-border-opacity': 0.22,

    // Component misc
    'chip-background-opacity': 0.08,
    'filled-input-bg-opacity': 0.06,
    'backdrop-overlay': 'rgba(31, 28, 50, 0.5)',
    'theme-kbd': '#1F1C32',
    'theme-on-kbd': '#FFFFFF',
    'theme-code': '#F9F9FA',
    'theme-on-code': '#1F1C32',

    // Color-opacity palette
    'gray-opacity-darker': 'rgba(31, 28, 50, 0.38)',
    'gray-opacity-dark': 'rgba(31, 28, 50, 0.32)',
    'gray-opacity-main': 'rgba(31, 28, 50, 0.24)',
    'gray-opacity-light': 'rgba(31, 28, 50, 0.16)',
    'gray-opacity-lighter': 'rgba(31, 28, 50, 0.08)',

    'primary-opacity-darker': 'rgba(109, 96, 240, 0.38)',
    'primary-opacity-dark': 'rgba(109, 96, 240, 0.32)',
    'primary-opacity-main': 'rgba(109, 96, 240, 0.24)',
    'primary-opacity-light': 'rgba(109, 96, 240, 0.16)',
    'primary-opacity-lighter': 'rgba(109, 96, 240, 0.08)',

    'secondary-opacity-darker': 'rgba(120, 122, 128, 0.38)',
    'secondary-opacity-dark': 'rgba(120, 122, 128, 0.32)',
    'secondary-opacity-main': 'rgba(120, 122, 128, 0.24)',
    'secondary-opacity-light': 'rgba(120, 122, 128, 0.16)',
    'secondary-opacity-lighter': 'rgba(120, 122, 128, 0.08)',

    'success-opacity-darker': 'rgba(13, 177, 87, 0.38)',
    'success-opacity-dark': 'rgba(13, 177, 87, 0.32)',
    'success-opacity-main': 'rgba(13, 177, 87, 0.24)',
    'success-opacity-light': 'rgba(13, 177, 87, 0.16)',
    'success-opacity-lighter': 'rgba(13, 177, 87, 0.08)',

    'info-opacity-darker': 'rgba(59, 131, 247, 0.38)',
    'info-opacity-dark': 'rgba(59, 131, 247, 0.32)',
    'info-opacity-main': 'rgba(59, 131, 247, 0.24)',
    'info-opacity-light': 'rgba(59, 131, 247, 0.16)',
    'info-opacity-lighter': 'rgba(59, 131, 247, 0.08)',

    'warning-opacity-darker': 'rgba(240, 140, 53, 0.38)',
    'warning-opacity-dark': 'rgba(240, 140, 53, 0.32)',
    'warning-opacity-main': 'rgba(240, 140, 53, 0.24)',
    'warning-opacity-light': 'rgba(240, 140, 53, 0.16)',
    'warning-opacity-lighter': 'rgba(240, 140, 53, 0.08)',

    'error-opacity-darker': 'rgba(234, 61, 62, 0.38)',
    'error-opacity-dark': 'rgba(234, 61, 62, 0.32)',
    'error-opacity-main': 'rgba(234, 61, 62, 0.24)',
    'error-opacity-light': 'rgba(234, 61, 62, 0.16)',
    'error-opacity-lighter': 'rgba(234, 61, 62, 0.08)',
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

    // On colors (text/icons)
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

    // skeleton
    'skeleton-primary': '#D8D8DA',
    'skeleton-secondary': '#FFFFFF',
    'skeleton-bg': '#ADABBE',

    // Skin fallbacks (required by initCore _handleSkinChanges — island ignores skin)
    'skin-bordered-background': '#0E1017',
    'skin-bordered-surface': '#161822',
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

    // Text emphasis (additional)
    'text-primary-opacity': 0.9,
    'text-secondary-opacity': 0.7,
    'text-subtitle-opacity': 0.55,

    // Action states (additional)
    'dragged-opacity': 0.08,
    'action-active-opacity': 0.6,
    'action-hover-opacity': 0.06,
    'action-selected-opacity': 0.08,
    'action-focus-opacity': 0.1,
    'action-disabled-opacity': 0.3,
    'action-disabled-bg-opacity': 0.16,

    // Border & divider
    'divider-opacity': 0.12,
    'outline-border-opacity': 0.24,
    'input-border-opacity': 0.22,

    // Component misc
    'chip-background-opacity': 0.08,
    'filled-input-bg-opacity': 0.06,
    'backdrop-overlay': 'rgba(14, 16, 23, 0.6)',
    'theme-kbd': '#D5D5DE',
    'theme-on-kbd': '#0E1017',
    'theme-code': '#0E1017',
    'theme-on-code': '#F4F4F7',

    // Color-opacity palette
    'gray-opacity-darker': 'rgba(244, 244, 247, 0.38)',
    'gray-opacity-dark': 'rgba(244, 244, 247, 0.32)',
    'gray-opacity-main': 'rgba(244, 244, 247, 0.24)',
    'gray-opacity-light': 'rgba(244, 244, 247, 0.16)',
    'gray-opacity-lighter': 'rgba(244, 244, 247, 0.08)',

    'primary-opacity-darker': 'rgba(139, 129, 243, 0.38)',
    'primary-opacity-dark': 'rgba(139, 129, 243, 0.32)',
    'primary-opacity-main': 'rgba(139, 129, 243, 0.24)',
    'primary-opacity-light': 'rgba(139, 129, 243, 0.16)',
    'primary-opacity-lighter': 'rgba(139, 129, 243, 0.08)',

    'secondary-opacity-darker': 'rgba(160, 162, 166, 0.38)',
    'secondary-opacity-dark': 'rgba(160, 162, 166, 0.32)',
    'secondary-opacity-main': 'rgba(160, 162, 166, 0.24)',
    'secondary-opacity-light': 'rgba(160, 162, 166, 0.16)',
    'secondary-opacity-lighter': 'rgba(160, 162, 166, 0.08)',

    'success-opacity-darker': 'rgba(44, 201, 114, 0.38)',
    'success-opacity-dark': 'rgba(44, 201, 114, 0.32)',
    'success-opacity-main': 'rgba(44, 201, 114, 0.24)',
    'success-opacity-light': 'rgba(44, 201, 114, 0.16)',
    'success-opacity-lighter': 'rgba(44, 201, 114, 0.08)',

    'info-opacity-darker': 'rgba(100, 157, 250, 0.38)',
    'info-opacity-dark': 'rgba(100, 157, 250, 0.32)',
    'info-opacity-main': 'rgba(100, 157, 250, 0.24)',
    'info-opacity-light': 'rgba(100, 157, 250, 0.16)',
    'info-opacity-lighter': 'rgba(100, 157, 250, 0.08)',

    'warning-opacity-darker': 'rgba(240, 140, 53, 0.38)',
    'warning-opacity-dark': 'rgba(240, 140, 53, 0.32)',
    'warning-opacity-main': 'rgba(240, 140, 53, 0.24)',
    'warning-opacity-light': 'rgba(240, 140, 53, 0.16)',
    'warning-opacity-lighter': 'rgba(240, 140, 53, 0.08)',

    'error-opacity-darker': 'rgba(247, 106, 106, 0.38)',
    'error-opacity-dark': 'rgba(247, 106, 106, 0.32)',
    'error-opacity-main': 'rgba(247, 106, 106, 0.24)',
    'error-opacity-light': 'rgba(247, 106, 106, 0.16)',
    'error-opacity-lighter': 'rgba(247, 106, 106, 0.08)',
  },
}
