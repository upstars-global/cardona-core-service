<script setup lang="ts">
import { computed } from 'vue'
import type { ReportFileStatus } from '../../../@model/notificationExport'
import { getNotificationColor, getNotificationIcon } from '../../../@model/notificationExport'
import NotificationExportIconFile from './IconFile.vue'

defineOptions({
  name: 'NotificationExportIconStatus',
})

const props = defineProps<{
  status: ReportFileStatus
}>()

const color = computed(() => getNotificationColor(props.status))
const icon = computed(() => getNotificationIcon(props.status))
</script>

<template>
  <div class="position-relative icon-file pa-2 rounded-circle d-flex justify-center align-center">
    <NotificationExportIconFile
      :icon-size="18"
      :wrapper-size="32"
    />
    <div
      class="position-absolute icon-status-wrapper rounded-circle d-flex justify-center align-center pa-2"
      :class="`bg-${color}`"
    >
      <VIcon
        :icon="icon"
        size="12"
      />
    </div>
  </div>
</template>s

<style lang="scss" scoped>
.icon-file {
  width: fit-content;
}
.icon-status-wrapper {
  width: 18px; height: 18px;
  bottom: 2px; right: 4px;
  border: 1px solid rgb(var(--v-theme-surface));
}
</style>
