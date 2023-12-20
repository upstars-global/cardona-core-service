<script setup lang="ts">
import { computed } from 'vue'
import en from 'flatpickr/dist/l10n/default.js'
import { Russian as ru } from 'flatpickr/dist/l10n/ru.js'
import {i18n} from "@/plugins/i18n";
import {DateBaseField} from "../../../../@model/templates/baseField";
import {getISOStringWithoutTimezone} from "../../../../helpers/date";

const props = withDefaults(
    defineProps<{
      modelValue: string
      field: DateBaseField
    }>(),
    {
      modelValue: '',
    }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const currentLocale: string = i18n.locale
const locales = {
  ru,
  en,
}

const flatPickrConfig = computed(() => ({
  dateFormat: props.field.withTime ? 'd.m.Y, H:i' : 'd.m.Y',
  locale: locales[currentLocale],
  enableTime: props.field.withTime,
  time_24hr: true,
  defaultHour: 0,
  minuteIncrement: 1,
}))

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const isFocused = ref(false)
const onFocus = () => {
  isFocused.value = true
}
const onBlur = () => {
  isFocused.value = false
}
</script>

<template>
  <AppDateTimePicker
      v-model="modelValue"
      :config="{
        ...flatPickrConfig,
        minDate: field.isStartDateNow && getISOStringWithoutTimezone(new Date()),
        mode: field.isRangeMode ? 'range' : 'single',
        ...field.config,
      }"
  />
</template>

