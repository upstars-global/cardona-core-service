<script setup lang="ts">
import { computed } from 'vue'
import NumberField from './NumberField.vue'
import { FieldInfo } from '../../../../@model/field'

type SumRangeFieldProps = {
  value: Array<number>
  field: FieldInfo
  disabled: boolean
}

const props = withDefaults(defineProps<SumRangeFieldProps>(), {
  value: () => [],
})

const emit = defineEmits<{
  (event: 'input', value: Array<number>): void
}>()

const sumFrom = computed({
  set: (newSumFrom) => emit('input', [getSumNumber(newSumFrom), sumTo.value * 100]),
  get: () => (props.value[0] ? props.value[0] / 100 : props.value[0]),
})

const sumTo = computed({
  set: (newSumTo) => emit('input', [sumFrom.value * 100, getSumNumber(newSumTo)]),
  get: () => (props.value[1] ? props.value[1] / 100 : props.value[1]),
})

const getSumNumber = (sum) => {
  if (!sum) return 0

  return Number(sum * 100)
}
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

