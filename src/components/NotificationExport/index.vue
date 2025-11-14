<script setup lang="ts">
import { computed, onBeforeMount, onBeforeUnmount, ref, watch } from 'vue'

import { useI18n } from 'vue-i18n'
import { IconsList } from '../../@model/enums/icons'
import { VColors, VSizes, VVariants } from '../../@model/vuetify'
import WSService from '../../services/ws'
import { Location } from '../../@model/enums/tooltipPlacement'
import { useNotificationExportStore } from '../../stores/notificationExport'
import { reportIsReady } from '../../@model/notificationExport'
import NotificationExportList from './list/index.vue'
import { useNotificationToast } from './_composables/useNotificationToast'

defineOptions({
  name: 'NotificationExport',
})

import { Channel } from '@/configs/wsConfig'

// enum Channel {
//   Payouts = 'payouts-feed',
//   Nitifications = 'notification-push',
// }
//
// const mockItem = () => ({
//   reportId: 212,
//   entityType: 'ACTIONS_BALANCES',
//   status: NotificationStatuses.Done,
//   ttl: '2025-11-14 15:54:27',
// })

const { t } = useI18n()
const { showToast } = useNotificationToast()
const notificationMenuState = ref(false)
const notificationExportStore = useNotificationExportStore()

const existNewNotification = computed(() => notificationExportStore.existingNotifications && !notificationMenuState.value)

onBeforeMount(async () => {
  WSService.subscribe(Channel.Nitifications)
})

onBeforeUnmount(async () => {
  WSService.unsubscribe(Channel.Nitifications)
})

const callToast = ({
  entityName, reportId,
}: { entityName: string; reportId: number }) => {
  showToast({
    entityName,
    downloadHandler: () => notificationExportStore.downloadReport(reportId),
  })
}

const setMenuState = (state: boolean) => {
  notificationMenuState.value = state
}

const onChangeMenuState = () => {
  notificationExportStore.resetNotifications()
}

watch(() => notificationExportStore.getLastNotification, newVal => {
  if (!newVal || !reportIsReady(newVal.status))
    return
  callToast({
    entityName: t(`notificationReport.entityType.${newVal?.entityType}`),
    reportId: newVal?.reportId,
  })
}, { deep: true })
</script>

<template>
  <div>
<!--    <VBtn @click="notificationExportStore.createWSData({data: mockItem()})">Set ws data</VBtn>-->
    <VMenu
      v-model="notificationMenuState"
      eager
      persistent
      no-click-animation
      :model-value="notificationMenuState"
      :close-on-content-click="false"
      :close-on-back="false"
      :close-on-backdrop-click="false"
      @update:model-value="onChangeMenuState"
    >
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
              @click="setMenuState(notificationMenuState)"
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
        <VCardTitle class="pa-4 d-flex justify-space-between align-center">
          <div class="text-h5 d-flex align-center">
            {{ $t('notification.list._') }}
          </div>
          <div>
            <VIcon
              :icon="IconsList.XIcon"
              :size="20"
              class="text-color-mute"
              @click="notificationMenuState = false"
            />
          </div>
        </VCardTitle>
        <VCardText class="pa-0 position-relative">
          <hr class="ma-0">
          <NotificationExportList @download-report="notificationExportStore.downloadReport" />
        </VCardText>
      </VCard>
    </VMenu>
  </div>
</template>

<style lang="scss" scoped>
.notification-list {
  width: 24.25rem;
}
</style>
