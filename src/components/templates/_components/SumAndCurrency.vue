<script setup lang="ts">
defineProps<{
  data: {
    remainder?: number
    amount: number
    currency: string
  }
}>()
</script>

<template>
  <div class="d-flex flex-column width-content currency-wrapper">
    <div>
      <span
        :key="data.amount"
        v-currency="data.amount"
      />

      <span>
        {{ data.currency }}
      </span>
    </div>

    <div
      v-if="data?.remainder"
      class="font-weight-light"
    >
      <span>
        {{ $t('common.remainder') }}
      </span>

      <span
        :key="data.remainder"
        v-currency="data.remainder"
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

.currency-wrapper {
  margin-left: auto;
  text-align: right;
}
</style>
