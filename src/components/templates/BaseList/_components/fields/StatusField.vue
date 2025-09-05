<script setup lang="ts">
import { computed } from 'vue'
import type { TranslateResult } from 'vue-i18n'
import { convertUpperCaseFirstSymbol } from '../../../../../helpers'
import { VColors, VVariants } from '../../../../../@model/vuetify'

interface IStatusWithVariantReplace {

  // copy of IStatusWithVariant
  status: TranslateResult
  variant: string
}

type ValueType = string | IStatusWithVariantReplace

const props = withDefaults(defineProps<{
  value: ValueType
  variant?: VVariants
  rounded?: boolean
}>(), {
  variant: VVariants.Tonal,
})

const value = computed(() => {
  const status = typeof props.value === 'string' ? props.value : props.value?.status

  return status && convertUpperCaseFirstSymbol(status?.replace(RegExp('_', 'g'), ' '))
})

const color = computed(() => {
  return props.value?.variant || VColors.Secondary
})

const actualVariant = computed(() => {
  return props.variant || VVariants.Tonal
})
</script>

<template>
  <VChip
    :color="color"
    :variant="actualVariant"
    :label="!rounded"
    data-test-id="status-field"
  >
    <span
      class="lh-normal"
      data-test-id="status-field-text"
    >
      {{ value }}
    </span>
  </VChip>
</template>
