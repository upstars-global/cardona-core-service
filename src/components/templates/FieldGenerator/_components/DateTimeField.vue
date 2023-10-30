<script lang="ts">
import { computed } from 'vue'
import flatPickr from 'vue-flatpickr-component'
import en from 'flatpickr/dist/l10n/default.js'
import { Russian as ru } from 'flatpickr/dist/l10n/ru.js'
import i18n from '../../../../libs/i18n'

export default {
  name: 'DateRangeField',
  components: {
    flatPickr,
  },

  props: {
    value: {
      type: [String, Date],
      default: '',
    },
  },

  setup(props, { emit }) {
    const isModeRange = false
    const isStartDateNow = true
    const currentLocale: string = i18n.locale
    const locales = {
      ru,
      en,
    }
    const flatPickrConfig = {
      dateFormat: 'd.m.Y, H:i',
      locale: locales[currentLocale],
      enableTime: true,
      time_24hr: true,
      defaultHour: 0,
      minuteIncrement: 1,
    }
    const modelValue = computed({
      get: () => props.value,
      set: (value) => emit('input', value),
    })

    const onRemove = () => {
      emit('input', '')
    }

    return {
      flatPickrConfig,
      modelValue,
      isModeRange,
      isStartDateNow,
      onRemove,
    }
  },
}
</script>

<template>
  <div>
    <flat-pickr
      v-model="modelValue"
      class="form-control"
      :config="{
        ...flatPickrConfig,
        mode: isModeRange ? 'range' : 'single',
        minDate: isStartDateNow ? Date.now() : undefined,
      }"
    />
  </div>
</template>

<style lang="scss">
@import '../../../../@core/scss/vue/libs/vue-flatpicker.scss';

.form-control[readonly].flatpickr-input {
  background-color: inherit;
}
</style>
