<script setup lang="ts">
import { computed } from 'vue'
import type { NumberBaseField } from '../../../../@model/templates/baseField'

interface Props {
  value: string | number
  field: NumberBaseField
  errors?: Array<string>
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), { errors: () => [], value: '' })

const emits = defineEmits<{
  (e: 'update:modelValue', string: string | number): void
}>()

const modelValue = computed({
  get: () => props.value,
  set: value => {
    emits('input', props.field.withPositiveNumbers ? value.toString().replace(/-/g, '') : value)
  },
})

const onKeyDown = event => {
  if (props.field.withPositiveNumbers && event.key === '-')
    event.preventDefault()

  if (event.key === 'e')
    event.preventDefault()
}
</script>

<template>
  <AppTextField
    v-model.trim="modelValue"
    :placeholder="field.placeholder || field.label"
    :state="errors.isNotEmpty ? false : null"
    type="number"
    :disabled="disabled"
    autocomplete="off"
    :suffix="field?.append"
    @keydown="onKeyDown"
  />
</template>
