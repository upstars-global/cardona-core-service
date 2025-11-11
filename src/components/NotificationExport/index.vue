<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount } from 'vue'
import { useNotificationExportStore } from 'cardona-core-service/src/stores/notificationExport'
import { IconsList } from '../../@model/enums/icons'
import { VColors, VSizes, VVariants } from '../../@model/vuetify'
import { Location } from '../../@model/enums/tooltipPlacement'
import {
  NotificationStatuses,
  getNotificationColor,
  getNotificationIcon,
} from '../../@model/notificationExport'
import WSService from '../../services/ws'
import { Channel } from '@/configs/wsConfig'

defineOptions({
  name: 'NotificationExport',
})

const notificationExportStore = useNotificationExportStore()
const existNewNotification = false

onBeforeMount(async () => {
  WSService.subscribe(Channel.Nitifications)

  const res = await notificationExportStore.fetchEntityList({
    pagination: {
      pageNumber: 1,
      perPage: 5,
    },
  })

  console.log(res)
})

onBeforeUnmount(async () => {
  WSService.unsubscribe(Channel.Nitifications)
})
</script>

<template>
  <div>
    <VMenu>
      <template #activator="{ props: menuProps }">
        <VTooltip
          :location="Location.Left"
          :text="$t('notification._')"
        >
          <template #activator="{ props: tooltipProps }">
            <VBtn
              v-bind="{ ...tooltipProps, ...menuProps }"
              :variant="VVariants.Text"
              :size="VSizes.XSmall"
              :color="VColors.Secondary"
              rounded="lg"
              icon
            >
              <VBadge
                v-if="existNewNotification"
                :color="VColors.Primary"
                dot
              >
                <VIcon
                  :icon="IconsList.BellIcon"
                  :size="20"
                />
              </VBadge>
              <VIcon
                v-else
                :icon="IconsList.BellIcon"
                :size="20"
              />
            </VBtn>
          </template>
        </VTooltip>
      </template>
      <VCard class="notification-list">
        <VCardTitle class="pa-4">
          <div class="text-h5 d-flex align-center">
            {{ $t('notification.list._') }}
          </div>
        </VCardTitle>
        <VCardText class="pa-0">
          <hr class="ma-0">
          <div
            v-for="status in Object.values(NotificationStatuses)"
            :key="status"
            class="pa-4"
            style="width: 32px"
          >
            <div class="position-relative icon-file bg-grey-100 pa-2 rounded-circle d-flex justify-center align-center">
              <VIcon
                class="icon-file-body"
                :icon="IconsList.FileIcon"
                size="18"
              />
              <div
                class="position-absolute icon-status-wrapper rounded-circle d-flex justify-center align-center pa-2"
                :class="`bg-${getNotificationColor(status)}`"
              >
                <VIcon
                  :icon="getNotificationIcon(status)"
                  size="12"
                />
              </div>
            </div>
          </div>
        </VCardText>
      </VCard>
    </VMenu>
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
