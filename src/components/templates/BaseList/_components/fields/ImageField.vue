<script setup lang="ts">
import { ListSize } from '../../../../../@model/templates/tableFields'

withDefaults(defineProps<{
  imagePath: string
  size?: ListSize
}>(), {
  size: ListSize.MD,
})
</script>

<template>
  <div
    class="img-block"
    :class="[`img-block--${size}`]"
    :style="`background-image: url(${imagePath});`"
  />
</template>

<style lang="scss" scoped>
.img-block {
  border-radius: 0.286rem;
  background-size: cover;
  background-position: 50%;

  &--md {
    width: 6rem;
    height: 3rem;
  }

  &--sm {
    width: 3rem;
    height: 3rem;
  }

  &--full {
    width: 100%;
    height: 100%;
  }
}
</style>
