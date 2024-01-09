<script lang="ts" setup>
import { ref } from 'vue';

const textareaValue = ref('Hello!')
const rules = [(v: string) => v.length <= 25 || 'Max 25 characters']
</script>

<template>
  <AppTextarea
    v-model="textareaValue"
    label="Validation"
    :rules="rules"
    rows="2"
    placeholder="Placeholder Text"
  />
</template>
