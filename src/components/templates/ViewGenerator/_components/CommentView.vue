<script setup lang="ts">
import { ViewInfo } from '@model/view'

const props = defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <label class="comment-view-text mb-0">{{ item.value ? item.value : '-' }}</label>
</template>



