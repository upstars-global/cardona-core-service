<script setup lang="ts">
import { VColors } from '../../../@model/vuetify'

interface Props {
  loading: boolean
  opacity?: number
  loader?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  opacity: 0.5,
  loader: true,
})
</script>

<template>
  <div
    class="v-overlay-wrapper"
    style="position: relative;"
  >
    <slot />

    <VOverlay
      :model-value="props.loading"
      :opacity="props.opacity"
      contained
      persistent
      scrim="rgba(255, 255, 255, 0.8) !important"
      class="
      d-flex
      align-center
      justify-center"
    >
      <VProgressCircular
        v-if="props.loader"
        size="40"
        indeterminate
        :color="VColors.Primary"
      />
    </VOverlay>
  </div>
</template>
