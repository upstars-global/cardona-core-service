<script lang="ts" setup>
import { computed } from 'vue'
import type { RadioBaseField } from '../../../../@model/templates/baseField'

const props = defineProps<{
  modelValue: string | boolean
  field: RadioBaseField
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: string | boolean): void
}>()

const localModelValue = computed({
  get: () => props.modelValue,
  set: value => emits('update:modelValue', value),
})
</script>

<template>
  <VRadioGroup
    v-model="localModelValue"
    inline
  >
    <VRadio
      v-for="(option, index) in field.options"
      :key="`radio_${index}`"
      :label="option.text"
      :value="option.value"
      data-test-id="radio-option"
    />
  </VRadioGroup>
</template>
