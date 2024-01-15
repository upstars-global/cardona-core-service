<script setup lang="ts">
import { computed, ref } from 'vue'

import { Russian as ru } from 'flatpickr/dist/l10n/ru'
import en from 'flatpickr/dist/l10n/default'
import { i18n } from '../../../../plugins/i18n'
import type { FormDateBaseField } from '../../../../@model/templates/baseField'
import { IconsList } from '../../../../@model/enums/icons'
import AppDateTimePicker from '../../../../@core/components/app-form-elements/AppDateTimePicker.vue'

interface Props {
  modelValue: string | Date
  field: FormDateBaseField
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | Date): void
}>()

const refPicker = ref({})
const currentLocale: string = i18n.locale

const locales = {
  ru,
  en,
}

const flatPickrConfig = computed(() => ({
  dateFormat: 'Y.m.d',
  locale: locales[currentLocale],
  time_24hr: true,
  defaultHour: 0,
  minuteIncrement: 1,
  allowInput: true,
  clickOpens: false,
}))

const localModelValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const toggle = () => {
  refPicker.value.refFlatPicker.fp.open()
}
</script>

<template>
  <AppDateTimePicker
    ref="refPicker"
    v-model="localModelValue"
    :config="flatPickrConfig"
    :append-inner-icon="IconsList.CalendarIcon"
    @click:control="toggle"
  />
</template>
