<script lang="ts" setup>
import { ref, watch } from 'vue'

// Components
import AppLoadingIndicator from '../../components/AppLoadingIndicator.vue'
import AppBreadcrumb from './AppBreadcrumb.vue'
import navItems from '@/navigation/vertical'

// @layouts plugin
import { VerticalNavLayout } from '@layouts'

// SECTION: Loading Indicator
const isFallbackStateActive = ref(false)
const refLoadingIndicator = ref<any>(null)

// watching if the fallback state is active and the refLoadingIndicator component is available
watch([isFallbackStateActive, refLoadingIndicator], () => {
  if (isFallbackStateActive.value && refLoadingIndicator.value)
    refLoadingIndicator.value.fallbackHandle()

  if (!isFallbackStateActive.value && refLoadingIndicator.value)
    refLoadingIndicator.value.resolveHandle()
}, { immediate: true })

// !SECTION
</script>

<template>
  <VerticalNavLayout :nav-items="navItems">
    <!-- 👉 navbar -->
    <template #navbar>
      <AppBreadcrumb />
    </template>

    <AppLoadingIndicator ref="refLoadingIndicator" />

    <!-- 👉 Pages -->
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
            <Component :is="Component" />
          </Suspense>
        </Transition>
      </template>
    </RouterView>

    <!-- 👉 Footer -->
    <template #footer>
      <slot name="footer" />
    </template>

    <!-- 👉 Customizer -->
  </VerticalNavLayout>
</template>
