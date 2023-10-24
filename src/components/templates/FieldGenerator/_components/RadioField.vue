<script lang="ts">
import { computed } from 'vue'
import type { FieldInfo } from '../../../../@model/field'

const props = defineProps<{
  modelValue: string | boolean
  field: FieldInfo
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
  <VRadioGroup v-model="localModelValue">
    <VRadio
      v-for="(option, index) in field.options"
      :key="`radio_${index}`"
      :label="option.text"
      :value="option.value"
    />
  </VRadioGroup>
</template>
