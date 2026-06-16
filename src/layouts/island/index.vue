<script lang="ts" setup>
import { computed, onUnmounted, ref, watch } from 'vue'
import type { DefaultsOptions } from 'vuetify'
import { VColors, VSizes, VVariants } from '../../@model/vuetify'
import { IconsList } from '../../@model/enums/icons'
import AppLoadingIndicator from '../../components/AppLoadingIndicator.vue'
import AppBreadcrumb from '../components/AppBreadcrumb.vue'
import ProductsSelect from '../default/components/ProductSelect.vue'
import { useSkins } from '@core/composable/useSkins'
import { useAppsAndPages } from '@/navigation/vertical/apps-and-pages'
import { VerticalNavLayout } from '@layouts'
import { useLayoutConfigStore } from '@layouts/stores/config'
import { useConfigStore } from '@core/stores/config'
import { switchToVerticalNavOnLtOverlayNavBreakpoint } from '@layouts/utils'
import { Theme } from '@core/enums'
import { light as islandLight, dark as islandDark, bodyLayoutVarKeys, bodyThemeColorKeys } from './theme'

const configStore = useConfigStore()
const layoutConfigStore = useLayoutConfigStore()

// Island sidebar is always in mini mode (expands on hover), no toggle button.
// Save the default layout's collapse preference and restore it on unmount
// so navigating back to default doesn't change the user's pin state.
const prevCollapsed = layoutConfigStore.isVerticalNavCollapsed

onUnmounted(() => {
  layoutConfigStore.isVerticalNavCollapsed = prevCollapsed
})

const { appsAndPages } = useAppsAndPages()

const navItems = computed(() => {
  return appsAndPages.value
})

switchToVerticalNavOnLtOverlayNavBreakpoint()

const { layoutAttrs, injectSkinClasses } = useSkins()

injectSkinClasses()

const isFallbackStateActive = ref(false)
const refLoadingIndicator = ref<any>(null)

watch([isFallbackStateActive, refLoadingIndicator], () => {
  if (isFallbackStateActive.value && refLoadingIndicator.value)
    refLoadingIndicator.value.fallbackHandle()

  if (!isFallbackStateActive.value && refLoadingIndicator.value)
    refLoadingIndicator.value.resolveHandle()
}, { immediate: true })

const isActiveDarkTheme = computed<boolean>(() => configStore.theme === Theme.Dark)

const onCLickThemeIcon = () => {
  configStore.theme = isActiveDarkTheme.value ? Theme.Light : Theme.Dark
}

// ── VThemeProvider + body var sync ─────────────────────────────────────────
// VThemeProvider activates 'island-light' / 'island-dark', scoping all
// Vuetify CSS custom properties (--v-theme-*) to the island layout tree.
//
// Body-level CSS vars sync:
// CSS vars cascade DOWN only. <body> is ABOVE VThemeProvider, so body-level
// SCSS rules (body[data-layout="island"]) — especially those targeting teleported
// elements (flatpickr, appendToBody dropdowns) — cannot inherit from VThemeProvider.
// We mirror the needed vars onto document.body.style via this watcher.
//
//   bodyLayoutVarKeys → --v-<key>        (from theme.variables)
//   bodyThemeColorKeys → --v-theme-<key> (from theme.colors, stored as R,G,B)
const islandTheme = computed(() => isActiveDarkTheme.value ? 'island-dark' : 'island-light')

// Mirrors Vuetify's internal hex→RGB conversion for theme variables.
const hexToRgbTriplet = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}

const syncBodyVars = (theme: 'island-dark' | 'island-light') => {
  const themeData = theme === 'island-dark' ? islandDark : islandLight
  const vars = themeData.variables as Record<string, unknown>
  const colors = themeData.colors as Record<string, string>

  // --v-<key>: sync island variables (hex values converted to RGB to match Vuetify output)
  bodyLayoutVarKeys.forEach(key => {
    const value = String(vars[key])
    document.body.style.setProperty(`--v-${key}`, value.startsWith('#') ? hexToRgbTriplet(value) : value)
  })

  // --v-theme-<key>: R,G,B — sync island colors needed by teleported elements
  bodyThemeColorKeys.forEach(key => {
    document.body.style.setProperty(`--v-theme-${key}`, hexToRgbTriplet(colors[key]))
  })
}

watch(islandTheme, syncBodyVars, { immediate: true })

onUnmounted(() => {
  bodyLayoutVarKeys.forEach(key => document.body.style.removeProperty(`--v-${key}`))
  bodyThemeColorKeys.forEach(key => document.body.style.removeProperty(`--v-theme-${key}`))
})

// Island-specific Vuetify component defaults.
// Classes are injected via VDefaultsProvider so they only apply within the island
// layout tree. CSS hooks on these classes live in assets/styles/layouts/island/.
const islandDefaults: DefaultsOptions = {
  VTextField: { class: 'island-text-field' },
  VAutocomplete: {
    class: 'island-text-field',
    // Preserve global contentClass for VAutocomplete; add island dropdown class
    menuProps: { contentClass: 'island-dropdown-menu app-autocomplete__content v-autocomplete__content' },
  },
  VSelect: {
    class: 'island-text-field',
    menuProps: { contentClass: 'island-dropdown-menu' },
  },
  VCombobox: {
    class: 'island-text-field',
    menuProps: { contentClass: 'island-dropdown-menu' },
  },
  VFileInput: { class: 'island-text-field' },
  VTextarea: { class: 'island-text-field' },
  VMenu: { contentClass: 'island-dropdown-menu' },
}
</script>

<template>
  <VThemeProvider :theme="islandTheme" style="display: contents">
  <VDefaultsProvider :defaults="islandDefaults">
  <VerticalNavLayout
    class="island-layout"
    :nav-items="navItems"
  >
    <!-- 👉 navbar -->
    <template #navbar>
      <AppBreadcrumb>
        <template #content-right>
          <VBtn
            :variant="VVariants.Text"
            :size="VSizes.XSmall"
            :color="VColors.Primary"
            rounded="lg"
            icon
            class="theme-btn ml-2"
            :active="isActiveDarkTheme"
            @click="onCLickThemeIcon"
          >
            <VIcon
              :icon="IconsList.MoonIcon"
              :size="20"
            />
          </VBtn>
        </template>
      </AppBreadcrumb>
    </template>
    <template #product-select="{ isCollapsedMenu }">
      <slot
        name="product-select"
        :is-collapsed-menu="isCollapsedMenu"
      >
        <ProductsSelect :is-collapsed-menu="isCollapsedMenu" />
      </slot>
    </template>

    <AppLoadingIndicator ref="refLoadingIndicator" />

    <!-- 👉 Pages -->
    <slot :is-fallback-state-active="isFallbackStateActive">
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
    </slot>

    <!-- 👉 Footer -->
    <template #footer>
      <slot name="footer" />
    </template>

    <!-- 👉 Customizer -->
  </VerticalNavLayout>
  </VDefaultsProvider>
  </VThemeProvider>
</template>

<style lang="scss">
// As we are using `layouts` plugin we need its styles to be imported
// @use "default-layout";
@import "../../assets/styles/layouts/island/index";

.theme-btn {
  background-color: rgba(var(--v-theme-primary), 0.03)
}
</style>
