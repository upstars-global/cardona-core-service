<script setup lang="ts">
import { ref } from 'vue';

const date = ref('')
</script>

<template>
  <AppDateTimePicker
    v-model="date"
    label="Default"
    placeholder="Select date"
  />
</template>
