<script setup lang="ts">
import { computed } from 'vue'
import type { DateBaseField } from '../../../../@model/templates/baseField'
import { getISOStringWithoutTimezone } from '../../../../helpers/date'
import AppDateTimePicker from '../../../../@core/components/app-form-elements/AppDateTimePicker.vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    field: DateBaseField
    errors?: boolean
  }>(),
  {
    modelValue: '',
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const flatPickrConfig = computed(() => ({
  dateFormat: props.field.withTime ? 'd.m.Y, H:i' : 'd.m.Y',
  enableTime: props.field.withTime,
  time_24hr: true,
  defaultHour: 0,
  minuteIncrement: 1,
}))

const modelValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})
</script>

<template>
  <AppDateTimePicker
    v-model="modelValue"
    :class="{ error: errors }"
    :placeholder="field.placeholder || field.label"
    :config="{
      ...flatPickrConfig,
      minDate: field.isStartDateNow && getISOStringWithoutTimezone(new Date()),
      mode: field.isRangeMode ? 'range' : 'single',
      ...field.config,
    }"
  />
</template>

<style lang="scss">
.error {
  .v-field__outline {
    color: rgb(var(--v-theme-error));
    --v-field-border-opacity: 1;
  }
}
</style>
