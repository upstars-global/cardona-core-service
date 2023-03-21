<script setup lang="ts">
import { ViewInfo } from '@model/view'
import BadgeCopy from '@/components/BadgeCopy.vue'

const props = defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <badge-copy :value="item.value" :is-view-label="false" />
</template>

