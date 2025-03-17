<script setup lang="ts">
import { computed } from 'vue'
import type { CheckBaseField } from '../../../../@model/templates/baseField'

const props = defineProps<{
  modelValue: boolean
  field: CheckBaseField
  disabled: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const localModelValue = computed({
  get: () => props.modelValue,
  set: value => emits('update:modelValue', value),
})
</script>

<template>
  <VLabel class="text-color-base cursor-pointer overflow-visible select-none">
    <VCheckbox
      v-model="localModelValue"
      :disabled="disabled"
      class="base-checkbox"
    />
    <span>{{ field.label }}</span>
  </VLabel>
</template>

<style scoped lang="scss">
.select-none {
  user-select: none;
}
</style>
