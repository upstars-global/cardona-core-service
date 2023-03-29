<template>
  <b-row>
    <b-col md="4">
      <b-form-group :label="$t('page.banners.startDate')" :disabled="disabled">
        <flat-picker
          v-model="startedAtModel"
          class="cursor-pointer form-control"
          :placeholder="$t('placeholder.datePicker')"
          :config="startedFlatPickerConfig"
        />
      </b-form-group>
    </b-col>

    <b-col md="4">
      <b-form-group :label="$t('page.banners.completionDate')" :disabled="disabled">
        <flat-picker
          v-model="endedAtModel"
          class="cursor-pointer form-control"
          :placeholder="$t('placeholder.datePicker')"
          :config="endedFlatPickerConfig"
        />
      </b-form-group>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import i18n from '../../libs/i18n'
import flatPicker from 'vue-flatpickr-component'
import en from 'flatpickr/dist/l10n/default.js'
import { Russian as ru } from 'flatpickr/dist/l10n/ru.js'
import { getISOStringWithoutTimezone, getUTCISOString } from '../../helpers/date'

export default defineComponent({
  name: 'DateTimeRangePicker',
  components: {
    flatPicker,
  },

  props: {
    startedAt: {
      type: String,
      default: '',
    },
    endedAt: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { emit }) {
    const currentLocale: string = i18n.locale
    const locales = {
      ru,
      en,
    }

    const defaultFlatPickerConfig = {
      dateFormat: 'Z',
      altInput: true,
      altFormat: 'd.m.Y, H:i',
      locale: locales[currentLocale],
      enableTime: true,
      time_24hr: true,
      minuteIncrement: 1,
    }

    const startedAtModel = computed({
      get: (): string => props.startedAt && getISOStringWithoutTimezone(props.startedAt),
      set: (value: string) => emit('update:startedAt', value && getUTCISOString(value)),
    })

    const startedFlatPickerConfig = computed(() => ({
      ...defaultFlatPickerConfig,
      defaultHour: 0,
      defaultMinute: 0,
      maxDate: props.endedAt,
    }))

    const endedAtModel = computed({
      get: (): string => props.endedAt && getISOStringWithoutTimezone(props.endedAt),
      set: (value: string) => emit('update:endedAt', value && getUTCISOString(value)),
    })

    const endedFlatPickerConfig = computed(() => ({
      ...defaultFlatPickerConfig,
      defaultHour: 23,
      defaultMinute: 59,
      minDate: props.startedAt,
    }))

    return {
      startedAtModel,
      startedFlatPickerConfig,
      endedAtModel,
      endedFlatPickerConfig,
    }
  },
})
</script>


<style lang="scss">
@import '~@core/scss/vue/libs/vue-flatpicker.scss';
</style>
