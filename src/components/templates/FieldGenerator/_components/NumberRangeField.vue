<script setup lang="ts">
import { computed } from 'vue'
import type { TranslateResult } from 'vue-i18n'
import { i18n } from '../../../../plugins/i18n'
import type { NumberBaseField } from '../../../../@model/templates/baseField'
import NumberField from './NumberField.vue'

interface NumberRangeValue {
  from: string | number
  to: string | number
}

interface Props {
  modelValue?: NumberRangeValue
  field?: NumberBaseField
  errors?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({ from: '', to: '' }),
  field: () => ({} as NumberBaseField),
})

const emits = defineEmits<{
  (e: 'update:modelValue', value: NumberRangeValue): void
}>()

const inputClass = computed(() => ({ 'border-danger rounded': props.errors }))

const numberRangeForm = computed({
  get: () => props.modelValue.from,
  set: value => {
    emits('update:modelValue', { from: value, to: props.modelValue.to })
  },
})

const numberRangeTo = computed({
  get: () => props.modelValue.to,
  set: value => {
    emits('update:modelValue', { from: numberRangeForm.value, to: value })
  },
})

const getPlaceHolder = (translate: TranslateResult): string =>
  `${props.field.placeholder || ''} ${translate}`.trimLeft()

const placeHolderRange = computed(() => ({
  from: getPlaceHolder(i18n.t('placeholder.minutesRange.from')),
  to: getPlaceHolder(i18n.t('placeholder.minutesRange.to')),
}))
</script>

<template>
  <div class="number-base-field d-flex align-center">
    <NumberField
      v-model="numberRangeForm"
      :class="inputClass"
      :field="{ ...field, placeholder: placeHolderRange.from }"
      :disabled="disabled"
      :errors="errors"
      class="number-base-field__item"
      data-test-id="from"
    />

    <span class="mx-1"> – </span>

    <NumberField
      v-model="numberRangeTo"
      :class="inputClass"
      :field="{ ...field, placeholder: placeHolderRange.to }"
      :disabled="disabled"
      :errors="errors"
      class="number-base-field__item"
      data-test-id="to"
    />
  </div>
</template>

<style lang="scss" scoped>
.number-base-field {
  &__item {
    flex: 1 1 auto;
  }
}
</style>
