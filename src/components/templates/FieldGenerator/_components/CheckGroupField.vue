<template>
  <b-form-group :disabled="disabled">
    <b-form-checkbox
      v-for="option in field.options"
      :key="option.id"
      v-model="modelValue"
      :value="option.id"
      :disabled="option.disabled"
      :name="`check-group-field-${field.key}`"
      class="mt-75"
    >
      {{ option.name }}
    </b-form-checkbox>
  </b-form-group>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CheckGroupBaseField } from '../../../../@model/baseField'

type CheckGroupFieldProps = {
  value?: string[]
  field: CheckGroupBaseField
  disabled?: boolean
}

const props = withDefaults(defineProps<CheckGroupFieldProps>(), {
  value: () => [],
})

const emit = defineEmits<{
  (event: 'input', value: string[]): void
}>()

const modelValue = computed({
  get: () => props.value,
  set: (value) => emit('input', value),
})
</script>
