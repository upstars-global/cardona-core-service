<script setup lang="ts">
import { ref } from 'vue';

const sliderValues = ref([10, 60])
</script>

<template>
  <VRangeSlider v-model="sliderValues" />
</template>
