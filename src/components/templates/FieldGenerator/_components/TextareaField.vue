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
  set: value => {
    emit('update:modelValue', value)
  },
})
</script>

<template>
  <AppTextarea
    v-model="localModelValue"
    :placeholder="field.label"
    :state="errors ? false : null"
    no-resize
    :counter="field.maxLength"
    :maxlength="field.maxLength"
    :disabled="disabled"
    :persistent-counter="field.maxLength"
  />
</template>
