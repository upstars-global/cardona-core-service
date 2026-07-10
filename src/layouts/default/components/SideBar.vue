<script setup lang="ts">
import { IconsList } from '../../../@model/enums/icons'
import type { VerticalNavItems } from '@layouts/types'

defineOptions({
  name: 'SideBar',
})

defineProps<{
  items: VerticalNavItems[]
}>()
</script>

<template>
  <VList
    bg-color="transparent"
    class="bg-sidebar ml-0 mr-auto"
    density="compact"
    nav
    open-strategy="single"
  >
    <template
      v-for="item in items"
      :key="item.title"
    >
      <VListGroup
        v-if="'children' in item"
        :value="item.title"
      >
        <template #activator="{ props: groupProps }">
          <VListItem
            v-bind="groupProps"
            :title="$t(item.title)"
            rounded="lg"
            class="nav-group open"
            active-class="bg-sidebar-active"
            collapse-icon="IconsList.ChevronDownIcon"
          >
            <template #prepend>
              <VIcon
                :icon="item.icon?.icon"
                color="primary"
                :size="22"
              />
            </template>
            <template #append="{ isActive }">
              <VIcon
                class="on-primary"
                :icon="isActive ? IconsList.ChevronRightIcon : IconsList.ChevronDownIcon"
              />
            </template>
          </VListItem>
        </template>
        <VListItem
          v-for="child in item.children"
          :key="child.title"
          :to="child.to"
          rounded="lg"
          base-color="on-primary"
          class="child-list-item"
        >
          <template #default="props">
            <div class="on-primary pl-10">
              {{ $t(child.title) }}
            </div>
          </template>
        </VListItem>
      </VListGroup>
      <VListItem
        v-else
        :title="$t(item.title)"
        :to="item.to"
        rounded="lg"

        base-color="white"
        class="bg-sidebar"
      >
        <template #prepend>
          <VIcon
            :icon="item.icon?.icon"
            color="white"
            class="me-2"
          />
        </template>
      </VListItem>
    </template>
  </VList>
</template>

<style lang="scss" scoped>
  .bg-sidebar-active {
    background-color: rgba(var(--v-theme-on-sidebar), .06) !important;
    color: rgba(var(--v-theme-on-sidebar), .7)!important
  }
  .child-list-item {
    padding-inline: 0 !important;
  }
</style>
