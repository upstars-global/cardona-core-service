<script setup lang="ts">
import { computed } from 'vue'
import type { RatesBaseField } from '../../../../@model/templates/baseField'
import TextField from '../../../../components/templates/FieldGenerator/_components/TextField.vue'
import NumberField from '../../../../components/templates/FieldGenerator/_components/NumberField.vue'
import type { CurrencyValue } from '../../../../@model/templates/baseField/currency'

const props = defineProps<{
  modelValue: CurrencyValue
  field: RatesBaseField
  errors?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: CurrencyValue): void
}>()

const internalValue = computed({
  get: () => props.modelValue,
  set: (value: CurrencyValue) => {
    emit('update:modelValue', value)
  },
})

const component = computed(() => props.field.withString ? TextField : NumberField)
</script>

<template>
  <component
    :is="component"
    v-model="internalValue"
    :field="field"
    :errors="errors"
    :disabled="disabled"
  />
</template>
