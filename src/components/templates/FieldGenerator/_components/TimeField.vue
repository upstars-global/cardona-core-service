<script setup lang="ts">
import { computed } from 'vue'
import type { TimeBaseField } from '../../../../@model/templates/baseField'
import { VSizes } from '../../../../@model/vuetify'
import AppDateTimePicker from '../../../../@core/components/app-form-elements/AppDateTimePicker.vue'

interface TimeFieldProps {
  modelValue?: string
  field: TimeBaseField
  disabled?: boolean
  size?: VSizes
}

const props = withDefaults(defineProps<TimeFieldProps>(), {
  modelValue: '',
  size: VSizes.Medium,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const localModelValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})
</script>

<template>
  <AppDateTimePicker
    v-model="localModelValue"
    :config="{ enableTime: true, noCalendar: true, dateFormat: 'H:i' }"
  />
</template>
