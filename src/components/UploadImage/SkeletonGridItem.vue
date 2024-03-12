<script setup lang="ts">
import { IconsList } from '../../@model/enums/icons'
</script>

<template>
  <div class="item-file item-skeleton d-flex justify-center align-center">
    <VIcon
      :icon="IconsList.ImageIcon"
      size="18"
      class="icon-no-file"
    />
  </div>
</template>

<style lang="scss">
.item-file {
  position: relative;
  width: calc(25% - 1rem);
  margin: 0.5rem;
  border-radius: 4px;
  border: 1px solid rgba(var(--v-border-color), 0.25);
  color: rgb(var(--v-theme-grey-300));
  font-size: 1rem;
  font-weight: 400;
  cursor: pointer;
  overflow: hidden;

  &.item-skeleton {
    background: rgb(var(--v-theme-grey-100));

    .icon-no-file {
      color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity));
    }
  }

  &:before {
    content: '';
    display: block;
    padding-bottom: 50%;
  }
}
</style>
