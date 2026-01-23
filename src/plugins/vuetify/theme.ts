import type { ThemeDefinition } from 'vuetify'

export const staticPrimaryColor = '#6D60F0'
export const grey800 = '#373645'
export const grey900 = '#1F1C32'
const grey200 = '#E9E9F0'
const islandTableHeaderText = '#7D7E85'

export const themes: Record<string, ThemeDefinition> = {
  light: {
    dark: false,
    colors: {
      'primary': staticPrimaryColor, /// !TODO ADD ALSO TO DARK
      'primary-300': '#A9A2F6',
      'on-primary': '#fff',
      'secondary': '#787A80', /// !TODO ADD ALSO TO DARK
      'on-secondary': '#fff',
      'success': '#0DB157', /// !TODO ADD ALSO TO DARK
      'on-success': '#fff',
      'info': '#3B83F7', /// !TODO ADD ALSO TO DARK
      'on-info': '#fff',
      'warning': '#F08C35', /// !TODO ADD ALSO TO DARK
      'on-warning': '#fff',
      'error': '#EA3D3E', /// !TODO ADD ALSO TO DARK
      'background': '#F9F9FA',
      'on-background': grey900,
      'on-surface': '#2F2B3D',

      /// !TODO ADD ALSO TO DARK - start
      'grey-50': '#FAFAFA',
      'grey-100': '#F4F4F7',
      'grey-200': grey200,
      'grey-300': '#D2D1DB',
      'grey-400': '#ADABBE',
      'grey-500': '#84819D',
      'grey-600': '#615E78',
      'grey-700': '#4A485B',
      'grey-800': grey800,
      'grey-900': grey900,
      'body': grey900,
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
      'tooltip-background': grey800,
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

      // Layouts
      'island-layout-bg': '#181C2E',
      'island-page-bg': '#F9F9FA',
      'island-menu-section-color': '#E9E9F0',
      'island-menu-item-color': '#F4F4F7',
      'island-project-select-color': '#E7E9F6',
      'island-project-select-bg': '#2F3349',
      'island-card-bg': '#FFFFFF',
      'island-border-color': grey200,
      'island-text-general': '#353347',
      'island-table-header-text': islandTableHeaderText,
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
      'grey-50': '#26293A',
      'grey-100': '#2F3349',
      'grey-200': '#26293A',
      'grey-300': '#4A5072',
      'grey-400': '#5E6692',
      'grey-500': '#7983BB',
      'grey-600': '#AAB3DE',
      'grey-700': '#B6BEE3',
      'grey-800': '#CFD3EC',
      'grey-900': '#E7E9F6',
      'perfect-scrollbar-thumb': '#4A5072',
      'skin-bordered-background': '#2f3349',
      'skin-bordered-surface': '#2f3349',
    },
    variables: {
      'table-bg': '#3D4155',
      'code-color': '#d400ff',
      'overlay-scrim-background': '#101121',
      'tooltip-background': '#5E6692',
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

      // Layouts
      'island-layout-bg': '#13151F',
      'island-page-bg': '#0E1017',
      'island-menu-section-color': grey200,
      'island-menu-item-color': '#F4F4F7',
      'island-project-select-color': '#E7E9F6',
      'island-project-select-bg': '#2F3349',
      'island-card-bg': '#161822',
      'island-border-color': '#3A3C50',
      'island-text-general': '#D5D5DE',
      'island-block-bg': '#161822',
      'island-table-header-text': islandTableHeaderText,
    },
  },
}

export default themes
