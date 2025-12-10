<script setup lang="ts">
import { computed, defineEmits, onBeforeMount, ref, useTemplateRef } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'
import { useNotificationExportStore } from '../../../stores/notificationExport'
import type { INotificationEmitEvent } from '../../../@model/notificationExport'
import {
  reportIsReady,
} from '../../../@model/notificationExport'
import { VColors, VSizes } from '../../../@model/vuetify'
import { useLoaderStore } from '../../../stores/loader'
import NotificationExportListItem from './ListItem.vue'
import NotificationExportEmptyCard from './EmptyCard.vue'

defineOptions({
  name: 'NotificationExportList',
})

defineEmits<INotificationEmitEvent>()

const notificationExportStore = useNotificationExportStore()
const pageNumber = ref(1)
const loaderStore = useLoaderStore()

const fetchList = async (pageNumber: number) => {
  await notificationExportStore.fetchEntityList({
    pagination: {
      pageNumber,
      perPage: 10,
    },
  })
}

const notificationListWrapperRef = useTemplateRef<HTMLElement>('notificationListWrapperRef')

const isLoading = computed(() => loaderStore.isLoadingEndpoint('/report/download/list'))

useInfiniteScroll(
  notificationListWrapperRef,
  async () => {
    if (isLoading.value || !notificationExportStore.canLoadDownLoadList)
      return

    pageNumber.value++

    await fetchList(pageNumber.value)
  },
  {
    distance: 10,
  },
)

onBeforeMount(async () => {
  pageNumber.value = 1
  notificationExportStore.resetDownloadList()
  await fetchList(pageNumber.value)
})

const isNotLastItem = (index: number) => index !== notificationExportStore.getDownloadList.length - 1
const listNotEmpty = computed(() => notificationExportStore.getDownloadList.isNotEmpty)
</script>

<template>
  <div>
    <div
      v-if="listNotEmpty"
      ref="notificationListWrapperRef"
      class="list-wrapper pa-4"
    >
      <NotificationExportListItem
        v-for="(item, index) in notificationExportStore.getDownloadList"
        :key="item.fileUid"
        :data="item"
        :can-download="reportIsReady(item.status)"
        :class="{
          'mb-4': isNotLastItem(index),
        }"
        @download-report="$emit('download-report', $event)"
      />
      <div
        v-if="isLoading"
        class="d-flex justify-center align-center pt-4"
      >
        <VProgressCircular
          indeterminate
          :size="VSizes.Small"
          :color="VColors.Primary"
        />
      </div>
      <div
        v-else
        class="gradient-bottom"
      />
    </div>
    <div
      v-if="isLoading && !listNotEmpty"
      class="d-flex justify-center align-center pa-4"
    >
      <VProgressCircular
        indeterminate
        :size="VSizes.Small"
        :color="VColors.Primary"
      />
    </div>
    <div v-else-if="!listNotEmpty && !isLoading">
      <NotificationExportEmptyCard />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.list-wrapper {
  max-height: 24.25rem;
  overflow: auto;
}
.gradient-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20px;
  background: linear-gradient(to top, rgb(var(--v-theme-background)) 0%, transparent 100%);
}
</style>
