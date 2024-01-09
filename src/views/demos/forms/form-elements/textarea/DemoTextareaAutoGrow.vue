<script setup lang="ts">
import { ref } from 'vue';

const textareaValue = ref('The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through.')
</script>

<template>
  <AppTextarea
    v-model="textareaValue"
    label="Auto Grow"
    placeholder="Placeholder Text"
    auto-grow
  />
</template>
