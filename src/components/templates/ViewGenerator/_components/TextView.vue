<script setup lang="ts">
import { ViewInfo } from '@model/view'

const props = defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <label class="mb-0">{{ item.value }}</label>
</template>
