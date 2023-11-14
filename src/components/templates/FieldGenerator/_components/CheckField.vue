<template>
  <b-form-checkbox v-model="modelValue" :disabled="disabled">
    {{ field.label }}
  </b-form-checkbox>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CheckBaseField } from '../../../../@model/baseField'

type CheckFieldProps = {
  value?: boolean
  field: CheckBaseField
  disabled?: boolean
}

const props = withDefaults(defineProps<CheckFieldProps>(), {
  value: false,
})

const emit = defineEmits<{
  (event: 'input', value: boolean): void
}>()

const modelValue = computed({
  get: () => props.value,
  set: (value) => emit('input', value),
})
</script>
