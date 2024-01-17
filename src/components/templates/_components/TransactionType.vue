<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { computed } from 'vue'
import { IconsList } from '../../../@model/enums/icons'

const props = defineProps<{
  type: string
}>()

const { t } = useI18n()

enum TransactionType {
  Payout = 'payout',
  Deposit = 'deposit',
}

const iconName = computed(() =>
  props.type === TransactionType.Payout ? IconsList.ArrowUpRightIcon : IconsList.ArrowDownRightIcon,
)

const text = computed(() => t(`common.${props.type}`))

const textColorClass = computed(() =>
  props.type === TransactionType.Payout ? 'text-danger' : 'text-success',
)
</script>

<template>
  <div
    :class="textColorClass"
    class="transaction-type-label"
  >
    <span class="mr-25">
      {{ text }}
    </span>
    <VIcon
      :icon="iconName"
      size="16"
    />
  </div>
</template>

<style lang="scss" scoped>
.transaction-type-label {
  display: flex;
  align-items: center;
  font-weight: 500;
}
</style>
