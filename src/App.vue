<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from 'vuetify'
import LayoutBlank from './layouts/blank.vue'
import LayoutDefault from './layouts/default.vue'
import ScrollToTop from '@core/components/ScrollToTop.vue'
import initCore from '@core/initCore'
import { initConfigStore, useConfigStore } from '@core/stores/config'
import { hexToRgb } from '@layouts/utils'

const { global } = useTheme()

// ℹ️ Sync current theme with initial loader theme

initCore()
initConfigStore()

const configStore = useConfigStore()
const route = useRoute()

const layoutActive = computed(() => {
  return route.meta?.layout === 'full' ? LayoutBlank : LayoutDefault
})

const layoutKey = computed(() => route.meta?.layout || '')
</script>

<template>
  <VLocaleProvider :rtl="configStore.isAppRTL">
    <!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
    <VApp :style="`--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}`">
      <Component
        :is="layoutActive"
        :key="layoutKey"
      />
      <!--      <RouterView /> -->
      <ScrollToTop />
    </VApp>
  </VLocaleProvider>
</template>
