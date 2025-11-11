<script setup lang="ts">
import { useNotificationExportStore } from '../../stores/notificationExport'
import NotificationExportListItem from './listItem.vue'

defineOptions({
  name: 'NotificationExportList',
})

const notificationExportStore = useNotificationExportStore()

onBeforeMount(async () => {
  await notificationExportStore.fetchEntityList({
    pagination: {
      pageNumber: 1,
      perPage: 5,
    },
  })
})
</script>

<template>
  <div>
    <NotificationExportListItem
      v-for="item in notificationExportStore.getDownloadList"
      :key="item.fileUid"
      :data="item"
    />
  </div>
</template>
