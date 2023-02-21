<template>
  <b-overlay
    variant="white"
    :show="showLoading"
    spinner-variant="primary"
    blur="0"
    opacity=".75"
    rounded="sm"
  >
    <slot />
  </b-overlay>
</template>

<script lang="ts">
import { BOverlay } from 'bootstrap-vue'
export default {
  name: 'CardLoader',
  components: {
    BOverlay,
  },
  props: {
    showLoading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
