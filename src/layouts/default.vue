<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useUserStore } from '../stores/user'
import { IconsList } from '../@model/enums/icons'
import CustomMenu from './components/CustomMenu.vue'
import ProjectSelect from './default/components/ProjectSelect.vue'
import ProductsSelect from './default/components/ProductSelect.vue'
import SideBar from './default/components/SideBar.vue'
import AppBreadcrumb from './components/AppBreadcrumb.vue'
import { useAppsAndPages } from '@/navigation/vertical/apps-and-pages'
import { useLayoutConfigStore } from '@layouts/stores/config'

const layoutConfigStore = useLayoutConfigStore()

const toggleSidebar = () => layoutConfigStore.isVerticalNavCollapsed = !layoutConfigStore.isVerticalNavCollapsed
const { appsAndPages } = useAppsAndPages()
const navItems = computed(() => appsAndPages.value)

const userStore = useUserStore()
const projects = computed(() => userStore.projectsBySelectedProduct)

const drawer = ref(true)

const isHovered = ref(false)
const isFallbackStateActive = ref(false)

const isCollapsed = computed(() => layoutConfigStore.isVerticalNavCollapsed && !isHovered.value)

const isVerticalNavScrolled = ref(false)

const handleNavScroll = (evt: Event) => {
  isVerticalNavScrolled.value = (evt.target as HTMLElement).scrollTop > 0
}
</script>

<template>
  <VLayout class="custom-layout">
    <VNavigationDrawer
      v-model="drawer"
      :rail="layoutConfigStore.isVerticalNavCollapsed"
      permanent
      rail-width="64"
      class="bg-sidebar border-r-0"
      width="252"
      expand-on-hover
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <div class="sidebar-inner d-flex flex-column h-100">
        <div class="sidebar-top">
          <VList
            density="compact"
            bg-color="#252833"
            class="pa-0 ma-0 pt-4"
          >
            <VListItem
              class="pa-0 my-0"
              style="margin-inline: 16px"
            >
              <div class="d-flex align-center justify-space-between">
                <ProductsSelect :is-collapsed-menu="isCollapsed" />
                <VIcon
                  v-if="!isCollapsed"
                  class="sidebar-menu-mode"
                  :icon="!layoutConfigStore.isVerticalNavCollapsed ? IconsList.CircleDotIcon : IconsList.CircleIcon"
                  @click="toggleSidebar"
                />
              </div>
            </VListItem>
          </VList>

          <div
            v-if="userStore.selectedProjectWithoutPriority"
            class="pt-4 px-4"
          >
            <ProjectSelect
              :projects="projects"
              :is-collapsed-menu="isCollapsed"
            />
          </div>
        </div>

        <div
          class="sidebar-nav flex-grow-1 overflow-y-auto"
          :class="{ scrolled: isVerticalNavScrolled }"
          @scroll="handleNavScroll"
        >
          <SideBar
            :items="navItems"
            :is-collapsed="isCollapsed"
          />
        </div>

        <VList
          bg-color="#252833"
          density="compact"
          class="px-0 pb-3"
        >
          <VListItem
            class="px-0"
            style="margin-inline: 16px"
          >
            <CustomMenu :is-collapsed-menu="isCollapsed" />
          </VListItem>
        </VList>
      </div>
    </VNavigationDrawer>

    <VAppBar
      :elevation="0"
      color="transparent"
      class="px-2 pt-2 pl-0 bg-sidebar"
      height="64"
    >
      <div class="w-100 h-100 d-flex align-center px-4 bg-surface layout-border-top">
        <AppBreadcrumb class="flex-grow-1" />
        <VBtn
          icon
          variant="text"
        >
          <VIcon icon="tabler-bell" />
        </VBtn>
      </div>
    </VAppBar>
    <VMain style="height: 100dvh; overflow: hidden;">
      <div class="bg-sidebar w-100 h-100 pr-2 pb-2 d-flex flex-column">
        <div class="bg-surface flex-grow-1 layout-border-bottom overflow-y-auto pa-4">
          <VContainer
            fluid
            class="px-0"
          >
            <RouterView v-slot="{ Component }">
              <template v-if="Component">
                <Transition
                  name="zoom-fade"
                  mode="out-in"
                >
                  <Suspense
                    :timeout="0"
                    @fallback="isFallbackStateActive = true"
                    @resolve="isFallbackStateActive = false"
                  >
                    <component :is="Component" />
                  </Suspense>
                </Transition>
              </template>
            </RouterView>
          </VContainer>
        </div>
      </div>
    </VMain>
  </VLayout>
</template>

<style lang="scss" scoped>
.bg-sidebar {
  background-color: #252833 !important;
}

.custom-layout :deep(.v-navigation-drawer) {
  border-inline-end: none !important;
}

.custom-layout :deep(.v-navigation-drawer__content) {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.sidebar-inner {
  min-height: 0;
}

.sidebar-nav {
  min-height: 0;

  :deep(.v-list) {
    background-color: transparent !important;
  }
}

// В rail-режимі (не hovered) ховаємо текст та стрілки лише в sidebar-nav
.custom-layout :deep(.v-navigation-drawer--rail:not(.v-navigation-drawer--is-hovering) .sidebar-nav .v-list-item__content),
.custom-layout :deep(.v-navigation-drawer--rail:not(.v-navigation-drawer--is-hovering) .sidebar-nav .v-list-item__append) {
  display: none !important;
}

.custom-layout :deep(.v-navigation-drawer--rail:not(.v-navigation-drawer--is-hovering) .sidebar-nav .v-list-group__items) {
  display: none !important;
}

.custom-layout :deep(.v-navigation-drawer--rail:not(.v-navigation-drawer--is-hovering) .sidebar-nav .v-list-subheader) {
  background-image: linear-gradient(
    transparent calc(50% - 0.5px),
    rgba(var(--v-theme-on-sidebar), .45) calc(50% - 0.5px),
    rgba(var(--v-theme-on-sidebar), .45) calc(50% + 0.5px),
    transparent calc(50% + 0.5px)
  ) !important;
  background-size: 20px 100% !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
}

.custom-layout :deep(.v-navigation-drawer--rail:not(.v-navigation-drawer--is-hovering) .sidebar-nav .v-list-subheader__text) {
  visibility: hidden !important;
}

.custom-layout :deep(.v-navigation-drawer .v-list-item-title),
.custom-layout :deep(.v-navigation-drawer .v-list-item__prepend .v-icon) {
  color: white !important;
}

.custom-layout :deep(.v-navigation-drawer .v-list-item--active .v-list-item__overlay),
.custom-layout :deep(.v-navigation-drawer .v-btn--active .v-btn__overlay) {
  background-color: rgba(255, 255, 255, 0.06) !important;
  opacity: 1 !important;
}

.layout-border-top {
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

.layout-border-bottom {
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}

.sidebar-menu-mode {
  color: rgba(var(--v-theme-on-sidebar), 0.56);
}
</style>
