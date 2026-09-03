<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { VVariants } from '../../../@model/vuetify'
import { IconsList } from '../../../@model/enums/icons'
import { useAppConfigCoreStore } from '../../../stores/appConfigCore'
import { useNavGroups } from '../composables/useNavGroups'
import type { NavGroup, NavLink, VerticalNavItems } from '@layouts/types'
import { getComputedNavLinkToProp, isNavGroupActive, isNavLinkActive } from '@layouts/utils'

defineOptions({ name: 'SideBar' })

const props = defineProps<{
  items: VerticalNavItems
  isCollapsed: boolean
  isMenuTypeMain: boolean
}>()

const { t } = useI18n()
const router = useRouter()

const getNavItemProps = (item: NavLink) => {
  const { to, ...rest } = getComputedNavLinkToProp.value(item)
  return { ...rest, to: to ?? undefined }
}

const isLinkActive = (item: NavLink): boolean => isNavLinkActive(item, router)
const isGroupItemActive = (group: NavGroup): boolean => isNavGroupActive(group.children, router)

const getIcon = (item: NavGroup | NavLink) =>
  (item.icon as { icon?: string } | undefined)?.icon

const appConfigCoreStore = useAppConfigCoreStore()

const defaultRoute = { path: '/' }

const onBackClick = () => {
  appConfigCoreStore.onToggleMenuType()
}

const { opened } = useNavGroups(
  () => props.items,
  () => props.isCollapsed,
  () => props.isMenuTypeMain,
)
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
      data-test-id="back-btn"
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
        data-test-id="nav-heading"
      />
      <VListGroup
        v-else-if="'children' in item"
        :value="(item as NavGroup).title"
        data-test-id="nav-group"
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
            <template #append>
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
          data-test-id="nav-child-link"
          v-bind="getNavItemProps(child as NavLink)"
        >
          <template #title="{ title }">
            <div class="text-body-1 on-primary">
              {{ title }}
            </div>
          </template>
        </VListItem>
      </VListGroup>
      <VListItem
        v-else
        :title="t((item as NavLink).title)"
        rounded="lg"
        base-color="white"
        class="mx-1 text-body-1"
        :active="isLinkActive(item as NavLink)"
        data-test-id="nav-link"
        v-bind="getNavItemProps(item as NavLink)"
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
