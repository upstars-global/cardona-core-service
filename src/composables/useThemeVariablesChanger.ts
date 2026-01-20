import { useTheme } from 'vuetify'

export function useThemeVariablesChanger() {
  const theme = useTheme()

  const setThemeColors = (themeName: 'light' | 'dark', colors: Record<string, string>) => {
    if (theme.themes.value[themeName])
      Object.assign(theme.themes.value[themeName].colors, colors)
  }

  const setCurrentThemeColors = (colors: Record<string, string>) => {
    Object.assign(theme.current.value.colors, colors)
  }

  const setColor = (colorName: string, colorValue: string) => {
    theme.current.value.colors[colorName] = colorValue
  }

  const getColor = (colorName: string) => {
    return theme.current.value.colors[colorName]
  }

  const toggleTheme = () => {
    theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  }

  return {
    theme,
    setThemeColors,
    setCurrentThemeColors,
    setColor,
    getColor,
    toggleTheme,
  }
}
