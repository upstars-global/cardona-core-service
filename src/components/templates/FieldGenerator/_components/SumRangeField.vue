<script setup lang="ts">
import { computed } from 'vue'
import type { FieldInfo } from '../../../../@model/field'
import { isEmptyString } from '../../../../helpers'
import { division, multiplication } from '../../../../helpers/math-operations'
import NumberField from './NumberField.vue'

interface SumRangeFieldProps {
  modelValue: Array<number>
  field: FieldInfo
  disabled: boolean
}

type NumberOrEmptyString = number | ''

const props = withDefaults(defineProps<SumRangeFieldProps>(), {
  value: () => [],
})

const emits = defineEmits<{
  (e: 'update:modelValue', value: Array<number>): void
}>()

const getMultipleWith100 = (value: NumberOrEmptyString): NumberOrEmptyString =>
  isEmptyString(value) ? '' : multiplication(value, 100)

const getDivideWith100 = (value: NumberOrEmptyString): NumberOrEmptyString =>
  isEmptyString(value) ? '' : division(value, 100)

const sumFrom = computed({
  set: newSumFrom =>
    emits('update:modelValue', [getMultipleWith100(newSumFrom), getMultipleWith100(sumTo.value)]),
  get: () => (props.modelValue[0] ? getDivideWith100(props.modelValue[0]) : props.modelValue[0]),
})

const sumTo = computed({
  set: newSumTo =>
    emits('update:modelValue', [getMultipleWith100(sumFrom.value), getMultipleWith100(newSumTo)]),
  get: () => (props.modelValue[1] ? getDivideWith100(props.modelValue[1]) : props.modelValue[1]),
})
</script>

<template>
  <div class="d-flex align-items-center">
    <NumberField
      v-model="sumFrom"
      :field="{ ...field, placeholder: $t('placeholder.filter.sumFrom') }"
      :disabled="disabled"
    />

    <span class="mx-1"> – </span>

    <NumberField
      v-model="sumTo"
      :field="{ ...field, placeholder: $t('placeholder.filter.sumTo') }"
      :disabled="disabled"
    />
  </div>
</template>
