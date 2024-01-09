<script lang="ts" setup>
import { ref } from 'vue';

const sliderValues = ref([20, 40])
</script>

<template>
  <VRangeSlider
    v-model="sliderValues"
    direction="vertical"
  />
</template>
