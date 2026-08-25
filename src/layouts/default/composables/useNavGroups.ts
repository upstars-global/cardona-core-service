import { computed, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isNavGroupActive } from '@layouts/utils'
import type { NavGroup, VerticalNavItems } from '@layouts/types'

export function useNavGroups(
  getItems: () => VerticalNavItems,
  isCollapsed: () => boolean,
  isMenuTypeMain: () => boolean,
) {
  const router = useRouter()
  const route = useRoute()
  const openedGroups = ref<string[]>([])

  const getActiveGroupTitles = (): string[] => {
    const active: string[] = []
    for (const item of getItems()) {
      if (!('children' in item))
        continue
      const group = item as NavGroup
      if (isNavGroupActive(group.children, router))
        active.push(group.title)
    }
    return active
  }

  watch(() => route.path, () => {
    openedGroups.value = getActiveGroupTitles()
  }, { immediate: true })

  watch(isMenuTypeMain, async isMain => {
    if (!isMain)
      return
    await nextTick()
    openedGroups.value = []
    const firstGroup = getItems().find(item => 'children' in item) as NavGroup | undefined
    if (firstGroup)
      openedGroups.value = [firstGroup.title]
  })

  const opened = computed({
    get: () => isCollapsed() ? [] : openedGroups.value,
    set: (val: string[]) => {
      if (isCollapsed())
        return
      const active = getActiveGroupTitles()
      const newlyOpened = val.filter(title => !openedGroups.value.includes(title))
      if (newlyOpened.length > 0) {
        const activeAndOpen = openedGroups.value.filter(title => active.includes(title))
        openedGroups.value = [...new Set([...activeAndOpen, newlyOpened[0]])]
      }
      else {
        openedGroups.value = [...new Set(val)]
      }
    },
  })

  return { opened }
}
