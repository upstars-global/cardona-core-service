<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import flatPickr from 'vue-flatpickr-component'
import en from 'flatpickr/dist/l10n/default.js'
import { Russian as ru } from 'flatpickr/dist/l10n/ru.js'
import i18n from '../../../../libs/i18n'
import { DateBaseField } from '../../../../@model/baseField'
import { getISOStringWithoutTimezone, getUTCISOString } from '../../../../helpers/date'
import { dateSeparators } from '../../../../@model/date'
import moment from 'moment'

const props = withDefaults(
  defineProps<{
    value: string
    field: DateBaseField
    errors?: string[]
  }>(),
  {
    value: '',
    errors: () => [],
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

const separator = ref(` ${dateSeparators[i18n.locale]} `)

const modelValue = computed({
  get: () => props.value,
  set: (value) => emit('input', value),
})

const startedAt = ref()
const endedAt = ref()

watch(
  () => props.value,
  (value) => {
    if (value && props.field.isRangeMode && !startedAt.value && !endedAt.value) {
      ;[startedAt.value, endedAt.value] = value.split(separator.value)
    }
  }
)

const setRangeDate = (value, isStartDate = true) => {
  if (isStartDate) {
    startedAt.value = value
    if (endedAt.value) {
      if (!value) {
        emit('input', moment(1432252800).format() + separator.value + endedAt.value)
        return
      }
      emit('input', value + separator.value + endedAt.value)
    } else {
      if (!value) {
        emit('input', '')
        return
      }
      emit('input', value + separator.value + moment().format())
    }
  } else {
    endedAt.value = value
    if (startedAt.value) {
      emit('input', startedAt.value + separator.value + value)
      if (!value) {
        emit('input', startedAt.value + separator.value + moment().format())
        return
      }
    } else {
      if (!value) {
        emit('input', '')
        return
      }
      emit('input', moment(1432252800).format() + separator.value + value)
    }
  }
}
</script>

<template>
  <div :class="{ error: errors.isNotEmpty }">
    <flat-pickr
      v-if="!field.isRangeMode"
      v-model="modelValue"
      :config="{
        ...flatPickrConfig,
        minDate: field.isStartDateNow && getISOStringWithoutTimezone(new Date()),
        mode: field.isRangeMode ? 'range' : 'single',
        ...field.config,
      }"
    />
    <div v-else class="d-flex align-items-center">
      <flat-pickr
        :value="startedAt"
        :config="{
          ...flatPickrConfig,
          minDate: field.isStartDateNow && getISOStringWithoutTimezone(new Date()),
          maxDate: endedAt,
          mode: 'single',
          defaultHour: 0,
          defaultMinute: 0,
          ...field.config,
        }"
        :placeholder="i18n.t('common.dateFrom')"
        @input="(val) => setRangeDate(val)"
      />

      <span class="mx-1"> – </span>

      <flat-pickr
        :value="endedAt"
        :config="{
          ...flatPickrConfig,
          minDate: startedAt,
          mode: 'single',
          defaultHour: 23,
          defaultMinute: 59,
          ...field.config,
        }"
        :placeholder="i18n.t('common.dateTo')"
        @input="(val) => setRangeDate(val, false)"
      />
    </div>
  </div>
</template>

<style lang="scss">
@import '../../../../@core/scss/vue/libs/vue-flatpicker.scss';

.error {
  .input {
    border-color: $red;
  }
}
</style>

