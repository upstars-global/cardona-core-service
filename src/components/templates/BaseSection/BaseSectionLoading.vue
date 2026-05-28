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

const hasLayoutContent = ref(false)

onMounted(() => {
  hasLayoutContent.value = !!document.querySelector('.layout-page-content')
})
</script>

<template>
  <div class="position-relative overflow-hidden">
    <div v-show="canShowSlot">
      <slot />
    </div>

    <Teleport v-if="fullscreenBackground && hasLayoutContent" to=".layout-page-content">
      <div
        v-if="props.loading"
        class="custom-overlay custom-overlay--fullscreen d-flex justify-center align-center"
        data-test-id="loader"
      >
        <VProgressCircular
          size="40"
          indeterminate
          :color="VColors.Primary"
        />
      </div>
    </Teleport>

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

.custom-overlay--fullscreen {
  position: absolute;
  inset: 0;
  z-index: 10;
  background-color: white;
}
</style>
