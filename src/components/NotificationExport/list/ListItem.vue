<script setup lang="ts">
import { defineEmits } from 'vue'
import type { IDownloadListReportNotificationItem, INotificationEmitEvent } from '../../../@model/notificationExport'
import { IconsList } from '../../../@model/enums/icons'
import { VSizes } from '../../../@model/vuetify'
import NotificationExportIconStatus from './IconStatus.vue'

defineOptions({
  name: 'NotificationExportListItem',
})

defineProps<Props>()

defineEmits<INotificationEmitEvent>()

interface Props {
  data: IDownloadListReportNotificationItem
  canDownload?: boolean
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
    <div
      v-if="canDownload"
      class="list-item-actions ml-auto"
    >
      <VBtn
        :size="VSizes.XSmall"
        icon
        rounded="lg"
        @click="$emit('download-report', data.reportId)"
      >
        <VIcon :icon="IconsList.DownloadIcon" />
      </VBtn>
    </div>
  </div>
</template>
