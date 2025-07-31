<script setup lang="ts">
import { computed } from 'vue'
import { VColors } from '../@model/vuetify'

const props = withDefaults(defineProps<{
  size?: number
  color?: VColors
  pulseScale?: number
}>(), {
  size: 10,
  color: VColors.Primary,
  pulseScale: 1.5,
})

const dotSpacing = computed(() => props.size * 0.8)
const bgClass = computed(() => `bg-${props.color}`)
</script>

<template>
  <div
    class="vue-loader"
    :style="{
      '--dot-size': `${size}px`,
      '--dot-spacing': `${dotSpacing}px`,
      '--pulse-scale': pulseScale,
    }"
  >
    <span
      class="dot-item dot-edge"
      :class="bgClass"
    />
    <span
      class="dot-item dot-center"
      :class="bgClass"
    />
    <span
      class="dot-item dot-edge"
      :class="bgClass"
    />
  </div>
</template>

<style scoped>
.vue-loader {
  display: flex;
  align-items: center;
  justify-content: center;
}

.dot-item {
  display: inline-block;
  width: var(--dot-size);
  height: var(--dot-size);
  margin: 0 var(--dot-spacing);
  border-radius: 50%;
  transform-origin: center center;
  animation-duration: 0.8s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

.dot-edge,
.dot-edge {
  animation-name: pulse;
}

.dot-center {
  animation-name: pulse-reverse;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50%     { transform: scale(var(--pulse-scale)); }
}

@keyframes pulse-reverse {
  0%, 100% { transform: scale(var(--pulse-scale)); }
  50%     { transform: scale(1); }
}
</style>
