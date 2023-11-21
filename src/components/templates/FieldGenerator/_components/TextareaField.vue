<script setup lang="ts">
import { computed } from 'vue'
import type { TextareaBaseField } from '@/@model/templates/baseField'

const props = defineProps<{
  modelValue: string
  value: string
  field: TextareaBaseField
  errors: Array<string>
  disabled: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const maxCharsDefault = 100

const maxChars = computed(() => props.field?.maxLength || maxCharsDefault)

const localModelValue = computed({
  get: () => props.modelValue,
  set: value => emits('update:modelValue', value),
})

const rules = [(v: string) => v?.length <= maxChars.value || `Max ${maxChars.value} characters`]
</script>

<template>
  {{ value }}
  <AppTextarea
    v-model="localModelValue"
    :placeholder="field.label"
    :state="errors.isNotEmpty ? false : null"
    no-resize
    rows="3"
    :counter="field.counter"
    :rules="[...rules, field.validationRules]"
    :disabled="disabled"
    :maxlength="maxChars"
  />
</template>
