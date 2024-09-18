<script setup lang="ts">
import { computed } from 'vue'
import type { TimeBaseField } from '../../../../@model/templates/baseField'
import { VSizes } from '../../../../@model/vuetify'
import AppDateTimePicker from '../../../../@core/components/app-form-elements/AppDateTimePicker.vue'
import { IconsList } from '../../../../@model/enums/icons'
import AppTextField from 'cardona-core-service/src/@core/components/app-form-elements/AppTextField.vue'

interface TimeFieldProps {
  modelValue?: string
  field: TimeBaseField
  disabled?: boolean
  size?: VSizes
  errors?: boolean
  format?: string
}

const props = withDefaults(defineProps<TimeFieldProps>(), {
  modelValue: '',
  size: VSizes.Medium,
  format: 'H:i',
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const localModelValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const config = {
  enableTime: true,
  noCalendar: true,
  dateFormat: props.format,
  time_24hr: true,
  minuteIncrement: 1,
}
</script>

<template>
  <AppDateTimePicker
    v-model="localModelValue"
    :prepend-inner-icon="IconsList.ClockIcon"
    :placeholder="field.placeholder || field.label"
    :disabled="disabled"
    :config="config"
    :isInvalid="errors"
  />
</template>
