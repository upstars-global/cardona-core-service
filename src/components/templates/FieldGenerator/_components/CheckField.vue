<script setup lang="ts">
import { computed } from 'vue'
import type { CheckBaseField } from '../../../../@model/templates/baseField'

const props = defineProps<{
  modelValue: boolean
  field: CheckBaseField
  disabled: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const localModelValue = computed({
  get: () => props.modelValue,
  set: value => emits('update:modelValue', value),
})
</script>

<template>
  <VCheckbox
    v-model="localModelValue"
    :disabled="disabled"
    :label="field.label"
    class="base-checkbox"
  />
</template>
