import { type Component, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { ThemeDefinition } from 'vuetify'
import LayoutDefault from '../layouts/default.vue'
import { CoreLayouts } from '../@model/layouts'
import { useThemeVariablesChanger } from '../composables/useThemeVariablesChanger'
import { theme as islandTheme } from '../assets/styles/layouts/island/themeConfig'

interface LayoutThemes { dark?: ThemeDefinition; light?: ThemeDefinition }

export function useLayoutChanger(layoutByMeta: Record<string, Component>, defaultLayout = CoreLayouts.Default) {
  const route = useRoute()

  const layoutKey = computed(() => route.meta?.layout || defaultLayout)
  const activeLayout = computed(() => layoutByMeta[layoutKey.value] || LayoutDefault)

  const themeVariablesChanger = useThemeVariablesChanger()

  const themesKeysByLayout: Record<string, LayoutThemes> = {
    [CoreLayouts.Island]: islandTheme,
  }

  watch(
    () => layoutKey.value,
    layout => {
      const actualTheme = themesKeysByLayout[layout] ?? null

      if (!actualTheme)
        return

      ;(['light', 'dark'] as const).forEach(mode => {
        const def = actualTheme[mode]
        if (!def?.colors)
          return

        themeVariablesChanger.setThemeColors(mode, def.colors as Record<string, unknown>)
      })
    },
    { immediate: true },
  )

  return {
    activeLayout,
    layoutKey,
  }
}
