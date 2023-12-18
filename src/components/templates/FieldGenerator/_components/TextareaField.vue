<script setup lang="ts">
import { computed } from 'vue'
import {TextareaBaseField} from "../../../../@model/templates/baseField";

type TextareaFieldProps = {
  modelValue?: string
  field: TextareaBaseField
  disabled?: boolean
  errors?: string[]
}

const props = withDefaults(defineProps<TextareaFieldProps>(), {
  modelValue: '',
  errors: () => [],
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const localModelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

</script>

<template>
  <AppTextarea
    v-model="localModelValue"
    :placeholder="field.label"
    :state="errors.isNotEmpty ? false : null"
    no-resize
    :counter="field.maxLength"
    :rules="field.validationRules"
    :disabled="disabled"
    persistent-counter
  />
</template>
