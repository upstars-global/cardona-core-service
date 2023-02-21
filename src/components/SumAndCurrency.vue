<script setup lang="ts">
const props = defineProps<{
  data: {
    remainder?: number
    amount: number
    currency: string
  }
}>()
</script>

<template>
  <div class="d-flex flex-column width-content">
    <div class="text-right">
      <span :key="data.amount" v-currency="data.amount" />

      <span>
        {{ data.currency }}
      </span>
    </div>

    <div v-if="data?.remainder" class="font-small-3">
      <span>
        {{ $t('common.remainder') }}
      </span>

      <span :key="data.remainder" v-currency="data.remainder" />

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
