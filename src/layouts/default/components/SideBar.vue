<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { IconsList } from '../../../@model/enums/icons'
import type { NavGroup, NavLink, VerticalNavItems } from '@layouts/types'

defineOptions({ name: 'SideBar' })

const props = defineProps<{
  items: VerticalNavItems
  isCollapsed: boolean
}>()

const { t } = useI18n()
const route = useRoute()

const openedGroups = ref<string[]>([])

const opened = computed({
  get: () => props.isCollapsed ? [] : openedGroups.value,
  set: (val: string[]) => {
    if (!props.isCollapsed)
      openedGroups.value = val
  },
})

const getIcon = (item: NavGroup | NavLink) =>
  (item.icon as { icon?: string } | undefined)?.icon

const isGroupActive = (group: NavGroup): boolean =>
  group.children.some(child => {
    if ('children' in child)
      return isGroupActive(child as NavGroup)
    const to = (child as NavLink).to as { name?: string } | undefined

    return !!to?.name && to.name === route.name
  })
</script>

<template>
  <VList
    v-model:opened="opened"
    density="compact"
    nav
    open-strategy="single"
    class="pt-4"
  >
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
        <template #activator="{ props: groupProps }">
          <VListItem
            v-bind="groupProps"
            :title="t((item as NavGroup).title)"
            rounded="lg"
            base-color="white"
            active-class="bg-sidebar-active"
            :class="{
              'bg-sidebar-active': isCollapsed && isGroupActive(item as NavGroup),
            }"
          >
            <template #prepend>
              <VIcon
                :icon="getIcon(item as NavGroup)"
                color="white"
                :size="24"
              />
            </template>
            <template #append="{ isActive }">
              <VIcon
                color="white"
                :icon="isActive ? IconsList.ChevronUpIcon : IconsList.ChevronDownIcon"
              />
            </template>
          </VListItem>
        </template>
        <VListItem
          v-for="child in (item as NavGroup).children"
          :key="(child as NavLink).title"
          :title="t((child as NavLink).title)"
          :to="(child as NavLink).to ?? undefined"
          rounded="lg"
          base-color="white"
          class="child-list-item"
        />
      </VListGroup>
      <VListItem
        v-else-if="!('heading' in item) && !('children' in item)"
        :title="t((item as NavLink).title)"
        :to="(item as NavLink).to ?? undefined"
        rounded="lg"
        base-color="white"
      >
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

:deep(.v-list-item) {
  padding-inline: 12px;
}

.child-list-item {
  padding-inline-start: 42px !important;
}

.nav-heading {
  color: rgba(var(--v-theme-on-sidebar), .45) !important;
  font-feature-settings: 'liga' off, 'clig' off !important;
  font-family: Inter, sans-serif !important;
  font-size: 12px !important;
  font-style: normal !important;
  font-weight: 400 !important;
  line-height: 125% !important;
  letter-spacing: 0.4px !important;
}
</style>
