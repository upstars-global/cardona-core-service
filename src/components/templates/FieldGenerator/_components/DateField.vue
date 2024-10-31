<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import moment from 'moment'
import en from 'flatpickr/dist/l10n/default.js'
import { Russian as ru } from 'flatpickr/dist/l10n/ru.js'
import { useI18n } from 'vue-i18n'
import type { DateBaseField } from '../../../../@model/templates/baseField'
import AppDateTimePicker from '../../../../@core/components/app-form-elements/AppDateTimePicker.vue'
import { getISOStringWithoutTimezone } from '../../../../helpers/date'
import { dateSeparators } from '../../../../@model/date'

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

const { locale } = useI18n()

const locales = {
  ru,
  en,
}

const flatPickrConfig = computed(() => ({
  dateFormat: 'Z',
  altInput: true,
  altFormat: props.field.withTime ? 'd.m.Y, H:i' : 'd.m.Y',
  locale: locales[locale.value],
  enableTime: props.field.withTime,
  time_24hr: true,
  defaultHour: 0,
  minuteIncrement: 1,
}))

const separator = ref(` ${dateSeparators[locale.value]} `)

const modelValue = computed({
  get: () => props.modelValue,
  set: value => {
    if (props.modelValue === value)
      return
    emit('update:modelValue', value)
  },
})

const startedAt = ref()
const endedAt = ref()

watch(
  () => props.modelValue,
  value => {
    if (!props.field.withInitFullData) {
      if (value && props.field.isRangeMode && !startedAt.value && !endedAt.value) {
        ;[startedAt.value, endedAt.value = ''] = value.split(separator.value)
      }
    }
    else {
      if (value && props.field.isRangeMode) {
        ;[startedAt.value, endedAt.value = ''] = value.split(separator.value)
      }
    }
  }, { immediate: true },
)

const setRangeDate = (value, isStartDate = true) => {
  if (isStartDate) {
    startedAt.value = value
    if (endedAt.value) {
      if (!value) {
        const startedAtValue = props.field.isFilter ? moment(1432252800).format() : ''

        emit('update:modelValue', startedAtValue + separator.value + endedAt.value)

        return
      }
      emit('update:modelValue', value + separator.value + endedAt.value)
    }
    else {
      if (!value) {
        emit('update:modelValue', '')

        return
      }
      const endedAtValue = props.field.isFilter ? moment().format() : ''

      emit('update:modelValue', value + separator.value + endedAtValue)
    }
  }
  else {
    endedAt.value = value
    if (startedAt.value) {
      emit('update:modelValue', startedAt.value + separator.value + value)
      if (!value) {
        const endedAtValue = props.field.isFilter ? moment().format() : ''

        emit('update:modelValue', startedAt.value + separator.value + endedAtValue)
      }
    }
    else {
      if (!value) {
        emit('update:modelValue', '')

        return
      }
      const startedAtValue = props.field.isFilter ? moment(1432252800).format() : ''

      emit('update:modelValue', startedAtValue + separator.value + value)
    }
  }
}

const configFrom = computed(() => {
  return {
    ...flatPickrConfig.value,
    minDate: props.field.isStartDateNow,
    maxDate: endedAt.value || props.field.allowFutureDate || new Date(),
    mode: 'single',
    defaultHour: 0,
    defaultMinute: 0,
    ...props.field.config,
  }
})

const configTo = computed(() => {
  return {
    ...flatPickrConfig.value,
    ...props.field.config,
    minDate: startedAt.value,
    mode: 'single',
    defaultHour: 23,
    defaultMinute: 59,
    maxDate: props.field?.maxDateTo || '',
  }
})
</script>

<template>
  <AppDateTimePicker
    v-if="!field.isRangeMode"
    v-model="modelValue"
    :class="{ error: errors }"
    :placeholder="field.placeholder || field.label"
    :config="{
      ...flatPickrConfig,
      minDate: field.isStartDateNow && getISOStringWithoutTimezone(new Date()),
      mode: field.isRangeMode ? 'range' : 'single',
      ...field.config,
    }"
    data-test-id="single-picker"
  />
  <div
    v-else
    class="date-time-base-field d-flex align-center"
  >
    <AppDateTimePicker
      :is-invalid="Boolean(errors)"
      :model-value="startedAt"
      :class="{ error: errors }"
      :config="configFrom"
      :placeholder="$t('common.dateFrom')"
      @update:model-value="(val) => setRangeDate(val)"
      data-test-id="from"
    />
    <span class="mx-1"> – </span>
    <AppDateTimePicker
      :key="startedAt"
      :is-invalid="Boolean(errors)"
      :model-value="endedAt"
      :class="{ error: errors }"
      :config="configTo"
      :placeholder="$t('common.dateTo')"
      @update:model-value="(val) => setRangeDate(val, false)"
      data-test-id="to"
    />
  </div>
</template>

<style lang="scss" scoped>
.date-time-base-field {
  .app-picker-field {
    flex: 1 1 auto;
  }
}
.error {
  .v-field__outline {
    color: rgb(var(--v-theme-error));
    --v-field-border-opacity: 1;
  }
}
</style>
