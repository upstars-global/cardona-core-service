<script lang="ts" setup>
import { ref } from 'vue';

const value = ref(10)
</script>

<template>
  <VSlider
    v-model="value"
    direction="vertical"
  />
</template>
