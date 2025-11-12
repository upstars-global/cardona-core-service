<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { useNotificationExportStore } from '../../../stores/notificationExport'
import NotificationExportListItem from './ListItem.vue'
import NotificationExportEmptyCard from './EmptyCard.vue'

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
    <div
      v-if="notificationExportStore.getDownloadList.isNotEmpty"
      class="list-wrapper"
    >
      <NotificationExportListItem
        v-for="item in notificationExportStore.getDownloadList"
        :key="item.fileUid"
        :data="item"
      />
    </div>
    <div v-else>
      <NotificationExportEmptyCard />
    </div>
  </div>
</template>
