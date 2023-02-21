<template>
  <div class="skeleton-grid d-flex flex-wrap">
    <div
      v-for="n in number"
      :key="`skeleton-${n}`"
      class="item-file item-skeleton d-flex justify-content-center align-items-center"
    >
      <feather-icon icon="ImageIcon" size="18" class="icon-no-file mb-0" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SkeletonGrid',
  props: {
    number: {
      type: Number,
      default: 12,
    },
  },
})
</script>

<style lang="scss">
@import '~@core/scss/base/bootstrap-extended/_include';
.skeleton-grid {
  width: 100%;

  .item-file {
    position: relative;
    width: calc(25% - 1rem);
    margin: 0.5rem;
    border-radius: 4px;
    border: 1px solid $border-color;
    color: $body-color;
    font-size: 1rem;
    font-weight: 400;
    cursor: pointer;
    overflow: hidden;

    &.item-skeleton {
      background: $input-disabled-bg;

      .icon-no-file {
        color: $text-muted;
      }
    }

    &:before {
      content: '';
      display: block;
      padding-bottom: 50%;
    }
  }
}
</style>
