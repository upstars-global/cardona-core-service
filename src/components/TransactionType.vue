<script setup lang="ts">
import { computed } from 'vue'
import { TransactionType } from '../@model/playersTransactions'

const props = defineProps<{
  type: string
}>()

const iconName = computed(() =>
  props.type === TransactionType.Payout ? 'ArrowUpRightIcon' : 'ArrowDownRightIcon'
)
const textColorClass = computed(() =>
  props.type === TransactionType.Payout ? 'text-danger' : 'text-success'
)
</script>

<template>
  <div :class="textColorClass" class="transaction-type-label">
    <span class="mr-25">
      {{ $t(`common.${type}`) }}
    </span>

    <feather-icon :icon="iconName" size="12" />
  </div>
</template>

<style lang="scss" scoped>
.transaction-type-label {
  display: flex;
  align-items: center;
  font-weight: 500;
}
</style>

