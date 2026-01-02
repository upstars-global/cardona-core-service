<script lang="ts" setup>
import { ref, watch } from 'vue'
import { isFunction } from 'lodash'
import { useSkins } from '../@core/composable/useSkins'

const { injectSkinClasses } = useSkins()

// ℹ️ This will inject classes in body tag for accurate styling
injectSkinClasses()

// SECTION: Loading Indicator
const isFallbackStateActive = ref(false)
const refLoadingIndicator = ref<any>(null)

// watching if the fallback state is active and the refLoadingIndicator component is available
watch([isFallbackStateActive, refLoadingIndicator], () => {
  const indicator = refLoadingIndicator.value as any

  if (isFallbackStateActive.value && indicator && isFunction(indicator.fallbackHandle))
    indicator.fallbackHandle()

  if (!isFallbackStateActive.value && indicator && isFunction(indicator.resolveHandle))
    indicator.resolveHandle()
}, { immediate: true })
</script>

<template>
  <AppLoadingIndicator ref="refLoadingIndicator" />

  <div class="layout-wrapper layout-blank">
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
  </div>
</template>

<style>
.layout-wrapper.layout-blank {
  flex-direction: column;
}
</style>
