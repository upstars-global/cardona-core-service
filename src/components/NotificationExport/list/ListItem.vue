<script setup lang="ts">
import type { IDownloadListReportNotificationItem } from '../../../@model/notificationExport'
import { IconsList } from '../../../@model/enums/icons'
import { VSizes } from '../../../@model/vuetify'
import NotificationExportIconStatus from './IconStatus.vue'

defineOptions({
  name: 'NotificationExportListItem',
})

defineProps<Props>()

interface Props {
  data: IDownloadListReportNotificationItem
}
</script>

<template>
  <div class="list-item d-flex align-start">
    <div class="list-item-icon">
      <NotificationExportIconStatus :status="data.status" />
    </div>
    <div class="list-item-content ml-2">
      <div class="list-item-title text-body-1 font-weight-medium">
        {{ data.entityType }}
      </div>
      <div class="text-body-2 text-color-placeholder-disabled">
        {{ data.ttl }}
      </div>
    </div>
    <div class="list-item-actions ml-auto">
      <VBtn
        :size="VSizes.XSmall"
        icon
        rounded="lg"
      >
        <VIcon :icon="IconsList.DownloadIcon" />
      </VBtn>
    </div>
  </div>
</template>
