<script setup lang="ts">
import { useTheme } from 'vuetify'

import { CoreLayoutsMap } from './@model/layouts'
import ScrollToTop from '@core/components/ScrollToTop.vue'
import initCore from '@core/initCore'
import { initConfigStore, useConfigStore } from '@core/stores/config'
import { hexToRgb } from '@layouts/utils'
import { useLayoutChanger } from '@core/composable/useLayoutChanger'

const { global } = useTheme()

// ℹ️ Sync current theme with initial loader theme

initCore()
initConfigStore()

const configStore = useConfigStore()

const { activeLayout } = useLayoutChanger(CoreLayoutsMap)
</script>

<template>
  <VLocaleProvider :rtl="configStore.isAppRTL">
    <!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
    <VApp :style="`--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}`">
      <Component :is="activeLayout" />
      <ScrollToTop />
    </VApp>
  </VLocaleProvider>
</template>
