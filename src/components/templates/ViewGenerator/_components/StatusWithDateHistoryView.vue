<script setup lang="ts">
import type { ViewInfo } from '../../../../@model/view'

defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <div class="status-history--wrapper">
    <div
      v-for="(data, index) in item.value"
      :key="index"
    >
      <div class="font-weight-bolder mb-25">
        {{ data.title }}
      </div>
      <DateField
        class="font-weight-light"
        :date="data.date"
      />
    </div>
  </div>
</template>
