<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { VVariants } from '../../../@model/vuetify'
import { IconsList } from '../../../@model/enums/icons'
import { useAppConfigCoreStore } from '../../../stores/appConfigCore'
import type { NavGroup, NavLink, VerticalNavItems } from '@layouts/types'
import { getComputedNavLinkToProp, isNavGroupActive, isNavLinkActive } from '@layouts/utils'

defineOptions({ name: 'SideBar' })

const props = defineProps<{
  items: VerticalNavItems
  isCollapsed: boolean
  isMenuTypeMain: boolean
}>()

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const navigateTo = (item: NavLink) => {
  const props = getComputedNavLinkToProp.value(item)
  if (props.to)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push(props.to as any)
  else if (props.href)
    window.open(props.href, props.target ?? '_self')
}

const isLinkActive = (item: NavLink): boolean => isNavLinkActive(item, router)
const isGroupItemActive = (group: NavGroup): boolean => isNavGroupActive(group.children, router)

const openedGroups = ref<string[]>([])

const getActiveGroupTitles = (): string[] => {
  const active: string[] = []

  for (const item of props.items) {
    if (!('children' in item))
      continue
    const group = item as NavGroup

    if (isNavGroupActive(group.children, router))
      active.push(group.title)
  }

  return active
}

watch(() => route.path, () => {
  const active = getActiveGroupTitles()
  const missing = active.filter(title => !openedGroups.value.includes(title))

  if (missing.length)
    openedGroups.value = [...openedGroups.value, ...missing]
}, { immediate: true })

const opened = computed({
  get: () => props.isCollapsed ? [] : openedGroups.value,
  set: (val: string[]) => {
    if (!props.isCollapsed) {
      const active = getActiveGroupTitles()
      const newlyOpened = val.filter(title => !openedGroups.value.includes(title))

      if (newlyOpened.length > 0) {
        const activeAndOpen = openedGroups.value.filter(title => active.includes(title))

        openedGroups.value = [...new Set([...activeAndOpen, newlyOpened[0]])]
      }
      else {
        openedGroups.value = [...new Set(val)]
      }
    }
  },
})

const getIcon = (item: NavGroup | NavLink) =>
  (item.icon as { icon?: string } | undefined)?.icon

const appConfigCoreStore = useAppConfigCoreStore()

const defaultRoute = { path: '/' }

const onBackClick = () => {
  appConfigCoreStore.onToggleMenuType()
}

watch(() => props.isMenuTypeMain, async isMain => {
  if (!isMain)
    return
  await nextTick()
  openedGroups.value = []

  const firstGroup = props.items.find(item => 'children' in item) as NavGroup | undefined
  if (firstGroup)
    openedGroups.value = [firstGroup.title]
})
</script>

<template>
  <VList
    v-model:opened="opened"
    density="compact"
    nav
    open-strategy="multiple"
    class="pt-4"
  >
    <div
      v-if="!isMenuTypeMain"
      class="d-flex align-center pb-4 pl-2"
    >
      <VBtn
        :prepend-icon="IconsList.ArrowLeftIcon"
        :variant="VVariants.Text"
        :to="defaultRoute"
        @click="onBackClick"
      >
        {{ $t('action.back') }}
      </VBtn>
    </div>
    <template
      v-for="item in items"
      :key="'heading' in item ? item.heading : (item as NavLink | NavGroup).title"
    >
      <VListSubheader
        v-if="'heading' in item"
        :title="t(item.heading)"
        class="nav-heading"
      />
      <VListGroup
        v-else-if="'children' in item"
        :value="(item as NavGroup).title"
      >
        <template #activator="{ props: groupProps, isOpen }">
          <VListItem
            class="mx-1"
            v-bind="groupProps"
            :title="t((item as NavGroup).title)"
            rounded="lg"
            base-color="white"
            :active="isGroupItemActive(item as NavGroup)"
          >
            <template #prepend>
              <VIcon
                :icon="getIcon(item as NavGroup)"
                color="white"
                :size="24"
              />
            </template>
            <template #title="{ title }">
              <div class="text-body-1 on-primary font-weight-regular">
                {{ title }}
              </div>
            </template>
            <template #append="{ isActive }">
              <VIcon
                color="white"
                :icon="isOpen ? IconsList.ChevronDownIcon : IconsList.ChevronRightIcon"
              />
            </template>
          </VListItem>
        </template>
        <VListItem
          v-for="child in (item as NavGroup).children"
          :key="(child as NavLink).title"
          :title="t((child as NavLink).title)"
          rounded="lg"
          base-color="white"
          class="child-list-item mx-1"
          :active="isLinkActive(child as NavLink)"
          @click="navigateTo(child as NavLink)"
        >
          <template #title="{ title }">
            <div class="text-body-1 on-primary">
              {{ title }}
            </div>
          </template>
        </VListItem>
      </VListGroup>
      <VListItem
        v-else-if="!('heading' in item) && !('children' in item)"
        :title="t((item as NavLink).title)"
        rounded="lg"
        base-color="white"
        class="mx-1 text-body-1"
        :active="isLinkActive(item as NavLink)"
        @click="navigateTo(item as NavLink)"
      >
        <template #title="{ title }">
          <div class="text-body-1 on-primary">
            {{ title }}
          </div>
        </template>
        <template #prepend>
          <VIcon
            :icon="getIcon(item as NavLink)"
            color="white"
            :size="24"
          />
        </template>
      </VListItem>
    </template>
  </VList>
</template>

<style lang="scss" scoped>
.bg-sidebar-active {
  background-color: rgba(var(--v-theme-on-sidebar), .06) !important;
  color: rgba(var(--v-theme-on-sidebar), .7) !important;
}

.child-list-item {
  padding-inline-start: 42px !important;
}

.nav-heading {
  color: rgba(var(--v-theme-on-sidebar), .45) !important;
  font-size: 12px !important;
  font-style: normal !important;
  font-weight: 400 !important;
  line-height: 125% !important;
  letter-spacing: 0.4px !important;
}
</style>
