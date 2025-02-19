<script setup lang="ts">
import { computed } from 'vue'
import type { NumberBaseField } from '../../../../@model/templates/baseField'
import type { NumberOrString } from '../../../../@model'
import { toIntegerNumbers, toPositiveNumbers } from '../../../../helpers'
import AppTextField from '../../../../@core/components/app-form-elements/AppTextField.vue'
import { IconsList } from '../../../../@model/enums/icons'

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

const getPositiveNumbers = (value: NumberOrString): NumberOrString =>
  props.field.withPositiveNumbers ? toPositiveNumbers(value) : value

const getIntegerNumbers = (value: NumberOrString): NumberOrString =>
  props.field.isIntegerNumbers ? toIntegerNumbers(value) : value

const getMappedValue = (value: NumberOrString): NumberOrString =>
  [getPositiveNumbers, getIntegerNumbers].reduce(
    (updatedValue, mappedMethod) => mappedMethod(updatedValue),
    value,
  )

const localValue = computed({
  get: () => props.modelValue,
  set: value => {
    emits('update:modelValue', getMappedValue(value))
  },
})

const disabledKeys = computed(() => [
  'e',
  props.field.isIntegerNumbers && '.',
  props.field.withPositiveNumbers && '-',
])

const onKeyDown = event => {
  if (disabledKeys.value.includes(event.key))
    event.preventDefault()
}

const appendInnerIcon = computed(() => {
  if (props.errors)
    return IconsList.InfoIcon

  return null
})
</script>

<template>
  <div>
    <AppTextField
      v-model.trim="localValue"
      :placeholder="field.placeholder || field.label"
      :state="errors ? false : null"
      type="number"
      :disabled="disabled"
      autocomplete="off"
      :suffix="field?.append"
      :error="errors"
      :append-inner-icon="appendInnerIcon"
      class="number-field"
      hide-details
      @keydown="onKeyDown"
    />
  </div>
</template>

<style
  scoped
  lang="scss"
>
.number-field {
  :deep(input)::-webkit-outer-spin-button,
  :deep(input)::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}
</style>
