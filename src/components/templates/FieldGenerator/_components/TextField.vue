<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TextBaseField } from '../../../../@model/templates/baseField'

const props = defineProps<{
  modelValue: string | number
  field: TextBaseField
  errors?: boolean
  disabled: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const inputType = 'text'
const appendText = ref(props.field?.append)

const localModelValue = computed({
  get: () => props.modelValue,
  set: value => {
    emits('update:modelValue', value)
  },
})
</script>

<template>
  <AppTextField
    v-model.trim="localModelValue"
    :placeholder="field.placeholder || field.label"
    :type="inputType"
    :disabled="disabled"
    :suffix="appendText"
    :error="errors"
    autocomplete="off"
  />
</template>
