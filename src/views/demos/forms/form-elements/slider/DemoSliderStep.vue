<script lang="ts" setup>
import { ref } from 'vue';

const value = ref(0)
</script>

<template>
  <VSlider
    v-model="value"
    :min="0"
    :max="1"
    :step="0.2"
    thumb-label
  />
</template>
