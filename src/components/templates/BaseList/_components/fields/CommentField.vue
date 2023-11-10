<script setup lang="ts">
defineProps<{
  value?: string
}>()
</script>

<template>
  <div class="comment-text">
    {{ value ? value : '-' }}

    <VTooltip
      activator="parent"
      location="bottom"
    >
      <div class="comment-text__tooltip">
        {{ value }}
      </div>
    </VTooltip>
  </div>
</template>

<style lang="scss" scoped>
.comment-text {
  width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &__tooltip {
    width: 15rem;
  }
}
</style>
