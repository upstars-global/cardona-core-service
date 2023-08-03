<script setup lang="ts">
import { computed } from 'vue'
import NumberField from './NumberField.vue'
import { FieldInfo } from '../../../../@model/field'
import { isNotEmptyNumber, isEmptyString } from '../../../../helpers'
import { isString } from 'lodash'

type SumRangeFieldProps = {
  value: Array<number>
  field: FieldInfo
  disabled: boolean
}

type NumberOrEmptyString = number | ''

const props = withDefaults(defineProps<SumRangeFieldProps>(), {
  value: () => [],
})

const emit = defineEmits<{
  (event: 'input', value: Array<NumberOrEmptyString>): void
}>()

const getMultipleWith100 = (value: NumberOrEmptyString): NumberOrEmptyString =>
  isEmptyString(value) ? '' : value * 100
const getDivideWith100 = (value: NumberOrEmptyString): NumberOrEmptyString => (isEmptyString(value) ? '' : value / 100)

const sumFrom = computed({
  set: (newSumFrom) => emit('input', [getMultipleWith100(newSumFrom), getMultipleWith100(sumTo.value)]),
  get: () => (props.value[0] ? getDivideWith100(props.value[0]) : props.value[0]),
})

const sumTo = computed({
  set: (newSumTo) => emit('input', [getMultipleWith100(sumFrom.value), getMultipleWith100(newSumTo)]),
  get: () => (props.value[1] ? getDivideWith100(props.value[1]) : props.value[1]),
})
</script>

<template>
  <div class="d-flex align-items-center">
    <number-field
      v-model="sumFrom"
      :field="{ ...field, placeholder: $t('placeholder.filter.sumFrom') }"
      :disabled="disabled"
    />

    <span class="mx-1"> – </span>

    <number-field
      v-model="sumTo"
      :field="{ ...field, placeholder: $t('placeholder.filter.sumTo') }"
      :disabled="disabled"
    />
  </div>
</template>

