<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CustomMenu from '../components/CustomMenu.vue'
import ProductsSelect from '../../@layouts/components/ProductsSelect.vue'
import ProjectSelect from '../../@layouts/components/ProjectSelect.vue'
import { useAppsAndPages } from '../../navigation/vertical/apps-and-pages'
import { useUserStore } from '../../stores/user'
import { IconsList } from '@/@model/enums/icons'

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
          active-color="primary"
          size="40"
        />
      </div>

      <VList
        v-else
        nav
        class="py-1"
      >
        <VListItem
          v-for="item in navItems"
          :key="item.title"
          :prepend-icon="item.icon?.icon"
          :title="t(item.title)"
          :to="item.to"
          rounded="lg"
          active-color="primary"
        />
      </VList>

      <template #append>
        <CustomMenu :is-collapsed-menu="isCollapsed" />
      </template>
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
    <VMain>
      <div class="bg-sidebar w-100 h-100 pl-2 pr-2 pb-2 overflow-auto">
        <div class="bg-surface w-100 h-100 layout-border-bottom">
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

  .layout-border-top {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }

  .layout-border-bottom {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }
</style>
