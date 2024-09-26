<script setup lang="ts">
import { computed } from 'vue'
import type { TimeBaseField } from '../../../../@model/templates/baseField'
import { VSizes } from '../../../../@model/vuetify'
import AppDateTimePicker from '../../../../@core/components/app-form-elements/AppDateTimePicker.vue'
import { IconsList } from '../../../../@model/enums/icons'

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
  enableSeconds: props.format === 'H:i:s' || props.format === 'H:i:S',
  static: true,
}
</script>

<template>
  <AppDateTimePicker
    v-model="localModelValue"
    :prepend-inner-icon="IconsList.ClockIcon"
    :placeholder="field.placeholder || field.label"
    :disabled="disabled"
    :config="config"
    :is-invalid="errors"
    :class="{ static: config.static }"
  />
</template>

<style lang="scss">
.static {
  z-index: 1;
  position: relative;

  .flatpickr-wrapper {
    position: static;

    .flatpickr-input {
      margin: 0 5px;
    }
  }
}
</style>
