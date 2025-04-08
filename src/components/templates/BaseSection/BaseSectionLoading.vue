<script setup lang="ts">
import { computed } from 'vue'
import { VColors } from '../../../@model/vuetify'

interface Props {
  loading: boolean
  fullscreenBackground?: boolean
}

const props = withDefaults(defineProps<Props>(), { fullscreenBackground: false })

const canShowSlot = computed(() => {
  if (props.fullscreenBackground)
    return !props.loading

  return true
})
</script>

<template>
  <div class="position-relative">
    <slot v-if="canShowSlot" />

    <div
      v-if="props.loading"
      class="custom-overlay d-flex justify-center align-center"
      data-test-id="loader"
      :class="{
        'custom-overlay--fullscreen': fullscreenBackground,
      }"
    >
      <VProgressCircular
        size="40"
        indeterminate
        :color="VColors.Primary"
      />
    </div>
  </div>
</template>

<style scoped>
.custom-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  background-color: white;

}

.custom-overlay--fullscreen {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 90vh;
}
</style>
