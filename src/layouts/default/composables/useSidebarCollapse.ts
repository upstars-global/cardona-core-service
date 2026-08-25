import { computed, ref, watch } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { useLayoutConfigStore } from '../../../@layouts/stores/config'

export function useSidebarCollapse() {
  const layoutConfigStore = useLayoutConfigStore()
  const isSmallScreen = useMediaQuery('(max-width: 1279px)')
  const isHovered = ref(false)
  let collapseTimer: ReturnType<typeof setTimeout> | null = null

  watch(isSmallScreen, isSmall => {
    layoutConfigStore.isHiddenMenu = !isSmall
  }, { immediate: true })

  const handleMouseEnter = () => {
    if (isSmallScreen.value)
      return
    if (collapseTimer) {
      clearTimeout(collapseTimer)
      collapseTimer = null
    }
    isHovered.value = true
  }

  const handleMouseLeave = () => {
    if (isSmallScreen.value)
      return
    collapseTimer = setTimeout(() => {
      isHovered.value = false
    }, 150)
  }

  const isCollapsed = computed(() =>
    !isSmallScreen.value && layoutConfigStore.isVerticalNavCollapsed && !isHovered.value,
  )

  const toggleSidebar = () => {
    layoutConfigStore.isVerticalNavCollapsed = !layoutConfigStore.isVerticalNavCollapsed
  }

  return {
    layoutConfigStore,
    isSmallScreen,
    isHovered,
    isCollapsed,
    handleMouseEnter,
    handleMouseLeave,
    toggleSidebar,
  }
}
