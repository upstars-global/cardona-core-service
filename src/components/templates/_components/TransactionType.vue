<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { computed } from 'vue'
import { IconsList } from '../../../@model/enums/icons'
import { TransactionType } from '../../../@model/enums/playersTransactions'

const props = defineProps<{
  type: string
}>()

const { t } = useI18n()

const iconName = computed(() =>
  props.type === TransactionType.Payout ? IconsList.ArrowUpRightIcon : IconsList.ArrowDownRightIcon,
)

const text = computed(() => t(`common.${props.type}`))

const textColorClass = computed(() =>
  props.type === TransactionType.Payout ? 'text-error' : 'text-success',
)
</script>

<template>
  <div
    :class="textColorClass"
    class="transaction-type"
    data-test-id="transaction-type"
  >
    <span class="mr-1" data-test-id="transaction-type-text">
      {{ text }}
    </span>
    <VIcon
      :icon="iconName"
      size="16"
      data-test-id="transaction-type-icon"
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
