<script lang="ts" setup>
import { ref, watch } from 'vue'
import AppLoadingIndicator from '../components/AppLoadingIndicator.vue'
import { useSkins } from '../@core/composable/useSkins'
import AppBreadcrumb from '../layouts/components/AppBreadcrumb.vue'
import navItems from '@/navigation/vertical'
import { VerticalNavLayout } from '@layouts'

import { switchToVerticalNavOnLtOverlayNavBreakpoint } from '@layouts/utils'

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
</script>

<template>
  <VerticalNavLayout :nav-items="navItems">
    <!-- 👉 navbar -->
    <template #navbar>
      <AppBreadcrumb />
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
@use "@layouts/styles/default-layout";
</style>
