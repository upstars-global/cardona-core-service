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
  <div>
    <div class="whitespace-no-wrap">
      <span>
        {{ $t('component.sumPeriod.today') }}
      </span>

      <span
        :key="data.today"
        v-currency="data.today"
      />

      <span>
        {{ data.currency }}
      </span>
    </div>

    <div class="whitespace-no-wrap">
      <span>
        {{ $t('component.sumPeriod.week') }}
      </span>

      <span
        :key="data.week"
        v-currency="data.week"
      />

      <span>
        {{ data.currency }}
      </span>
    </div>

    <div class="whitespace-no-wrap">
      <span>
        {{ $t('component.sumPeriod.month') }}
      </span>

      <span
        :key="data.month"
        v-currency="data.month"
      />

      <span>
        {{ data.currency }}
      </span>
    </div>
  </div>
</template>
