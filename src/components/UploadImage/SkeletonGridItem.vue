<template>
  <div class="item-file item-skeleton d-flex justify-content-center align-items-center">
    <feather-icon icon="ImageIcon" size="18" class="icon-no-file mb-0" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SkeletonGridItem',
})
</script>

<style lang="scss">
@import 'src/@core/scss/base/bootstrap-extended/_include';

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
</style>
