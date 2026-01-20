import { computed } from 'vue'
import { useRoute } from 'vue-router'
import LayoutDefault from '../layouts/default.vue'
import { CoreLayouts } from '../@model/layouts'
import { useThemeChanger } from '../composables/useThemeChanger'
import { theme as islandTheme } from '../assets/styles/layouts/island/themeConfig'

export function useLayoutChanger(layoutByMeta: Record<string, Component>, defaultLayout = CoreLayouts.Default) {
  const route = useRoute()

  const layoutKey = computed(() => route.meta?.layout || defaultLayout)
  const activeLayout = computed(() => layoutByMeta[layoutKey.value] || LayoutDefault)

  const themeChanger = useThemeChanger()

  const themesKeysByLayout = {
    [CoreLayouts.Island]: islandTheme,
  }

  watch(() => layoutKey.value, layout => {
    const actualTheme = themesKeysByLayout[layout] ?? null

    if (!actualTheme)
      return

    Object.keys(actualTheme).forEach(key => {
      themeChanger.patchThemeByName(key, themesKeysByLayout[layout][key])
    })
  })

  if (layoutKey.value === CoreLayouts.Island)
    themeChanger.patchThemeByName('dark', islandTheme)

  return {
    activeLayout,
    layoutKey,
  }
}
