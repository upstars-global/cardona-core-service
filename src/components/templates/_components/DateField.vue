<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  date?: string | Date
}>()

const fullDate = computed(() =>
  props.date instanceof Date ? props.date : props.date ? new Date(props.date) : '',
)
</script>

<template>
  <span
    v-if="!date"
    data-test-if="date-field-empty"
  >-</span>
  <span
    v-else
    :key="fullDate.getTime()"
    v-full-date="fullDate"
    class="white-space-nowrap"
  />
</template>
