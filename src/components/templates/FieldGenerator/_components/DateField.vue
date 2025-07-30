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

// Normalize the input date to ISO string format
// If withTime is true, preserve time; otherwise, start from midnight
const normalizeDate = (date: string | Date | number | null | undefined): string => {
  if (!date)
    return ''
  const dateMoment = moment(date)

  return props.field.withTime ? dateMoment.toISOString() : dateMoment.startOf('day').toISOString()
}

// Handle setting either start or end of a date range
const setRangeDate = (value: string, isStartDate = true) => {
  const isFilter = props.field.isFilter

  // Update the appropriate local state
  if (isStartDate)
    startedAt.value = value
  else
    endedAt.value = value

  // Capture raw values for both sides of the range
  const rawStart = startedAt.value
  const rawEnd = endedAt.value

  // Fallback default values when one of the sides is missing
  const defaultStart = isFilter ? normalizeDate(1432252800) : ''
  const defaultEnd = isFilter ? moment().toISOString() : ''

  // Build normalized values with fallback logic
  const start = normalizeDate(rawStart || (isStartDate ? '' : defaultStart))
  const end = normalizeDate(rawEnd || (!isStartDate ? '' : defaultEnd))

  // Emit empty value if both sides are empty
  if (!start && !end) {
    emit('update:modelValue', '')

    return
  }

  // Emit the final formatted range
  emit('update:modelValue', `${start}${separator.value}${end}`)
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
