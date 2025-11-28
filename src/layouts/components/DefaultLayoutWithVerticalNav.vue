<script lang="ts" setup>
import { ref, watch } from 'vue'
import AppLoadingIndicator from '../../components/AppLoadingIndicator.vue'
import AppBreadcrumb from './AppBreadcrumb.vue'
import navItems from '@/navigation/vertical/'
import { VerticalNavLayout } from '@layouts'

// import { useAppsAndPages } from '@/navigation/vertical/apps-and-pages/index'
// const { appsAndPages } = useAppsAndPages()
//
// const navItems = computed(() => {
//   return appsAndPages.value
// })

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
