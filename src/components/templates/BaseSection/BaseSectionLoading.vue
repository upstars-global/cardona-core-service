<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
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
    <div v-show="canShowSlot">
      <slot />
    </div>

    <div
      v-if="props.loading"
      class="loading-base-section d-flex justify-center align-center"
      data-test-id="loader"
    >
      <VProgressCircular
        size="40"
        indeterminate
        :color="VColors.Primary"
      />
    </div>

    <div
      v-else-if="props.loading"
      class="custom-overlay d-flex justify-center align-center"
      data-test-id="loader"
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


.loading-base-section {
  height: calc(100vh - 124px);
}
</style>
