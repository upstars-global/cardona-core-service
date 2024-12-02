<script setup lang="ts">
import { IS_TEST_ENV } from '@/utils/constants'

defineProps<{
  value?: string
}>()
</script>

<template>
  <div
    class="comment-text"
    data-test-id="comment-text"
  >
    {{ value ? value : '-' }}

    <VTooltip
      v-if="value"
      :attach="IS_TEST_ENV"
      activator="parent"
      location="bottom"
    >
      <div
        class="comment-text__tooltip text-body-1"
        data-test-id="comment-text-tooltip"
      >
        {{ value }}
      </div>
    </VTooltip>
  </div>
</template>

<style lang="scss" scoped>
.comment-text {
  width: 100%;
  max-width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &__tooltip {
    width: 100%;
    max-width: 15rem;
    word-break: break-all;
    text-align: center;
    color: rgb(var(--v-theme-on-primary));
  }
}
</style>
