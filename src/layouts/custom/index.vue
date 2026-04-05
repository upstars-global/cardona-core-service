<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ProductsSelect from '../../@layouts/components/ProductsSelect.vue'
import ProjectSelect from '../../@layouts/components/ProjectSelect.vue'
import { useAppsAndPages } from '../../navigation/vertical/apps-and-pages'
import { useUserStore } from '../../stores/user'
import { IconsList } from '../../@model/enums/icons'
import CustomMenu from './components/CustomMenu.vue'

const { t } = useI18n()
const { appsAndPages } = useAppsAndPages()
const navItems = computed(() => appsAndPages.value)

const userStore = useUserStore()
const projects = computed(() => userStore.projectsBySelectedProduct)

const drawer = ref(true)
const rail = ref(true)
const isHovered = ref(false)
const isFallbackStateActive = ref(false)

const isCollapsed = computed(() => rail.value && !isHovered.value)
</script>

<template>
  <VLayout class="custom-layout">
    <VNavigationDrawer
      v-model="drawer"
      :rail="isCollapsed"
      :rail-width="52"
      class="bg-sidebar border-r-0"
      width="252"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <div class="sidebar-inner d-flex flex-column h-100">
        <div class="sidebar-top">
          <div class="px-4 pt-4 pb-2 d-flex align-center justify-space-between">
            <ProductsSelect :is-collapsed-menu="isCollapsed" />
            <VIcon
              v-show="!isCollapsed"
              class="text-secondary"
              :icon="!rail ? IconsList.CircleDotIcon : IconsList.CircleIcon"
              @click="rail = !rail"
            />
          </div>

          <div
            v-if="userStore.selectedProjectWithoutPriority"
            class="px-4 pb-3"
          >
            <ProjectSelect
              :projects="projects"
              :is-collapsed="isCollapsed"
            />
          </div>
        </div>

        <div class="sidebar-nav flex-grow-1 overflow-y-auto">
          <div
            v-if="isCollapsed"
            class="d-flex flex-column align-center py-1 gap-1"
          >
            <VBtn
              v-for="item in navItems"
              :key="item.title"
              :icon="item.icon?.icon"
              :to="item.to"
              variant="text"
              rounded="lg"
              color="white"
              active-color="primary"
              size="40"
            />
          </div>

          <VList
            v-else
            nav
            bg-color="transparent"
            class="py-1 bg-sidebar"
          >
            <VListItem
              v-for="item in navItems"
              :key="item.title"
              :title="t(item.title)"
              :to="item.to"
              rounded="lg"
              active-color="primary"
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
          </VList>
        </div>

        <div class="sidebar-bottom">
          <CustomMenu :is-collapsed-menu="isCollapsed" />
        </div>
      </div>
    </VNavigationDrawer>

    <VAppBar
      :elevation="0"
      color="transparent"
      class="px-2 pt-2 bg-sidebar"
      height="64"
    >
      <div class="w-100 h-100 d-flex align-center px-4 bg-surface layout-border-top">
        <span class="text-h6 font-weight-medium">My App</span>
        <VSpacer />
        <VBtn
          icon
          variant="text"
        >
          <VIcon icon="tabler-bell" />
        </VBtn>
      </div>
    </VAppBar>
    <VMain style="height: 100dvh; overflow: hidden;">
      <div class="bg-sidebar w-100 h-100 pl-2 pr-2 pb-2 d-flex flex-column">
        <div class="bg-surface flex-grow-1 layout-border-bottom overflow-y-auto">
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
</style>
