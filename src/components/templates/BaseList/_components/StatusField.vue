<script setup lang="ts">
import { convertUpperCaseFirstSymbol } from '@/helpers'

const props = defineProps<{
  status: string
}>()

enum StatusVariants {
  // Secondary
  initial = 'light-secondary',
  New = 'light-secondary',
  new = 'light-secondary',
  waiting = 'light-secondary',
  received = 'light-secondary',
  updating = 'light-secondary',

  // Success
  active = 'light-success',
  activated = 'light-success',
  finished = 'light-success',
  approved = 'light-success',
  read = 'light-success',
  Confirmed = 'light-success',
  wager = 'light-success',
  'wager_done' = 'light-success',
  creation = 'light-success',

  // Warning
  inactive = 'light-warning',
  'in progress' = 'light-warning',
  pending = 'light-warning',
  're-check' = 'light-warning',
  Processing = 'light-warning',
  Waiting = 'light-warning',
  'wait_activation' = 'light-warning',
  processing = 'light-warning',
  used = 'light-warning',

  // Danger
  delete = 'light-danger',
  expired = 'light-danger',
  rejected = 'light-danger',
  Canceled = 'light-danger',
  Error = 'light-danger',
  'Canceled by user' = 'light-danger',
  'Marbella cancel processing' = 'light-danger',
  removed = 'light-danger',
  canceled = 'light-danger',
  lost = 'light-danger',
  cancelled = 'light-danger',
  'erased_by_withdraw' = 'light-danger',

  deleting = 'light-danger',
  // TODO: Add status variant here
}
</script>

<template>
  <b-badge :variant="StatusVariants[status]">
    {{ convertUpperCaseFirstSymbol(status.replace(RegExp('_', 'g'), ' ')) }}
  </b-badge>
</template>
