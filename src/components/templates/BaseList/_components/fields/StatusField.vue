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

enum StatusVariants {

  // Secondary
  initial = 'secondary',
  New = 'secondary',
  new = 'secondary',
  waiting = 'secondary',
  received = 'secondary',
  updating = 'secondary',
  reporting = 'secondary',
  draft = 'secondary',

  // Success
  active = 'success',
  activated = 'success',
  finished = 'success',
  approved = 'success',
  read = 'success',
  Confirmed = 'success',
  wager = 'success',
  'wager_done' = 'success',
  creation = 'success',

  // Warning
  inactive = 'warning',
  'in progress' = 'warning',
  pending = 'warning',
  're-check' = 'warning',
  Processing = 'warning',
  Waiting = 'warning',
  'wait_activation' = 'warning',
  processing = 'warning',
  used = 'warning',

  // Danger
  delete = 'error',
  expired = 'error',
  rejected = 'error',
  Canceled = 'error',
  Error = 'error',
  'Canceled by user' = 'error',
  'Marbella cancel processing' = 'error',
  removed = 'error',
  canceled = 'error',
  lost = 'error',
  cancelled = 'error',
  'erased_by_withdraw' = 'error',
  deleting = 'error',

  // TODO: Add status variant here
}

const value = computed(() => {
  const status = typeof props.value === 'string' ? props.value : props.value?.status

  return status && convertUpperCaseFirstSymbol(status?.replace(RegExp('_', 'g'), ' '))
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
