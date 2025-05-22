<script setup lang="ts">
import type { ViewInfo } from '../../../../@model/view'
import DateField from '../../_components/DateField.vue'

defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <div>
    <DateField :date="item.value">
      <template #copy-btn="{ value }">
        <slot
          name="copy-btn"
          :value="value"
        />
      </template>
    </DateField>
  </div>
</template>
