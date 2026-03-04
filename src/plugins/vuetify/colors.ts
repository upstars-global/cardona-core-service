type TokenPrefix = 'grey'

type Scale =
  | 50 | 100 | 200 | 300 | 400
  | 500 | 600 | 700 | 800 | 900

type TokenKey = `${TokenPrefix}-${Scale}`

type ThemeColors = Record<TokenKey, string>

export const COLORS: {
  light: ThemeColors
  dark: ThemeColors
} = {
  light: {
    'grey-50': '#FAFAFA',
    'grey-100': '#F4F4F7',
    'grey-200': '#E9E9F0',
    'grey-300': '#D2D1DB',
    'grey-400': '#ADABBE',
    'grey-500': '#84819D',
    'grey-600': '#615E78',
    'grey-700': '#4A485B',
    'grey-800': '#373645',
    'grey-900': '#1F1C32',
  },
  dark: {
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
  },
}
