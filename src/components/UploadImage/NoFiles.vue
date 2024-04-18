<script setup lang="ts">
import { IconsList } from '../../@model/enums/icons'
</script>

<template>
  <div class="not-files-block d-flex flex-column justify-center align-center">
    <VIcon
      :icon="IconsList.ImageIcon"
      size="32"
      class="icon-no-file mb-1"
    />
    <p class="text-body-heading font-weight-bold mb-0">
      {{ $t('uploadImg.nothingInFolder') }}
    </p>
    <p class="font-small-3">
      {{ $t('uploadImg.ChooseDifferentFolder') }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.not-files-block {
  height: 16.625rem;

  .icon-no-file {
    color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity));
  }
}
</style>
