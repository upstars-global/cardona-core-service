<script setup lang="ts">
import { VColors } from '../../../@model/vuetify'

defineProps<{ loading: boolean }>()
</script>

<template>
  <div>
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
    <div v-show="!loading">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.loader-overlay {
  width: 100%;
  height: calc(100vh - 10rem);
  background-color: rgb(var(--v-theme-surface));
  display: flex;
  justify-content: center;
  align-items: center;
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
