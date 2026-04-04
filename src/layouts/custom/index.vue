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
      :rail-width="64"
      width="260"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <div class="px-4 pt-4 pb-2 d-flex align-center justify-space-between">
        <ProductsSelect :is-collapsed-menu="isCollapsed" />
        <VIcon
          v-show="!isCollapsed"
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

      <!-- Collapsed: centered icon buttons -->
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

      <!-- Expanded: full list items -->
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
      elevation="1"
      height="64"
    >
      <VAppBarTitle>My App</VAppBarTitle>

      <template #append>
        <VBtn
          icon
          variant="text"
        >
          <VIcon icon="tabler-bell" />
        </VBtn>
      </template>
    </VAppBar>

    <VMain>
      <VContainer
        fluid
        class="pa-6"
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
    </VMain>
  </VLayout>
</template>
