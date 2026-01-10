import { computed } from 'vue'
import { useRoute } from 'vue-router'
import LayoutDefault from '../layouts/default.vue'
import { CoreLayouts } from '../@model/layouts'

export function useLayoutChanger(layoutByMeta: Record<string, Component>, defaultLayout = CoreLayouts.Default) {
  const route = useRoute()

  const layoutKey = computed(() => route.meta?.layout || defaultLayout)
  const activeLayout = computed(() => layoutByMeta[layoutKey.value] || LayoutDefault)

  return {
    activeLayout,
    layoutKey,
  }
}
