import { useTheme } from 'vuetify'

function isRgbaColor(color: unknown): color is string {
  if (typeof color !== 'string')
    return false

  const trimmed = color.trim()

  if (!trimmed.startsWith('rgba(') || !trimmed.endsWith(')'))
    return false

  const values = trimmed.slice(5, -1).split(',').map(v => v.trim())

  if (values.length !== 4)
    return false

  const r = Number.parseInt(values[0])
  const g = Number.parseInt(values[1])
  const b = Number.parseInt(values[2])
  const a = Number.parseFloat(values[3])

  return !Number.isNaN(r) && !Number.isNaN(g) && !Number.isNaN(b) && !Number.isNaN(a)
    && r >= 0 && r <= 255
    && g >= 0 && g <= 255
    && b >= 0 && b <= 255
    && a >= 0 && a <= 1
}

function isHexColor(color: unknown): color is string {
  if (typeof color !== 'string')
    return false

  const v = color.trim()

  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(v)
}

function hexToRgba(hex: string, alpha = 1): string {
  const sanitized = hex.replace('#', '')

  const r = Number.parseInt(sanitized.substring(0, 2), 16)
  const g = Number.parseInt(sanitized.substring(2, 4), 16)
  const b = Number.parseInt(sanitized.substring(4, 6), 16)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function normalizeColors(input: Record<string, unknown>): Record<string, string> {
  const normalized: Record<string, string> = {}

  Object.keys(input).forEach(colorName => {
    const value = input[colorName]

    if (typeof value === 'string') {
      const v = value.trim()

      // Vuetify нормально їсть hex і rgba, тож залишаємо як є.
      // Якщо захочеш конвертувати hex->rgba — тут можна ввімкнути.
      if (isRgbaColor(v) || isHexColor(v)) {
        normalized[colorName] = v

        return
      }

      normalized[colorName] = v
    }

    // Якщо випадково прилетів object/number/etc — НЕ записуємо в colors,
    // щоб не впасти в parseColor з [object Object]
  })

  return normalized
}

export function useThemeVariablesChanger() {
  const theme = useTheme()

  const setThemeColors = (themeName: 'light' | 'dark', colors: Record<string, unknown>) => {
    const normalized = normalizeColors(colors)

    if (theme.themes.value[themeName])
      Object.assign(theme.themes.value[themeName].colors, normalized)
  }

  const setCurrentThemeColors = (colors: Record<string, unknown>) => {
    const normalized = normalizeColors(colors)

    Object.assign(theme.current.value.colors, normalized)
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
