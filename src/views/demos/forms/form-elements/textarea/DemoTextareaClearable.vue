<script setup lang="ts">
import { ref } from 'vue';

const textareaValue = ref('This is clearable text.')
</script>

<template>
  <AppTextarea
    v-model="textareaValue"
    clearable
    clear-icon="tabler-circle-x"
    label="Text"
    placeholder="Placeholder Text"
  />
</template>
