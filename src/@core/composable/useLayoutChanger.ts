import { computed } from 'vue'
import { useRoute } from 'vue-router'
import LayoutDefault from '../../layouts/default.vue'

export function useLayoutChanger(layoutByMeta: Record<string, Component>) {
  const route = useRoute()

  const layoutKey = computed(() => route.meta?.layout || 'default')
  const activeLayout = computed(() => layoutByMeta[layoutKey.value] || LayoutDefault)

  return {
    activeLayout,
    layoutKey,
  }
}
