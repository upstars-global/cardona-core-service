<script lang="ts" setup>
import { ref } from 'vue';

const slidersValues = ref([30, 60])
</script>

<template>
  <VRangeSlider
    v-model="slidersValues"
    disabled
    label="Disabled"
  />
</template>
