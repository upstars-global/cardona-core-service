<script setup lang="ts">
import type { RatesBaseField, RatesValueItem } from '@/@model/templates/baseField/rates'

const props = withDefaults(
  defineProps<{
    modelValue: Array<RatesValueItem>
    field: RatesBaseField
    disabled?: boolean
    append?: string
  }>(),
  {
    modelValue: () => [],
    append: '',
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: Array<RatesValueItem>): void
}>()
</script>

<template>
  <div>Currency</div>
</template>
