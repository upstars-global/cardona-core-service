<script setup lang="ts">
import { computed } from 'vue'
import type { TextareaBaseField } from '../../../../@model/templates/baseField'
import AppTextarea from '../../../../@core/components/app-form-elements/AppTextarea.vue'

interface TextareaFieldProps {
  modelValue?: string
  field: TextareaBaseField
  disabled?: boolean
  errors?: boolean
}

const props = withDefaults(defineProps<TextareaFieldProps>(), {
  modelValue: '',
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const localModelValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const validateMaxLength = (event: any) => {
  if (props.field.maxLength && event.target.value.length >= props.field.maxLength) {
    const value = event.target.value.slice(0, props.field.maxLength - 1)

    localModelValue.value = value
    event.target.value = value
  }
  else {
    localModelValue.value = event.target.value
  }
}
</script>

<template>
  <AppTextarea
    :model-value="localModelValue"
    :placeholder="field.label"
    :state="errors ? false : null"
    no-resize
    :counter="field.maxLength"
    :disabled="disabled"
    :persistent-counter="field.maxLength"
    @input="validateMaxLength"
  />
</template>
