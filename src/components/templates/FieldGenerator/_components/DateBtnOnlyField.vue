<script setup lang="ts">
import { computed } from 'vue'
import i18n from '../../../../libs/i18n'
import { BVariants, BSizes } from '../../../../@model/bootstrap'

type Props = {
  value: string | Date
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
})

const emit = defineEmits<{
  (event: 'input', value: string | Date): void
}>()

const currentLocale: string = i18n.locale

const modelValue = computed({
  get: () => props.value,
  set: (value) => emit('input', value),
})
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
        :button-variant="BVariants.OutlinePrimary"
        :size="BSizes.Sm"
      />
    </b-input-group-append>
  </b-input-group>
</template>
