<script setup lang="ts">
import { VColors } from '../../../@model/vuetify'

defineProps<{ loading: boolean }>()
</script>

<template>
  <Transition name="fade">
    <div
      v-if="loading"
      class="loader-overlay"
    >
      <VProgressCircular
        indeterminate
        size="64"
        :color="VColors.Primary"
      />
    </div>
  </Transition>
  <slot v-if="!loading" />
</template>

<style scoped lang="scss">
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  overflow: hidden;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
