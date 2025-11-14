<script setup lang="ts">
import { IconsList } from '../../../@model/enums/icons'

defineOptions({
  name: 'NotificationExportIconFile',
})

defineProps<{
  iconSize: number
  wrapperSize: number
}>()
</script>

<template>
  <div>
    <div
      class="position-relative icon-file bg-grey-100 pa-2 rounded-circle d-flex justify-center align-center"
      :style="`width: ${wrapperSize}px; height: ${wrapperSize}px;`"
    >
      <VIcon
        class="icon-file-body"
        :icon="IconsList.FileIcon"
        :size="iconSize"
      />
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.icon-file {
  background-color: rgba(var(--v-theme-grey-100), var(--v-opacity-grey));
  &-body {
    background-color: rgba(var(--v-theme-grey-500), var(--v-opacity-grey));

  }
}
</style>
