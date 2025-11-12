<script setup lang="ts">
import { defineEmits, onBeforeMount } from 'vue'
import { useNotificationExportStore } from '../../../stores/notificationExport'
import { NotificationStatuses } from '../../../@model/notificationExport'
import type {
  IDownloadListReportNotificationItem,
  INotificationEmitEvent,
} from '../../../@model/notificationExport'
import NotificationExportListItem from './ListItem.vue'
import NotificationExportEmptyCard from './EmptyCard.vue'

defineOptions({
  name: 'NotificationExportList',
})

defineEmits<INotificationEmitEvent>()

const notificationExportStore = useNotificationExportStore()

onBeforeMount(async () => {
  await notificationExportStore.fetchEntityList({
    pagination: {
      pageNumber: 1,
      perPage: 5,
    },
  })
})

const canDownload = (item: IDownloadListReportNotificationItem) => item.status === NotificationStatuses.Done
</script>

<template>
  <div>
    <div
      v-if="notificationExportStore.getDownloadList.isNotEmpty"
      class="list-wrapper pa-4"
    >
      <NotificationExportListItem
        v-for="item in notificationExportStore.getDownloadList"
        :key="item.fileUid"
        :data="item"
        :can-download="canDownload(item)"
        class="my-4"
        @download-report="$emit('download-report', $event)"
      />
    </div>
    <div v-else>
      <NotificationExportEmptyCard />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.list-wrapper {
  max-height: 16rem;
  overflow: auto;
}
</style>
