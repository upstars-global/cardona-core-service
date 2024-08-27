<script setup lang="ts">
withDefaults(defineProps<{
  data: {
    remainder?: number
    amount: number
    currency: string
  }
  align: 'left' | 'right' | 'center'
}>(), {
  align: 'right',
})
</script>

<template>
  <div
    class="d-flex flex-column width-content justify-start"
    :class="`text-${align}`"
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
    >
      <span class="pl-1">
        {{ $t('common.remainder') }}
      </span>

      <span
        :key="data.remainder"
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
