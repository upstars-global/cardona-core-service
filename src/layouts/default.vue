<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useResizeObserver } from '@vueuse/core'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { useUserStore } from '../stores/user'
import { IconsList } from '../@model/enums/icons'
import { useAppConfigCoreStore } from '../stores/appConfigCore'
import NotificationExport from '../components/NotificationExport/index.vue'
import CustomMenu from './default/components/CustomMenu.vue'
import ProjectSelect from './default/components/ProjectSelect.vue'
import ProductsSelect from './default/components/ProductSelect.vue'
import SideBar from './default/components/SideBar.vue'
import AppBreadcrumb from './components/AppBreadcrumb.vue'
import { useSidebarCollapse } from './default/composables/useSidebarCollapse'
import { useAppsAndPages } from '@/navigation/vertical/apps-and-pages'

const { layoutConfigStore, isSmallScreen, isHovered, isCollapsed, handleMouseEnter, handleMouseLeave, toggleSidebar } = useSidebarCollapse()

const { appsAndPages } = useAppsAndPages()
const navItems = computed(() => appsAndPages.value)

const userStore = useUserStore()
const projects = computed(() => userStore.projectsBySelectedProduct)

const isFallbackStateActive = ref(false)

const appConfigCoreStore = useAppConfigCoreStore()
const isNeocore = computed(() => userStore.isNeocore)
const isMarbella = computed(() => userStore.isMarbella)
const isMenuTypeMain = computed(() => appConfigCoreStore.isMenuTypeMain)
const canSelectProject = computed(() => userStore.selectedProjectWithoutPriority && isMenuTypeMain.value && isNeocore.value || isMenuTypeMain.value && isMarbella.value)

const contentScrollEl = ref<HTMLElement | null>(null)

const route = useRoute()

watch(
  () => route.name,
  () => {
    contentScrollEl.value?.scrollTo({ top: 0, behavior: 'smooth' })
  },
)

const canShowNotificationExport = computed(() => userStore.haveSomePermissionReport)
const userId = computed(() => userStore.userInfo.id)

const psRef = ref<InstanceType<typeof PerfectScrollbar> | null>(null)
const sidebarNavRef = ref<HTMLElement | null>(null)

useResizeObserver(sidebarNavRef, () => {
  psRef.value?.update()
})
</script>

<template>
  <VLayout class="custom-layout">
    <VNavigationDrawer
      v-model="layoutConfigStore.isHiddenMenu"
      :rail="!isSmallScreen && layoutConfigStore.isVerticalNavCollapsed"
      :class="{ 'is-hovering': !isSmallScreen && layoutConfigStore.isVerticalNavCollapsed && isHovered }"
      :permanent="!isSmallScreen"
      :temporary="isSmallScreen"
      rail-width="64"
      class="bg-sidebar border-r-0"
      width="252"
      @mouseleave="handleMouseLeave"
      @mouseenter="handleMouseEnter"
    >
      <div class="sidebar-inner d-flex flex-column h-100">
        <div class="sidebar-top">
          <div class="pa-0 ma-0 pt-4 mx-4 sidebar-list-item">
            <div class="d-flex align-center justify-space-between">
              <ProductsSelect :is-collapsed-menu="isCollapsed" />
              <VIcon
                v-if="!isCollapsed && !isSmallScreen"
                class="sidebar-menu-mode"
                :icon="!layoutConfigStore.isVerticalNavCollapsed ? IconsList.CircleDotIcon : IconsList.CircleIcon"
                data-test-id="toggle-sidebar"
                @click="toggleSidebar"
              />
            </div>
          </div>

          <div class="pt-4 px-4 pb-1">
            <ProjectSelect
              v-if="canSelectProject"
              :projects="projects"
              :is-collapsed-menu="isCollapsed"
            />
          </div>
        </div>

        <PerfectScrollbar
          ref="psRef"
          tag="div"
          class="sidebar-scroll flex-grow-1"
          :options="{ wheelPropagation: false }"
        >
          <div
            ref="sidebarNavRef"
            class="sidebar-nav"
          >
            <SideBar
              :items="navItems"
              :is-collapsed="isCollapsed"
              :is-menu-type-main="isMenuTypeMain"
            />
          </div>
        </PerfectScrollbar>

        <div class="sidebar-bottom">
          <hr class="my-0 mx-4 custom-menu-devider">
          <VList
            bg-color="sidebar"
            density="compact"
            class="pa-0 mt-2 mb-3"
            height="42px"
          >
            <VListItem class="px-0 sidebar-list-item">
              <CustomMenu :is-collapsed-menu="isCollapsed" />
            </VListItem>
          </VList>
        </div>
      </div>
    </VNavigationDrawer>

    <VMain class="v-main--fullscreen">
      <div class="bg-sidebar w-100 h-100 pr-2 pb-2">
        <div
          ref="contentScrollEl"
          class="d-flex flex-column h-100 overflow-y-auto"
        >
          <div class="layout-appbar pt-2 d-flex flex-column">
            <div class="flex-grow-1 d-flex align-center pt-4 px-6 bg-surface layout-border-top">
              <AppBreadcrumb>
                <template #content-right="{ time }">
                  <VDivider
                    v-if="canShowNotificationExport"
                    class="mx-4"
                    vertical
                  />

                  <div
                    v-if="canShowNotificationExport"
                    cols="1"
                    class="d-flex align-center justify-end notification-export-wrapper"
                    data-test-id="notification-export"
                  >
                    <NotificationExport
                      :time="time"
                      :user-id="userId"
                    />
                  </div>
                </template>
              </AppBreadcrumb>
            </div>
          </div>
          <div class="bg-surface flex-grow-1 layout-border-bottom pa-4 pt-0 layout-page-content position-relative">
            <VContainer
              fluid
              class="px-0"
            >
              <slot
                :is-fallback-state-active="isFallbackStateActive"
                :content-scroll-el="contentScrollEl"
              >
                <RouterView />
              </slot>
            </VContainer>
          </div>
        </div>
      </div>
    </VMain>
  </VLayout>
</template>

<style lang="scss" scoped>
.bg-sidebar {
  background-color: rgb(var(--v-theme-sidebar)) !important;
}

.sidebar-inner {
  min-height: 0;
}

.sidebar-scroll {
  min-height: 0;
}

.sidebar-nav {
  :deep(.v-list) {
    background-color: transparent !important;
  }
}

.custom-layout {
  :deep(.v-navigation-drawer) {
    border-inline-end: none !important;

    .v-list-item-title,
    .v-list-item__prepend .v-icon {
      color: white !important;
    }

    .v-list-item--active .v-list-item__overlay,
    .v-btn--active .v-btn__overlay {
      background-color: rgba(255, 255, 255, 0.06) !important;
      opacity: 1 !important;
    }
  }

  :deep(.v-navigation-drawer--rail) {
    transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }

  :deep(.v-navigation-drawer--rail.is-hovering) {
    position: fixed !important;
    width: 252px !important;
    z-index: 1005;
  }

  :deep(.v-navigation-drawer--rail:not(.is-hovering) .sidebar-nav) {
    .v-list-item__content,
    .v-list-item__append,
    .v-list-group__items {
      display: none !important;
    }

    .v-list-subheader {
      background: linear-gradient(
        transparent calc(50% - 0.5px),
        rgba(var(--v-theme-on-sidebar), .45) calc(50% - 0.5px),
        rgba(var(--v-theme-on-sidebar), .45) calc(50% + 0.5px),
        transparent calc(50% + 0.5px)
      ) center / 12px 100% no-repeat !important;

      &__text {
        visibility: hidden !important;
      }
    }
  }
}

.sidebar-list-item {
  margin-inline: 16px;
}

.sidebar-menu-mode {
  color: rgba(var(--v-theme-on-sidebar), 0.56);
}

.v-main--fullscreen {
  height: 100dvh;
  overflow: hidden;
}

.layout-border-top {
  border-radius: 6px 6px 0 0;
}

.layout-border-bottom {
  border-radius: 0 0 6px 6px;
}

.overflow-y-auto:has(.loading-base-section) {
  overflow-y: hidden !important;
}

.custom-menu-devider {
  border-color: rgba(255, 255, 255, 0.08) !important;
}
</style>
