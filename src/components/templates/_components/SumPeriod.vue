<script setup lang="ts">
const props = defineProps<{
  data: {
    today: number
    week: number
    month: number
    currency?: string
  }
}>()
</script>

<template>
  <div class="sum-period-wrapper">
    <div class="whitespace-no-wrap">
      <span data-test-id="label-today">
        {{ $t('component.sumPeriod.today') }}
      </span>

      <span
        :key="data.today"
        v-currency="data.today"
        data-test-id="data-today"
        class="mr-1 font-weight-medium"
      />

      <span class="font-weight-medium" data-test-id="data-today-currency">
        {{ data.currency }}
      </span>
    </div>

    <div class="whitespace-no-wrap">
      <span data-test-id="label-week">
        {{ $t('component.sumPeriod.week') }}
      </span>

      <span
        :key="data.week"
        v-currency="data.week"
        data-test-id="data-week"
        class="mr-1 font-weight-medium"
      />

      <span data-test-id="data-week-currency" class="font-weight-medium">
        {{ data.currency }}
      </span>
    </div>

    <div class="whitespace-no-wrap">
      <span data-test-id="label-month">
        {{ $t('component.sumPeriod.month') }}
      </span>

      <span
        :key="data.month"
        v-currency="data.month"
        data-test-id="data-month"
        class="mr-1 font-weight-medium"
      />

      <span class="font-weight-medium" data-test-id="data-month-currency">
        {{ data.currency }}
      </span>
    </div>
  </div>
</template>
