<script setup lang="ts">
const props = defineProps<{
  value?: string
}>()
</script>

<template>
  <div v-b-tooltip.hover.top="value" class="comment-text">
    {{ value ? value : '-' }}
  </div>
</template>

<style lang="scss" scoped>
.comment-text {
  width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
