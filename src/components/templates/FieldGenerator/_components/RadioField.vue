<template>
  <b-form-radio-group v-model="modelValue" :options="field.options" :disabled="disabled" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RadioBaseField } from '../../../../@model/baseField'

type RadioFieldProps = {
  value?: string | boolean
  field: RadioBaseField
  disabled?: boolean
}

const props = withDefaults(defineProps<RadioFieldProps>(), {
  value: '',
})

const emit = defineEmits<{
  (event: 'input', value: string | boolean): void
}>()

const modelValue = computed({
  get: () => props.value,
  set: (value) => emit('input', value),
})
</script>
