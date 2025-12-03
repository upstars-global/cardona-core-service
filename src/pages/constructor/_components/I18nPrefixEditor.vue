<script setup lang="ts">
import { VColors } from '../../../@model/vuetify'

defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
}>()

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="d-flex align-center mb-4">
    <div class="mr-2">
      <span>
        Prefix i18n
      </span>
    </div>
    <VTextField
      :model-value="modelValue"
      :placeholder="placeholder || 'meta'"
      hide-details
      density="compact"
      variant="outlined"
      :color="VColors.Primary"
      @update:model-value="$emit('update:modelValue', $event)"
    />
  </div>
</template>
