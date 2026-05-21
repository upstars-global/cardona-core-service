<script setup lang="ts">
import { useDisplay, useTheme } from 'vuetify'

import {CoreLayouts, CoreLayoutsMap} from './@model/layouts'
import { useLayoutChanger } from './composables/useLayoutChanger'
import ScrollToTop from '@core/components/ScrollToTop.vue'
import initCore from '@core/initCore'
import { initConfigStore, useConfigStore } from '@core/stores/config'
import { hexToRgb } from '@layouts/utils'

const { global } = useTheme()

// ℹ️ Sync current theme with initial loader theme

initCore()
initConfigStore()

const configStore = useConfigStore()

const { activeLayout } = useLayoutChanger(CoreLayoutsMap, CoreLayouts.Island)

const { name } = useDisplay()
</script>

<template>
  <VLocaleProvider :rtl="configStore.isAppRTL">
    <!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
    <VApp
      :class="name"
      :style="`--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}`"
    >
      <Component :is="activeLayout">
        <template #default="{ isFallbackStateActive }: {isFallbackStateActive: boolean}">
          <RouterView v-slot="{ Component }">
            <template v-if="Component">
              <ScrollToTop />
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
        </template>
      </Component>
    </VApp>
  </VLocaleProvider>
</template>
