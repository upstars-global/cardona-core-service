<script setup lang="ts">
import type { ViewInfo } from '../../../../@model/view'

defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <label class="comment-view-text mb-0">{{ item.value ? item.value : '-' }}</label>
</template>
