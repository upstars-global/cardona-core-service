import type { ThemeDefinition } from 'vuetify'
import { GREY } from './colors'

export const staticPrimaryColor = '#6D60F0'

export const themes: Record<string, ThemeDefinition> = {
  light: {
    dark: false,
    colors: {
      'primary': staticPrimaryColor,
      'primary-300': '#A9A2F6',
      'on-primary': '#fff',
      'secondary': '#787A80',
      'on-secondary': '#fff',
      'success': '#0DB157',
      'on-success': '#fff',
      'info': '#3B83F7',
      'on-info': '#fff',
      'warning': '#F08C35',
      'on-warning': '#fff',
      'error': '#EA3D3E',
      'background': '#F9F9FA',
      'on-background': GREY.light['grey-900'],
      'on-surface': '#2F2B3D',
      ...GREY.light,
      'body': GREY.light['grey-900'],
      'extra-body': '#F9F9FA',
      'border-color': '#2F2B3D',

      /// !TODO ADD ALSO TO DARK - end >
      'perfect-scrollbar-thumb': '#DBDADE',
      'skin-bordered-background': '#fff',
      'skin-bordered-surface': '#fff',
    },

    variables: {
      'table-bg': '#EFEFF0',
      'code-color': '#d400ff',
      'overlay-scrim-background': '#4C4E64',
      'tooltip-background': GREY.light['grey-800'],
      'overlay-scrim-opacity': 0.5,
      'hover-opacity': 0.04,
      'focus-opacity': 0.12,
      'selected-opacity': 0.06,
      'activated-opacity': 0.16,
      'alert-opacity': 0.16,
      'badge-opacity': 0.16,
      'pressed-opacity': 0.14,
      'dragged-opacity': 0.1,
      'disabled-opacity': 0.32,
      'border-opacity': 0.16,
      'high-emphasis-opacity': 0.9,
      'medium-emphasis-opacity': 0.62,
      'opacity-grey': 0.24,
      'switch-opacity': 0.2,
      'switch-disabled-track-opacity': 0.3,
      'switch-disabled-thumb-opacity': 0.4,
      'switch-checked-disabled-opacity': 0.3,
      'muted-placeholder-opacity': 0.62, // TODO: medium-emphasis-opacity
      'body-opacity': 0.9,
      'border-radius': '0.5rem',

      // Shadows
      'shadow-key-umbra-color': '#2F2B3D',

      // Table
      'c-table-head-bg': '#EFEFF0',
    },
  },
  dark: {
    dark: true,
    colors: {
      'primary': staticPrimaryColor,
      'primary-300': '#A9A2F6',
      'on-primary': '#fff',
      'secondary': '#A8AAAE',
      'on-secondary': '#fff',
      'success': '#28C76F',
      'on-success': '#fff',
      'info': '#3B83F7',
      'on-info': '#fff',
      'warning': '#FF9F43',
      'on-warning': '#fff',
      'error': '#EA5455',
      'background': '#25293C',
      'on-background': '#E7E9F6',
      'surface': '#2F3349',
      'on-surface': '#D0D4F1',
      ...GREY.dark,
      'perfect-scrollbar-thumb': '#4A5072',
      'skin-bordered-background': '#2f3349',
      'skin-bordered-surface': '#2f3349',
    },
    variables: {
      'table-bg': '#3D4155',
      'code-color': '#d400ff',
      'overlay-scrim-background': '#101121',
      'tooltip-background': GREY.dark['grey-400'],
      'overlay-scrim-opacity': 0.6,
      'hover-opacity': 0.04,
      'focus-opacity': 0.12,
      'selected-opacity': 0.06,
      'activated-opacity': 0.16,
      'pressed-opacity': 0.14,
      'dragged-opacity': 0.1,
      'disabled-opacity': 0.32,
      'border-color': '#D0D4F1',
      'border-opacity': 0.16,
      'high-emphasis-opacity': 0.78,
      'medium-emphasis-opacity': 0.68,
      'switch-opacity': 0.4,
      'switch-disabled-track-opacity': 0.4,
      'switch-disabled-thumb-opacity': 0.8,
      'switch-checked-disabled-opacity': 0.3,
      'border-radius': '0.5rem',

      // Shadows
      'shadow-key-umbra-color': '#0F1422',

      // Table
      'c-table-head-bg': '#242532',
    },
  },
}

export default themes
