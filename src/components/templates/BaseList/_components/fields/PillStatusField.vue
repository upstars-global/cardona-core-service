<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  isActive?: boolean
}>()

const statusClass = computed(() => (props.isActive ? 'active' : 'inactive'))
</script>

<template>
  <div
    class="circle-status"
    data-test-id="pill-status"
    :class="statusClass"
  />
</template>

<style lang="scss">
.circle-status {
  position: relative;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  margin: 0.286rem;

  &.active:before,
  &.inactive:before,
  &.creation:before,
  &.updating:before,
  &.deleting:before {
    content: '';
    display: block;
    background: rgb(var(--v-theme-warning));
    position: absolute;
    top: -0.286rem;
    left: -0.286rem;
    border-radius: 50%;
    width: 1.071rem;
    height: 1.071rem;
    opacity: 0.12;
  }

  &.active, &.creation {
    background: rgb(var(--v-theme-success));
    &:before {
      background: rgb(var(--v-theme-success));
    }
  }

  &.inactive, &.updating {
    background: rgb(var(--v-theme-warning));
    &:before {
      background:rgb(var(--v-theme-warning));
    }
  }

  &.deleting {
    background: rgb(var(--v-theme-error));
    &:before {
      background: rgb(var(--v-theme-error));
    }
  }
}
</style>
