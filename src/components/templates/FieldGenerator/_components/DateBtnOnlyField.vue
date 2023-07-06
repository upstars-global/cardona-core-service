<script lang="ts">
import { computed } from 'vue'
import { Russian as ru } from 'flatpickr/dist/l10n/ru.js'
import i18n from '../../../../libs/i18n'

export default {
  name: 'DateBtnOnlyField',

  props: {
    value: {
      type: [String, Date],
      default: '',
    },
  },

  setup(props, { emit }) {
    const currentLocale: string = i18n.locale
    const locales = {
      ru: 'ru',
      en: 'en-US',
    }

    const modelValue = computed({
      get: () => props.value,
      set: (value) => emit('input', value),
    })

    const onRemove = () => {
      emit('input', '')
    }

    return {
      currentLocale,
      modelValue,
      onRemove,
    }
  },
}
</script>

<template>
  <b-input-group class="btn-date-group">
    <b-form-input
      id="date-btn-only-input"
      v-model="modelValue"
      type="text"
      placeholder="YYYY-MM-DD"
      autocomplete="off"
      show-decade-nav
    />
    <b-input-group-append>
      <b-form-datepicker
        v-model="modelValue"
        show-decade-nav
        button-only
        right
        :locale="currentLocale"
        aria-controls="date-btn-only-input"
        button-variant="primary"
        size="sm"
      />
    </b-input-group-append>
  </b-input-group>
</template>
