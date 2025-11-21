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
      class="position-relative icon-file bg-grey-200 pa-2 rounded-circle d-flex justify-center align-center"
      :style="`width: ${wrapperSize}px; height: ${wrapperSize}px;`"
    >
      <VIcon
        class="icon-file-body bg-grey-400"
        :icon="IconsList.FileIcon"
        :size="iconSize"
      />
      <slot />
    </div>
  </div>
</template>
