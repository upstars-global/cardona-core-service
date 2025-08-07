<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import moment from 'moment'
import en from 'flatpickr/dist/l10n/default.js'
import { Russian as ru } from 'flatpickr/dist/l10n/ru.js'
import { useI18n } from 'vue-i18n'
import { getStartOfDayDate } from '../../../../helpers/date'
import type { DateBaseField } from '../../../../@model/templates/baseField'
import AppDateTimePicker from '../../../../@core/components/app-form-elements/AppDateTimePicker.vue'
import { dateSeparators } from '../../../../@model/date'
import { IconsList } from '../../../../@model/enums/icons'

const props = withDefaults(
  defineProps<{
    modelValue: string
    field: DateBaseField
    errors?: boolean
    disabled?: boolean
  }>(),
  {
    modelValue: '',
    disabled: false,
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
  position: props.field.position,
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

const normalizeDateTime = (date: string | Date | number | null | undefined, isEndDate = false): string => {
  // If dtae is empty and it's a filter - use default value
  if (!date && props.field.isFilter) {
    const defaultValue = isEndDate ? moment() : moment(1432252800)

    return props.field.withTime
      ? defaultValue.toISOString()
      : (isEndDate ? defaultValue.endOf('day').toISOString() : defaultValue.startOf('day').toISOString())
  }

  // If date is empty and it's not a filter, return empty string
  if (!date)
    return ''

  // Calculate moment date
  const dateMoment = moment(date)
  if (props.field.withTime)
    return dateMoment.toISOString()

  return isEndDate ? dateMoment.endOf('day').toISOString() : dateMoment.startOf('day').toISOString()
}

const setRangeDate = (value, isStartDate = true) => {
  /// Update the value in the model
  if (isStartDate)
    startedAt.value = value
  else
    endedAt.value = value

  // Get the current values based on whether it's a start or end date
  const currentStart = isStartDate ? value : startedAt.value
  const currentEnd = isStartDate ? endedAt.value : value

  // If both start and end dates are empty, emit an empty string
  if (!currentStart && !currentEnd) {
    emit('update:modelValue', '')

    return
  }

  // Calculate normalized start and end dates
  const resultStart = normalizeDateTime(currentStart, false)
  const resultEnd = normalizeDateTime(currentEnd, true)

  emit('update:modelValue', resultStart + separator.value + resultEnd)
}

const configFrom = computed(() => {
  return {
    ...flatPickrConfig.value,
    minDate: props.field.isStartDateNow && getStartOfDayDate(),
    maxDate: endedAt.value || props.field.allowFutureDate || new Date(),
    mode: 'single',
    defaultHour: 0,
    defaultMinute: 0,
    allowInput: true,
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
    allowInput: true,
  }
})

const dateFromRef = ref()
const dateToRef = ref()

const onOpenByAppendInner = dateRef => {
  dateRef.refFlatPicker.fp.open()
}
</script>

<template>
  <AppDateTimePicker
    v-if="!field.isRangeMode"
    ref="dateFromRef"
    v-model="modelValue"
    :is-invalid="Boolean(errors)"
    :class="{ error: errors }"
    :placeholder="field.placeholder || field.label"
    :config="{
      ...flatPickrConfig,
      minDate: field.isStartDateNow && getStartOfDayDate(),
      mode: field.isRangeMode ? 'range' : 'single',
      allowInput: true,
      ...field.config,
    }"
    data-test-id="single-picker"
    :disabled="disabled"
    :append-inner-icon="IconsList.CalendarIcon"
    @click:append-inner="onOpenByAppendInner(dateFromRef)"
  />
  <div
    v-else
    class="date-time-base-field d-flex align-center"
  >
    <AppDateTimePicker
      ref="dateFromRef"
      :is-invalid="Boolean(errors)"
      :model-value="startedAt"
      :class="{ error: errors }"
      :config="configFrom"
      :placeholder="$t('common.dateFrom')"
      data-test-id="from"
      :disabled="disabled"
      :append-inner-icon="IconsList.CalendarIcon"
      @update:model-value="(val) => setRangeDate(val)"
      @click:append-inner="onOpenByAppendInner(dateFromRef)"
    />
    <span class="mx-2"> – </span>
    <AppDateTimePicker
      ref="dateToRef"
      :key="startedAt"
      :is-invalid="Boolean(errors)"
      :model-value="endedAt"
      :class="{ error: errors }"
      :config="configTo"
      :placeholder="$t('common.dateTo')"
      data-test-id="to"
      :disabled="disabled"
      :append-inner-icon="IconsList.CalendarIcon"
      @update:model-value="(val) => setRangeDate(val, false)"
      @click:append-inner="onOpenByAppendInner(dateToRef)"
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

<style lang="scss">
@media (max-height: 750px) {
  .flatpickr-calendar.arrowTop {
    margin-top: -50px;
  }
}
</style>
