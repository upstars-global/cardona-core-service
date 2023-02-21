<script setup lang="ts">
import { StatusWithDateValue } from '@model/view'
import StatusField from './StatusField.vue'
import DateField from './DateField.vue'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    item: StatusWithDateValue
    size?: string
  }>(),
  {
    size: 'md',
  }
)

const dateClasses = computed(() => ({
  'font-small-3': props.size === 'sm',
}))
</script>

<template>
  <div class="status-with-date">
    <status-field :status="item.status" />

    <date-field :class="dateClasses" :date="item.updatedAt" />
  </div>
</template>

<style lang="scss" scoped>
.status-with-date {
  display: flex;
  flex-direction: column;
  align-items: end;
}
</style>

