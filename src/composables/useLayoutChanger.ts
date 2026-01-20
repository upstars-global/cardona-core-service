import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import LayoutDefault from '../layouts/default.vue'
import { CoreLayouts } from '../@model/layouts'
import { useThemeVariablesChanger } from '../composables/useThemeVariablesChanger'
import { theme as islandTheme } from '../assets/styles/layouts/island/themeConfig'

export function useLayoutChanger(layoutByMeta: Record<string, Component>, defaultLayout = CoreLayouts.Default) {
  const route = useRoute()

  const layoutKey = computed(() => route.meta?.layout || defaultLayout)
  const activeLayout = computed(() => layoutByMeta[layoutKey.value] || LayoutDefault)

  const themeVariablesChanger = useThemeVariablesChanger()

  const themesKeysByLayout = {
    [CoreLayouts.Island]: islandTheme,
  }

  watch(() => layoutKey.value, layout => {
    const actualTheme = themesKeysByLayout[layout] ?? null

    if (!actualTheme)
      return

    Object.keys(actualTheme).forEach(key => {
      themeVariablesChanger.patchThemeByName(key, themesKeysByLayout[layout][key])
    })
  })

  return {
    activeLayout,
    layoutKey,
  }
}
