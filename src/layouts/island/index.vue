<script lang="ts" setup>
import { computed, onUnmounted, ref, watch } from 'vue'
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

const configStore = useConfigStore()
const layoutConfigStore = useLayoutConfigStore()

// Island sidebar is always in mini mode (expands on hover), no toggle button.
// Save the default layout's collapse preference and restore it on unmount
// so navigating back to default doesn't change the user's pin state.
const prevCollapsed = layoutConfigStore.isVerticalNavCollapsed

// layoutConfigStore.isVerticalNavCollapsed = true
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
</script>

<template>
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
</template>

<style lang="scss">
// As we are using `layouts` plugin we need its styles to be imported
// @use "default-layout";
@import "../../assets/styles/layouts/island/index";

.theme-btn {
  background-color: rgba(var(--v-theme-primary), 0.03)
}
</style>
