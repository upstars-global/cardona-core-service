<script setup lang="ts">
import { IconsList } from '../../@model/enums/icons'
import type { NotificationStatuses } from '../../@model/notificationExport'
import { getNotificationColor, getNotificationIcon } from '../../@model/notificationExport'

defineOptions({
  name: 'NotificationExportIconStatus',
})

const props = defineProps<{
  status: NotificationStatuses
}>()

const color = computed(() => getNotificationColor(props.status))
const icon = computed(() => getNotificationIcon(props.status))
</script>

<template>
  <div class="position-relative icon-file bg-grey-100 pa-2 rounded-circle d-flex justify-center align-center">
    <VIcon
      class="icon-file-body"
      :icon="IconsList.FileIcon"
      size="18"
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
</template>

<style lang="scss" scoped>
.notification-list {
  width: 24.25rem;
}

.icon-file {
  width: 32px; height: 32px;
  background-color: rgba(var(--v-theme-grey-100), var(--v-opacity-grey));
  &-body {
    background-color: rgba(var(--v-theme-grey-500), var(--v-opacity-grey));

  }
}
.icon-status-wrapper {
  width: 18px; height: 18px;
  bottom: -4px; right: -4px;
  border: 1px solid white;

}
</style>
