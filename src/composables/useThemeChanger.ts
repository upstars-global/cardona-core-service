import { computed, ref } from 'vue'
import { useTheme } from 'vuetify'
import type { ThemeDefinition } from 'vuetify'
import { useCookie } from '../@core/composable/useCookie'

type ThemeColors = ThemeDefinition['colors'] & Record<string, string>
type ThemeVariables = ThemeDefinition['variables'] & Record<string, string | number>

interface ThemePatch {
  colors?: Partial<ThemeColors>
  variables?: Partial<ThemeVariables>
}

type ThemePatchMap = Record<string, ThemePatch>

interface UseVuetifyThemeManagerOptions {
  persistKey?: string
  persist?: boolean
}

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

const cloneThemes = (themes: Record<string, ThemeDefinition>): Record<string, ThemeDefinition> => {
  return JSON.parse(JSON.stringify(themes)) as Record<string, ThemeDefinition>
}

const mergeThemeDefinition = (baseTheme: ThemeDefinition, patch: ThemePatch): ThemeDefinition => {
  const mergedTheme: ThemeDefinition = {
    dark: baseTheme.dark,
    colors: { ...(baseTheme.colors ?? {}) } as ThemeColors,
    variables: { ...(baseTheme.variables ?? {}) } as ThemeVariables,
  }

  if (patch.colors) {
    Object.entries(patch.colors).forEach(([colorKey, colorValue]) => {
      if (colorValue === undefined || colorValue === null)
        return
      mergedTheme.colors[colorKey] = String(colorValue)
    })
  }

  if (patch.variables) {
    Object.entries(patch.variables).forEach(([variableKey, variableValue]) => {
      if (variableValue === undefined || variableValue === null)
        return
      mergedTheme.variables[variableKey] = variableValue as any
    })
  }

  return mergedTheme
}

export function useThemeChanger(options: UseVuetifyThemeManagerOptions = {}) {
  const vuetifyTheme = useTheme()
  const currentThemeName = computed(() => vuetifyTheme.global.name.value)
  const themesRef = computed(() => vuetifyTheme.global.themes.value as Record<string, ThemeDefinition>)

  const persistEnabled = options.persist ?? true
  const persistKey = options.persistKey ?? 'vuetify-theme-patches'

  const patchesCookie = useCookie<string | null>(persistKey, {
    default: () => null,
    sameSite: 'lax',
    path: '/',
  })

  const defaultThemesSnapshot = ref<Record<string, ThemeDefinition> | null>(null)
  const patchesState = ref<ThemePatchMap>({})

  const ensureSnapshot = () => {
    if (!defaultThemesSnapshot.value)
      defaultThemesSnapshot.value = cloneThemes(themesRef.value)
  }

  const loadPersistedPatches = () => {
    const rawValue = patchesCookie.value
    if (!rawValue)
      return

    try {
      const parsedValue = JSON.parse(rawValue) as unknown
      if (!isPlainObject(parsedValue))
        return

      const patchMap = parsedValue as ThemePatchMap

      patchesState.value = patchMap

      Object.entries(patchMap).forEach(([themeName, patch]) => {
        const themes = themesRef.value
        const baseTheme = themes[themeName]
        if (!baseTheme || !patch)
          return
        themes[themeName] = mergeThemeDefinition(baseTheme, patch)
      })
    }
    catch {
      patchesState.value = {}
    }
  }

  const savePatches = () => {
    if (!persistEnabled)
      return
    if (!Object.keys(patchesState.value).length) {
      patchesCookie.value = null

      return
    }
    patchesCookie.value = JSON.stringify(patchesState.value)
  }

  const applyPatchToTheme = (themeName: string, patch: ThemePatch) => {
    ensureSnapshot()

    const themes = themesRef.value
    const baseTheme = themes[themeName]
    if (!baseTheme)
      return
    themes[themeName] = mergeThemeDefinition(baseTheme, patch)

    const existingPatch = patchesState.value[themeName] ?? {}

    const nextPatch: ThemePatch = {
      colors: { ...(existingPatch.colors ?? {}), ...(patch.colors ?? {}) },
      variables: { ...(existingPatch.variables ?? {}), ...(patch.variables ?? {}) },
    }

    patchesState.value[themeName] = nextPatch
    savePatches()
  }

  const patchCurrentTheme = (patch: ThemePatch) => {
    applyPatchToTheme(currentThemeName.value, patch)
  }

  const patchThemeByName = (themeName: string, patch: ThemePatch) => {
    applyPatchToTheme(themeName, patch)
  }

  const patchMultipleThemes = (patchMap: ThemePatchMap) => {
    Object.entries(patchMap).forEach(([themeName, patch]) => {
      applyPatchToTheme(themeName, patch)
    })
  }

  const resetThemeByName = (themeName: string) => {
    ensureSnapshot()
    if (!defaultThemesSnapshot.value)
      return
    const snapshotTheme = defaultThemesSnapshot.value[themeName]
    if (!snapshotTheme)
      return
    const themes = themesRef.value

    themes[themeName] = cloneThemes({ [themeName]: snapshotTheme })[themeName]
    delete patchesState.value[themeName]
    savePatches()
  }

  const resetAllThemes = () => {
    ensureSnapshot()
    if (!defaultThemesSnapshot.value)
      return
    const themes = themesRef.value
    const snapshot = defaultThemesSnapshot.value

    Object.keys(snapshot).forEach(themeName => {
      themes[themeName] = cloneThemes({ [themeName]: snapshot[themeName] })[themeName]
    })
    patchesState.value = {}
    savePatches()
  }

  ensureSnapshot()
  if (persistEnabled)
    loadPersistedPatches()

  return {
    currentThemeName,
    patchCurrentTheme,
    patchThemeByName,
    patchMultipleThemes,
    resetThemeByName,
    resetAllThemes,
  }
}
