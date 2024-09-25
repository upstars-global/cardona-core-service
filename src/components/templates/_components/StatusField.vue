<script setup lang="ts">
import { computed } from 'vue'
import type { TranslateResult } from 'vue-i18n'
import { convertUpperCaseFirstSymbol } from '../../../helpers'
import { VColors, VVariants } from '../../../@model/vuetify'
import { StatusVariants } from '../../../@model/enums/statusField'

interface IStatusWithVariantReplace {
  status: TranslateResult
  variant: string
}

type ValueType = string | IStatusWithVariantReplace

const props = defineProps<{
  value: ValueType
  variant: VVariants
}>()

const value = computed(() => {
  const status = typeof props.value === 'string' ? props.value : props.value?.status

  return status && convertUpperCaseFirstSymbol(status?.replace(/_/g, ' '))
})

const color = computed(() => {
  if (typeof props.value === 'string')
    return StatusVariants[props.value] || VColors.Secondary

  return props.value?.variant
})

const actualVariant = computed(() => {
  return props.variant || VVariants.Tonal
})
</script>

<template>
  <VChip
    :color="color"
    :variant="actualVariant"
    data-test-id="status-field"
    label
  >
    <span class="lh-normal" data-test-id="status-field-value">
      {{ value }}
    </span>
  </VChip>
</template>
`
