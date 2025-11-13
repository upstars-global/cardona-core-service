<script setup lang="ts">
import { computed } from 'vue'
import type { TranslateResult } from 'vue-i18n'
import { convertUpperCaseFirstSymbol } from '../../../helpers'
import { VVariants } from '../../../@model/vuetify'

interface IStatusWithVariantReplace {
  status: TranslateResult
  variant: string
}

type ValueType = string | IStatusWithVariantReplace

const props = withDefaults(defineProps<{
  value: ValueType
  variant?: VVariants
}>(), {
  variant: VVariants.Tonal,
})

const value = computed(() => {
  const status = typeof props.value === 'string' ? props.value : props.value?.status

  return status && convertUpperCaseFirstSymbol(status?.replace(/_/g, ' '))
})

const color = computed(() => {
  return props.value?.variant
})
</script>

<template>
  <VChip
    :color="color"
    :variant="variant"
    data-test-id="status-field"
    label
  >
    <span
      class="lh-normal"
      data-test-id="status-field-value"
    >
      {{ value }}
    </span>
  </VChip>
</template>
`
