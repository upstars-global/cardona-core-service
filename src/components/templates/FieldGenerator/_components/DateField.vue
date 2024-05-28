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

const isFilter = computed(() => props.field.isFilter)

const getDateNotSelectedDate = (): string => {
  return isFilter.value ? moment(1432252800).format('DD.MM.YYYY, HH:mm') : ''
}

watch(
  () => props.modelValue,
  value => {
    if (!props.field.isFilter) {
      if (value && isFilter.value && !startedAt.value && !endedAt.value) {
        ;[startedAt.value, endedAt.value = ''] = value.split(separator.value)
      }
    }
    else {
      if (value && isFilter.value) {
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
        emit('update:modelValue', getDateNotSelectedDate() + separator.value + endedAt.value)

        return
      }
      emit('update:modelValue', value + separator.value + endedAt.value)
    }
    else {
      if (!value) {
        emit('update:modelValue', '')

        return
      }
      emit('update:modelValue', value + separator.value + getDateNotSelectedDate())
    }
  }
  else {
    endedAt.value = value
    if (startedAt.value) {
      emit('update:modelValue', startedAt.value + separator.value + value)
      if (!value)
        emit('update:modelValue', startedAt.value + separator.value + getDateNotSelectedDate())
    }
    else {
      if (!value) {
        emit('update:modelValue', '')

        return
      }
      emit('update:modelValue', getDateNotSelectedDate() + separator.value + value)
    }
  }
}

const datePickerToRef = ref()

const onChangeValue = () => {
  datePickerToRef.value?.refFlatPicker?.fp.close()
}

const onUpdateValueForm = (val: string) => {
  setRangeDate(val)
  onChangeValue()
}

const configFrom = computed(() => {
  return {
    ...flatPickrConfig.value,
    minDate: props.field.isStartDateNow && moment().valueOf(),
    maxDate: moment(endedAt.value || new Date(), 'DD.MM.YYYY, HH:mm').valueOf(),
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
    minDate: moment(startedAt.value, 'DD.MM.YYYY, HH:mm').valueOf(),
    mode: 'single',
    defaultHour: 23,
    defaultMinute: 59,
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
  />
  <div
    v-else
    class="date-time-base-field d-flex align-center"
  >
    <AppDateTimePicker
      :model-value="startedAt"
      :is-invalid="Boolean(errors)"
      :config="configFrom"
      :placeholder="i18n.t('common.dateFrom')"
      @update:model-value="onUpdateValueForm"
    />
    <span class="mx-1"> – </span>
    <AppDateTimePicker
      ref="datePickerToRef"
      :model-value="endedAt"
      :is-invalid="Boolean(errors)"
      :config="configTo"
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
</style>
