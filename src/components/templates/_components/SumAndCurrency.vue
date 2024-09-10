<script setup lang="ts">
import { AlignType } from '../../../@model/templates/tableFields'

withDefaults(defineProps<{
  data: {
    remainder?: number
    amount: number
    currency: string
  }
  align: AlignType
}>(), {
  align: AlignType.Right,
})
</script>

<template>
  <div
    class="d-flex flex-column width-content justify-start"
    :class="{
      [`text-${align}`]: true,
      'mx-auto': align === AlignType.Center,
      'ml-auto': align === AlignType.Right,
    }"
  >
    <div>
      <span
        :key="data.amount"
        v-currency="data.amount"
      />

      <span class="pl-1">
        {{ data.currency }}
      </span>
    </div>

    <div
      v-if="data?.remainder"
      class="font-weight-light"
      test-id="data-remainder"
    >
      <span class="pl-1"  test-id="data-remainder-label">
        {{ $t('common.remainder') }}
      </span>

      <span
        :key="data.remainder"
        test-id="data-remainder-value"
        v-currency="data.remainder"
        class="px-1"
      />
      <span>
        {{ data.currency }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.width-content {
  width: max-content;
}
</style>
