<script setup lang="ts">
import { computed } from 'vue'
import type { NumberBaseField } from '../../../../@model/templates/baseField'
import {NumberOrString} from "@/@model";
import {toIntegerNumbers, toPositiveNumbers} from "@/helpers";

interface Props {
  modelValue: NumberOrString
  field: NumberBaseField
  errors?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), { modelValue: '' })

const emits = defineEmits<{
  (e: 'update:modelValue', string: NumberOrString): void
}>()
const attrs = useAttrs()
const getPositiveNumbers = (value: NumberOrString): NumberOrString =>
    props.field.withPositiveNumbers ? toPositiveNumbers(value) : value

const getIntegerNumbers = (value: NumberOrString): NumberOrString =>
    props.field.isIntegerNumbers ? toIntegerNumbers(value) : value

const getMappedValue = (value: NumberOrString): NumberOrString =>
    [getPositiveNumbers, getIntegerNumbers].reduce(
        (updatedValue, mappedMethod) => mappedMethod(updatedValue),
        value
    )

const localValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emits('update:modelValue', getMappedValue(value))
  },
})

const disabledKeys = computed(() => [
  'e',
  props.field.isIntegerNumbers && '.',
  props.field.withPositiveNumbers && '-',
])

const onKeyDown = (event) => {
  if (disabledKeys.value.some((key) => key === event.key)) {
    event.preventDefault()
  }
}
</script>

<template>
  <AppTextField
      v-model.trim="localValue"
      :placeholder="field.placeholder || field.label"
      :state="errors ? false : null"
      type="number"
      :disabled="disabled"
      autocomplete="off"
      :suffix="field?.append"
      @keydown="onKeyDown"
  />
</template>
