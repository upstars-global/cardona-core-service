<script setup lang="ts">
import { computed } from 'vue'
import {TextareaBaseField} from "../../../../@model/templates/baseField";

type TextareaFieldProps = {
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
  set: (value) => emit('update:modelValue', value),
})

</script>

<template>
  <AppTextarea
    v-model="localModelValue"
    :placeholder="field.label"
    :state="errors ? false : null"
    no-resize
    :counter="field.maxLength"
    :disabled="disabled"
    persistent-counter
  />
</template>
