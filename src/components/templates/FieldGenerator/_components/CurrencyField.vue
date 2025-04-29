<script setup lang="ts">
import { computed } from 'vue'
import type { RatesBaseField } from '../../../../@model/templates/baseField'
import type { RatesValueItem } from '../../../../@model/templates/baseField/rates'
import TextField from '../../../../components/templates/FieldGenerator/_components/TextField.vue'
import NumberField from '../../../../components/templates/FieldGenerator/_components/NumberField.vue'

const props = defineProps<{
  modelValue: RatesValueItem
  field: RatesBaseField
  errors?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: Required<RatesValueItem>): void
}>()

const internalValue = computed({
  get: () => props.modelValue.value,
  set: (value: RatesValueItem) => {
    emit('update:modelValue', { value, currency: props.modelValue.currency })
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
