<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
import { useSkins } from '../@core/composable/useSkins'

import { switchToVerticalNavOnLtOverlayNavBreakpoint } from '@layouts/utils'

const DefaultLayoutWithVerticalNav = defineAsyncComponent(() => import('./components/DefaultLayoutWithVerticalNav.vue'))

// ℹ️ This will switch to vertical nav when define breakpoint is reached when in horizontal nav layout
// Remove below composable usage if you are not using horizontal nav layout in your app
switchToVerticalNavOnLtOverlayNavBreakpoint()

const { layoutAttrs, injectSkinClasses } = useSkins()

injectSkinClasses()
</script>

<template>
  <Component
    v-bind="layoutAttrs"
    :is="DefaultLayoutWithVerticalNav"
  >
    <template
      v-for="(_, name) in $slots"
      :key="name"
      #[name]="slotProps"
    >
      <slot
        :name="name"
        v-bind="slotProps"
      />
    </template>
  </Component>
</template>

<style lang="scss">
// As we are using `layouts` plugin we need its styles to be imported
@use "@layouts/styles/default-layout";
</style>
