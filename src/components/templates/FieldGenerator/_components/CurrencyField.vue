<script setup lang="ts">
import { ref, watch } from 'vue'

import type { RatesBaseField } from '../../../../@model/templates/baseField'
import { NumberBaseField, TextBaseField } from '../../../../@model/templates/baseField'
import FieldGenerator from '../index.vue'
import type { RatesValueItem } from '../../../../@model/templates/baseField/rates'

const props = withDefaults(
  defineProps<{
    modelValue: RatesValueItem
    field: RatesBaseField
    disabled?: boolean
    append?: string
  }>(),
  {
    append: '',
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: RatesValueItem): void
}>()

const currencyField = ref<NumberBaseField | TextBaseField>(setRate())

function setRate(): NumberBaseField | TextBaseField {
  const field = props.field.withString ? TextBaseField : NumberBaseField

  return new field({
    key: props.modelValue.currency,
    id: `${props.field.id}_${props.modelValue.currency}`,
    value: props.modelValue?.value ?? 0,
    label: props.modelValue.currency,
    placeholder: props.field.placeholder,
    validationRules: props.field.validationRules,
    append: props.append,
    withPositiveNumbers: true,
    isIntegerNumbers: props.field.isIntegerNumbers,
  })
}

watch(
  () => currencyField,
  () => {
    emit(
      'update:modelValue',
      {
        currency: currencyField.value.key,
        value: currencyField.value.value,
      },
    )
  },
  { deep: true, immediate: true },
)
</script>

<template>
  <div>
    <FieldGenerator
      v-model="currencyField"
      :disabled="disabled"
    />
  </div>
</template>
