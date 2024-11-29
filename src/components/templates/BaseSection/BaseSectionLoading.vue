<script setup lang="ts">
import { VColors } from '../../../@model/vuetify'

defineProps<{ loading: boolean }>()
</script>

<template>
  <div class="main-section-container">
    <Transition name="fade">
      <div
        v-show="loading"
        class="loader-overlay"
      >
        <VProgressCircular
          indeterminate
          size="64"
          data-test-id="loader"
          :color="VColors.Primary"
        />
      </div>
    </Transition>
    <div
      v-show="!loading"
      data-test-id="not-active-loader-content"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.main-section-container {
  position: relative;
}

.loader-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 90vh;
  background-color: rgb(var(--v-theme-surface));
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
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
