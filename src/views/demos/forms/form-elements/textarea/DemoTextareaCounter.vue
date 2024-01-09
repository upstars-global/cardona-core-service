<script lang="ts" setup>
import { ref } from 'vue';

const textareaValue = ref('Hello!')
</script>

<template>
  <AppTextarea
    v-model="textareaValue"
    counter
    label="Text"
    placeholder="Placeholder Text"
  />
</template>
