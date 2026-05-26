<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { useElementHover, useWindowSize } from '@vueuse/core'
import { computed, provide, ref, watch } from 'vue'
import type { Component } from 'vue'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { convertUpperCaseFirstSymbol } from '../../../helpers'
import { IconsList } from '../../../@model/enums/icons'
import ProjectSelect from '../../../layouts/default/components/ProjectSelect.vue'
import { VVariants } from '../../../@model/vuetify'
import { useUserStore } from '../../../stores/user'
import { useAppConfigCoreStore } from '../../../stores/appConfigCore'
import ProductsSelect from '../../../layouts/default/components/ProductSelect.vue'
import CustomMenu from './CustomMenu.vue'
import { layoutConfig } from '@layouts'
import { VerticalNavGroup, VerticalNavLink, VerticalNavSectionTitle } from '@layouts/components'
import { useLayoutConfigStore } from '@layouts/stores/config'
import { injectionKeyIsVerticalNavHovered } from '@layouts/symbols'
import type { NavGroup, NavLink, NavSectionTitle, VerticalNavItems } from '@layouts/types'

interface Props {
  tag?: string | Component
  navItems: VerticalNavItems
  isOverlayNavActive: boolean
  toggleIsOverlayNavActive: (value: boolean) => void
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'aside',
})

const refNav = ref()
const userStore = useUserStore()
const isHovered = useElementHover(refNav)

provide(injectionKeyIsVerticalNavHovered, isHovered)

const configStore = useLayoutConfigStore()

const resolveNavItemComponent = (item: NavLink | NavSectionTitle | NavGroup): unknown => {
  if ('heading' in item)
    return VerticalNavSectionTitle
  if ('children' in item)
    return VerticalNavGroup

  return VerticalNavLink
}

/*
  ℹ️ Close overlay side when route is changed
  Close overlay vertical nav when link is clicked
*/
const route = useRoute()
const appConfigCoreStore = useAppConfigCoreStore()

watch(() => route.name, () => {
  props.toggleIsOverlayNavActive(false)
})

const isVerticalNavScrolled = ref(false)
const updateIsVerticalNavScrolled = (val: boolean) => isVerticalNavScrolled.value = val

const handleNavScroll = (evt: Event) => {
  isVerticalNavScrolled.value = (evt.target as HTMLElement).scrollTop > 0
}

const hideTitleAndIcon = configStore.isVerticalNavMini(isHovered)

const { width } = useWindowSize()

const isMinMode = computed(() => width.value < 1279)

watch(() => isMinMode.value, () => {
  if (!isMinMode.value)
    configStore.toggleMenu(false)
  if (isMinMode.value)
    configStore.isVerticalNavCollapsed = false
})

const isNeocore = computed(() => userStore.isNeocore)
const isMenuTypeMain = computed(() => appConfigCoreStore.isMenuTypeMain)
const isMarbella = computed(() => userStore.isMarbella)
const projects = computed(() => userStore.projectsBySelectedProduct)

const selectedProjectTitle = computed(() =>
  isNeocore.value
    ? userStore.getSelectedProject?.publicName
    : convertUpperCaseFirstSymbol(userStore.getSelectedProject?.name),
)

const actualBackRoute = computed(() => {
  if (!isMenuTypeMain.value)
    return { name: 'UsersControlList' }

  return { path: '/' }
})

const defaultRoute = { path: '/' }

const canSelectProject = computed(() => isMenuTypeMain.value && isNeocore.value || isMenuTypeMain.value && isMarbella.value)
</script>

<template>
  <Component
    :is="props.tag"
    ref="refNav"
    class="layout-vertical-nav"
    :class="[
      {
        'hovered': isHovered,
        'visible': isOverlayNavActive,
        'scrolled': isVerticalNavScrolled,
        'show-menu': configStore.isHiddenMenu,
      },
    ]"
  >
    <!-- 👉 Header -->
    <div class="nav-header justify-space-between text-primary">
      <slot name="nav-header">
        <slot
          name="product-select"
          :is-collapsed-menu="configStore.isVerticalNavCollapsed && !isHovered"
        >
          <ProductsSelect :is-collapsed-menu="configStore.isVerticalNavCollapsed && !isHovered" />
        </slot>
        <!-- 👉 Vertical nav actions -->
        <!-- Show toggle collapsible in >md and close button in <md -->
        <Component
          :is="layoutConfig.app.iconRenderer || 'div'"
          v-show="configStore.isVerticalNavCollapsed"
          class="header-action d-none nav-unpin"
          :class="configStore.isVerticalNavCollapsed && 'd-lg-block'"
          v-bind="layoutConfig.icons.verticalNavUnPinned"
          @click="configStore.isVerticalNavCollapsed = !configStore.isVerticalNavCollapsed"
        />
        <Component
          :is="layoutConfig.app.iconRenderer || 'div'"
          v-show="!configStore.isVerticalNavCollapsed"
          class="header-action d-none nav-pin"
          :class="!configStore.isVerticalNavCollapsed && 'd-lg-block'"
          v-bind="layoutConfig.icons.verticalNavPinned"
          @click="configStore.isVerticalNavCollapsed = !configStore.isVerticalNavCollapsed"
        />
        <Component
          :is="layoutConfig.app.iconRenderer || 'div'"
          v-bind="layoutConfig.icons.close"
          class="header-action d-lg-none ml-1"
          @click="() => {
            toggleIsOverlayNavActive(false)
            configStore.toggleMenu(false)
          }"
        />
      </slot>
    </div>
    <ProjectSelect
      v-if="canSelectProject && projects.isNotEmpty"
      :projects="projects"
      :is-collapsed-menu="configStore.isVerticalNavCollapsed && !isHovered"
      class="mb-1"
      :class="{
        'px-4': isHovered || !configStore.isVerticalNavCollapsed,
        'px-2': !isHovered,
        'project-select--collapsed': configStore.isVerticalNavCollapsed && !isHovered,
      }"
    />
    <slot name="before-nav-items" />
    <div
      v-if="!isMenuTypeMain"
      class="d-flex align-center pb-4 pl-2"
    >
      <VBtn
        :prepend-icon="IconsList.ArrowLeftIcon"
        :variant="VVariants.Text"
        :to="defaultRoute"
      >
        {{ $t('action.back') }}
      </VBtn>
    </div>
    <slot
      name="nav-items"
      :update-is-vertical-nav-scrolled="updateIsVerticalNavScrolled"
    >
      <PerfectScrollbar
        :key="configStore.isAppRTL"
        tag="ul"
        class="nav-items"
        :options="{ wheelPropagation: false }"
        @ps-scroll-y="handleNavScroll"
      >
        <Component
          :is="resolveNavItemComponent(item)"
          v-for="(item, index) in navItems"
          :key="index"
          :item="item"
        />
      </PerfectScrollbar>
    </slot>
    <div
      class="mr-auto pt-3"
      :class="{
        'sidebar-custom_menu-padding': configStore.isVerticalNavCollapsed && !isHovered,
        'pl-4 custom_menu-top-divider': !configStore.isVerticalNavCollapsed || isHovered,
      }"
    >
      <div class="text-error" />
      <CustomMenu :is-collapsed-menu="configStore.isVerticalNavCollapsed && !isHovered" />
    </div>
  </Component>
  <div
    class="sidenav-overlay"
    :class="{ show: configStore.isHiddenMenu }"
    @click="configStore.toggleMenu(false)"
  />
</template>

<style lang="scss" scoped>
.sidebar-custom_menu-padding {
  padding-left: 10px;
}
.app-logo {
  display: flex;
  align-items: center;
  column-gap: 0.75rem;

  .app-logo-title {
    font-size: 1.375rem;
    font-weight: 700;
    line-height: 1.75rem;
    text-transform: capitalize;
  }

  .nav-item {
    :deep(.nav-item-title) {
      color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity)) !important;
    }
  }
}
</style>

<style lang="scss" scoped>
@use "@configured-variables" as variables;
@use "@layouts/styles/mixins";

.layout-vertical-nav-collapsed {
  transition: transform 0.3s ease-in-out;
}

.layout-vertical-nav {
  position: fixed;
  z-index: variables.$layout-vertical-nav-z-index;
  display: flex;
  flex-direction: column;
  block-size: 100%;
  inline-size: 252px; // neocore design (framework default: 260px)
  inset-block-start: 0;
  inset-inline-start: 0;
  transition: inline-size 0.25s ease-in-out, box-shadow 0.25s ease-in-out;
  will-change: transform, inline-size;
  overflow: hidden;

  .nav-header {
    display: flex;
    align-items: center;

    .header-action {
      cursor: pointer;

      @at-root {
        #{variables.$selector-vertical-nav-mini} .nav-header .header-action {
          &.nav-pin,
          &.nav-unpin {
            display: none !important;
          }
        }
      }
    }
  }

  .app-title-wrapper {
    margin-inline-end: auto;
  }

  .nav-items {
    block-size: 100%;
    height: calc(100vh - 125px);
  }

  .ps {
    position: static;
  }

  .nav-item-title {
    overflow: hidden;
    margin-inline-end: auto;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

}

.layout-vertical-nav-collapsed .layout-vertical-nav:not(.hovered) {
  inline-size: 52px;
}

@media (max-width: 1279px) {
  .layout-vertical-nav {
    &:not(.visible) {
      transform: translateX(-252px);

      @include mixins.rtl {
        transform: translateX(252px);
      }
    }

    transition: transform 0.25s ease-in-out;
  }
}

.sidenav-overlay {
  display: none;
  background-color: rgba(34, 41, 47, .5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 997;

  &.show {
    display: block;
  }
}

.show-menu {
  transform: translateX(0) !important;
}
.custom_menu-top-divider {
  position: relative;
  &::before {
    content: '';
    position: absolute;
    width: 220px;
    top: 0;
    left: 16px;
    right: 16px;
    height: 1px;
    background-color: rgba(255, 255, 255, 0.08);
  }
}
</style>
