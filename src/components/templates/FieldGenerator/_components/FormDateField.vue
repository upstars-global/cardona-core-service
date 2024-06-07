<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Russian as ru } from 'flatpickr/dist/l10n/ru'
import en from 'flatpickr/dist/l10n/default'
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
const { locale } = useI18n()

const locales = {
  ru,
  en,
}

const flatPickrConfig = computed(() => ({
  dateFormat: 'Z',
  altInput: true,
  locale: locales[locale.value],
  time_24hr: true,
  defaultHour: 0,
  minuteIncrement: 1,
}))

const localModelValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const openByClick = () => {
  refPicker.value.refFlatPicker.fp.open()
}
</script>

<template>
  <AppDateTimePicker
    ref="refPicker"
    v-model="localModelValue"
    :append-inner-icon="IconsList.CalendarIcon"
    class="form-date-field"
    :config="flatPickrConfig"
    @click:append-inner="openByClick"
  />
</template>

<style lang="scss">
.form-date-field {
  z-index: 5;
  .v-field__append-inner {
    color: rgb(var(--v-theme-primary));
    opacity: 1;
  }
}
</style>
