<script setup lang="ts">
import type { IDownloadListReportNotificationItem } from '../../@model/notificationExport'
import NotificationExportIconStatus from './iconStatus.vue'

defineOptions({
  name: 'NotificationExportListItem',
})

defineProps<Props>()

interface Props {
  data: IDownloadListReportNotificationItem
}
</script>

<template>
  <div>
    <VRow>
      <VCol>
        <NotificationExportIconStatus :status="data.status" />
      </VCol>
      <VCol>
        <div>
          <span>
            {{ data.entityType }}
          </span>
          <p>
            {{ data.message }}
          </p>
        </div>
        <div>
          {{ data.status }}
        </div>
      </VCol>
    </VRow>
  </div>
</template>
