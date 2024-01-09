<script setup lang="ts">
import { ref } from 'vue';

const date = ref('')
</script>

<template>
  <AppDateTimePicker
    v-model="date"
    label="Inline"
    placeholder="Select Date"
    :config="{ inline: true }"
  />
</template>
