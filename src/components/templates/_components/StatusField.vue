<script setup lang="ts">
import { computed } from 'vue'
import type { TranslateResult } from 'vue-i18n'
import { convertUpperCaseFirstSymbol } from '../../../helpers'

interface IStatusWithVariantReplace {
  status: TranslateResult
  variant: string
}

type ValueType = string | IStatusWithVariantReplace

const props = defineProps<{
  value: ValueType
}>()

enum StatusVariants {

  // Secondary
  initial = 'secondary',
  New = 'secondary',
  new = 'secondary',
  waiting = 'secondary',
  received = 'secondary',
  updating = 'secondary',

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

  return status && convertUpperCaseFirstSymbol(status?.replace(/_/g, ' '))
})

const variantName = computed(() => {
  return typeof props.value === 'string' ? StatusVariants[props.value] : props.value?.variant
})
</script>

<template>
  <VChip
    label
    :color="variantName"
  >
    {{ value }}
  </VChip>
</template>
