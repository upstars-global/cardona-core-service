<script lang="ts" setup>
import { ref } from 'vue';

const min = ref(-50)
const max = ref(90)
const slider = ref(40)
</script>

<template>
  <div class="d-flex justify-space-between">
    <VSlider
      v-model="slider"
      :max="max"
      :min="min"
      :step="1"
    />

    <AppTextField
      v-model="slider"
      type="number"
      placeholder="10"
      style="max-inline-size: 5rem;"
    />
  </div>
</template>
