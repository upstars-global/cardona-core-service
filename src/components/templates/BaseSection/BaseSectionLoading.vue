<script setup lang="ts">
import { VColors } from '../../../@model/vuetify'

defineProps<{ loading: boolean }>()
</script>

<template>
  <div>
    <Transition name="fade">
      <div
        v-if="loading"
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
    <slot v-if="!loading" />
  </div>
</template>

<style scoped lang="scss">
.loader-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100vh - 10rem);
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
