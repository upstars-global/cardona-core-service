<script setup lang="ts">
import { computed } from 'vue'
import type { FieldInfo } from '../../../../@model/field'

const props = defineProps<{
  modelValue: boolean
  field: FieldInfo
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
  />
</template>
