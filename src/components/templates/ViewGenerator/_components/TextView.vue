<script setup lang="ts">
import type { ViewInfo } from '../../../../@model/view'

defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <div>
    <span
      data-test-id="text"
      class="mb-0 text-color-base"
    >
      {{ item.value || '-' }}
    </span>

    <slot
      name="copy-btn"
      :value="item.value"
    />
  </div>
</template>
