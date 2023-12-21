<script setup lang="ts">
import { computed } from 'vue'
import flatPickr from 'vue-flatpickr-component'
import en from 'flatpickr/dist/l10n/default.js'
import { Russian as ru } from 'flatpickr/dist/l10n/ru.js'
import i18n from '../../../../libs/i18n'
import { DateBaseField } from '../../../../@model/baseField'
import { getISOStringWithoutTimezone } from '../../../../helpers/date'

const props = withDefaults(
  defineProps<{
    value: string
    field: DateBaseField
  }>(),
  {
    value: '',
  }
)

const emit = defineEmits<{
  (event: 'input', value: string): void
}>()

const currentLocale: string = i18n.locale
const locales = {
  ru,
  en,
}

const flatPickrConfig = computed(() => ({
  dateFormat: 'Z',
  altInput: true,
  altFormat: props.field.withTime ? 'd.m.Y, H:i' : 'd.m.Y',
  locale: locales[currentLocale],
  enableTime: props.field.withTime,
  time_24hr: true,
  defaultHour: 0,
  minuteIncrement: 1,
}))

const modelValue = computed({
  get: () => props.value,
  set: (value) => emit('input', value),
})
</script>

<template>
  <flat-pickr
    v-model="modelValue"
    class="form-control"
    :config="{
      ...flatPickrConfig,
      minDate: field.isStartDateNow && getISOStringWithoutTimezone(new Date()),
      mode: field.isRangeMode ? 'range' : 'single',
      ...field.config,
    }"
  />
</template>

<style lang="scss">
@import '../../../../@core/scss/vue/libs/vue-flatpicker.scss';

.form-control[readonly].flatpickr-input {
  background-color: inherit;
}
</style>

