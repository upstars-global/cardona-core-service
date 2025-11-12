<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, ref } from 'vue'
import { IconsList } from '../../@model/enums/icons'
import { VColors, VSizes, VVariants } from '../../@model/vuetify'
import WSService from '../../services/ws'
import { Location } from '../../@model/enums/tooltipPlacement'
import NotificationExportList from './list/index.vue'

defineOptions({
  name: 'NotificationExport',
})

const notificationMenuState = ref(false)

// import { Channel } from '@/configs/wsConfig'
enum Channel {
  Payouts = 'payouts-feed',
  Nitifications = 'notification-push',
}
const existNewNotification = false

onBeforeMount(async () => {
  WSService.subscribe(Channel.Nitifications)
})

onBeforeUnmount(async () => {
  WSService.unsubscribe(Channel.Nitifications)
})
</script>

<template>
  <div>
    <VMenu
      persistent
      no-click-animation
      :model-value="notificationMenuState"
      :close-on-content-click="false"
      :close-on-back="false"
      :close-on-backdrop-click="false"
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
              @click="notificationMenuState = !notificationMenuState"
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
        <VCardText class="pa-0">
          <hr class="ma-0">
          <NotificationExportList />
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
