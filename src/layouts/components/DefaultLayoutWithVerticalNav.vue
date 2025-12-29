<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import AppLoadingIndicator from '../../components/AppLoadingIndicator.vue'
import AppBreadcrumb from './AppBreadcrumb.vue'
import rawNavItems from '@/navigation/vertical/'
import { VerticalNavLayout } from '@layouts'

const isFallbackStateActive = ref(false)
const refLoadingIndicator = ref<any>(null)

watch([isFallbackStateActive, refLoadingIndicator], () => {
  if (isFallbackStateActive.value && refLoadingIndicator.value)
    refLoadingIndicator.value.fallbackHandle()

  if (!isFallbackStateActive.value && refLoadingIndicator.value)
    refLoadingIndicator.value.resolveHandle()
}, { immediate: true })

type AnyNavItem = Record<string, any>

const normalizeNavItem = (item: AnyNavItem): AnyNavItem | null => {
  if (!item || typeof item !== 'object')
    return null

  const normalized: AnyNavItem = { ...item }

  if (typeof normalized.title !== 'string' || !normalized.title.trim())
    return null

  if (Array.isArray(normalized.children)) {
    normalized.children = normalized.children
      .map((child: AnyNavItem) => normalizeNavItem(child))
      .filter((x): x is AnyNavItem => Boolean(x))
  }

  return normalized
}

const actualItems = computed(() => {
  const source = (rawNavItems as any)?.value ?? rawNavItems
  const list = Array.isArray(source) ? source : []

  return list
    .map(item => normalizeNavItem(item as AnyNavItem))
    .filter((x): x is AnyNavItem => Boolean(x))
})
</script>

<template>
  <VerticalNavLayout
    v-if="actualItems.length"
    :nav-items="actualItems"
  >
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
