<script setup lang="ts">
import { computed, defineEmits } from 'vue'
import type {
  IDownloadListReportNotificationItem,
  INotificationEmitEvent,
} from '../../../@model/notificationExport'
import {
  NotificationStatuses,

  getNotificationStatus,
} from '../../../@model/notificationExport'
import { IconsList } from '../../../@model/enums/icons'
import { VSizes } from '../../../@model/vuetify'
import NotificationExportIconStatus from './IconStatus.vue'

defineOptions({
  name: 'NotificationExportListItem',
})

const props = defineProps<Props>()

defineEmits<INotificationEmitEvent>()

interface Props {
  data: IDownloadListReportNotificationItem
  canDownload?: boolean
}

const showDate = (status: NotificationStatuses) => [NotificationStatuses.Done, NotificationStatuses.Error].includes(status)
const labelStatus = computed(() => getNotificationStatus(props.data.status))
</script>

<template>
  <div class="list-item d-flex align-start">
    <div class="list-item-icon">
      <NotificationExportIconStatus :status="data.status" />
    </div>
    <div class="list-item-content ml-2">
      <div class="list-item-title">
        <span class="text-body-1 font-weight-medium">
          {{ data.entityType }}
        </span>
        <span class="list-item-title-description text-color-mute font-weight-medium">
          {{ data.message }}
        </span>
      </div>
      <div class="text-body-2 text-color-placeholder-disabled">
        <span v-if="labelStatus">{{ labelStatus }}</span><span v-if="showDate(data.status)">{{ data.ttl }}</span>
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
