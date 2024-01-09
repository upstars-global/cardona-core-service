<script setup lang="ts">
import { ref } from 'vue';

const dateRange = ref('')
</script>

<template>
  <AppDateTimePicker
    v-model="dateRange"
    label="Range"
    placeholder="Select date"
    :config="{ mode: 'range' }"
  />
</template>
