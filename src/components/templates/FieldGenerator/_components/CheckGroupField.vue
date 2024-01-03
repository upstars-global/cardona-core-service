<script setup lang="ts">
import { computed } from 'vue'
import type { CheckGroupBaseField } from '../../../../@model/templates/baseField'

const props = defineProps<{
  modelValue: boolean
  field: CheckGroupBaseField
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
    v-for="option in field.options"
    :key="option.id"
    v-model="localModelValue"
    :value="option.id"
    :disabled="option.disabled"
    :name="`check-group-field-${field.key}`"
    :label="option.name"
    class="mt-75"
  />
</template>
