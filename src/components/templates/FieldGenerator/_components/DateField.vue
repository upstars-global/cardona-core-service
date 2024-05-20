<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import moment from 'moment'
import type { DateBaseField } from '../../../../@model/templates/baseField'
import AppDateTimePicker from '../../../../@core/components/app-form-elements/AppDateTimePicker.vue'
import { getISOStringWithoutTimezone } from '../../../../helpers/date'
import { dateSeparators } from '../../../../@model/date'
import { i18n } from '@/plugins/i18n'

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

const separator = ref(` ${dateSeparators[i18n.locale._value]} `)

const modelValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const startedAt = ref()
const endedAt = ref()

watch(
  () => props.modelValue,
  value => {
    if (value && props.field.isRangeMode) {
      ;[startedAt.value, endedAt.value = ''] = value.split(separator.value)
    }
  }, { immediate: true },
)

const setRangeDate = (value, isStartDate = true) => {
  if (isStartDate) {
    startedAt.value = value
    if (endedAt.value) {
      if (!value) {
        emit('update:modelValue', moment(1432252800).format() + separator.value + endedAt.value)

        return
      }
      emit('update:modelValue', value + separator.value + endedAt.value)
    }
    else {
      if (!value) {
        emit('update:modelValue', '')

        return
      }
      emit('update:modelValue', value + separator.value + moment().format('DD.MM.YYYY HH:mm'))
    }
  }
  else {
    endedAt.value = value
    if (startedAt.value) {
      emit('update:modelValue', startedAt.value + separator.value + value)
      if (!value)
        emit('update:modelValue', startedAt.value + separator.value + endedAt.value)
    }
    else {
      if (!value) {
        emit('update:modelValue', '')

        return
      }
      emit('update:modelValue', moment(1432252800).format() + separator.value + value)
    }
  }
}
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
  />
  <div
    v-else
    class="date-time-base-field d-flex align-center"
  >
    <AppDateTimePicker
      :model-value="startedAt"
      :class="{ error: errors }"
      :config="{
        ...flatPickrConfig,
        minDate: field.isStartDateNow && moment(field.isStartDateNow).valueOf(),
        maxDate: moment(endedAt).valueOf(),
        mode: 'single',
        defaultHour: 0,
        defaultMinute: 0,
        ...field.config,
      }"
      :placeholder="i18n.t('common.dateFrom')"
      @update:model-value="(val) => setRangeDate(val)"
    />
    <span class="mx-1"> – </span>

    <AppDateTimePicker
      :model-value="endedAt"
      :class="{ error: errors }"
      :config="{
        ...flatPickrConfig,
        ...field.config,
        minDate: moment(startedAt).valueOf(),
        mode: 'single',
        defaultHour: 23,
        defaultMinute: 59,
      }"
      :placeholder="i18n.t('common.dateTo')"
      @update:model-value="(val) => setRangeDate(val, false)"
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
