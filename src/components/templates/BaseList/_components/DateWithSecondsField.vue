<template>
  <span v-if="!date">-</span>
  <span
    v-else
    :key="fullDate.getTime()"
    v-full-date-with-seconds="fullDate"
    class="white-space-nowrap"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  date?: string | Date
}>()

const fullDate = computed(() =>
  props.date instanceof Date ? props.date : props.date ? new Date(props.date) : ''
)
</script>
