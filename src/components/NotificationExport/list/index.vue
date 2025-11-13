<script setup lang="ts">
import { defineEmits, onBeforeMount, ref, useTemplateRef } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'
import { delay } from 'lodash'
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
const pageNumber = ref(1)

const fetchList = async (pageNumber: number) => {
  await notificationExportStore.fetchEntityList({
    pagination: {
      pageNumber,
      perPage: 5,
    },
  })
}

onBeforeMount(async () => {
  await fetchList(pageNumber.value)
})

const canDownload = (item: IDownloadListReportNotificationItem) => item.status === NotificationStatuses.Done
const notificationListWrapperRef = useTemplateRef<HTMLElement>('notificationListWrapperRef')

const isLoading = ref(false)

useInfiniteScroll(
  notificationListWrapperRef,
  async () => {
    if (isLoading.value)
      return

    isLoading.value = true
    pageNumber.value++

    delay(async () => {
      await fetchList(pageNumber.value)
      isLoading.value = false
    }, 1000)
  },
  {
    distance: 10,

    // canLoadMore: () => !isLoading.value,
  },
)

onBeforeMount(async () => {
  pageNumber.value = 1
  await fetchList(pageNumber.value)
})
</script>

<template>
  <div>
    <div
      v-if="notificationExportStore.getDownloadList.isNotEmpty"
      ref="notificationListWrapperRef"
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
  max-height: 24.25rem;
  overflow: auto;
}
</style>
