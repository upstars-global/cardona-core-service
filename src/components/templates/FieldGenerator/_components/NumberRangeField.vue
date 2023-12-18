<template>
  <div class="number-base-field d-flex align-center">
    <number-field
      v-model="numberRangeForm"
      :class="inputClass"
      :field="{ ...field, placeholder: placeHolderRange.from }"
      :disabled="disabled"
    />

    <span class="mx-1"> – </span>

    <number-field
      v-model="numberRangeTo"
      :class="inputClass"
      :field="{ ...field, placeholder: placeHolderRange.to }"
      :disabled="disabled"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import NumberField from './NumberField.vue'
import { TranslateResult } from 'vue-i18n'
import {i18n} from "@/plugins/i18n";
import {NumberBaseField} from "../../../../@model/templates/baseField";

interface NumberRangeValue {
  from: string | number
  to: string | number
}

type Props = {
  modelValue: NumberRangeValue
  field?: NumberBaseField
  errors?: Array<string>
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  errors: () => [],
  modelValue: () => ({ from: '', to: '' }),
  field: () => ({} as NumberBaseField),
})
const inputClass = computed(() => ({ 'border-danger rounded': props.errors?.isNotEmpty }))

const emits = defineEmits<{
  (e: 'update:modelValue', value: NumberRangeValue): void
}>()

const numberRangeForm = computed({
  get: () => props.modelValue.from,
  set: (value) => {
    emits('update:modelValue', {from: value, to: props.modelValue.to})
  },
})
const numberRangeTo = computed({
  get: () => props.modelValue.to,
  set: (value) => {
    emits('update:modelValue', {from: numberRangeForm.value, to: value})
  },
})

const getPlaceHolder = (translate: TranslateResult): string =>
  `${props.field.placeholder || ''} ${translate}`.trimLeft()

const placeHolderRange = computed(() => ({
  from: getPlaceHolder(i18n.t('placeholder.minutesRange.from')),
  to: getPlaceHolder(i18n.t('placeholder.minutesRange.to')),
}))
</script>
