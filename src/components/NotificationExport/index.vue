<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount } from 'vue'
import { IconsList } from '../../@model/enums/icons'
import { VColors, VSizes, VVariants } from '../../@model/vuetify'
import { Location } from '../../@model/enums/tooltipPlacement'
import WSService from '../../services/ws'
import NotificationExportList from './list.vue'
import { Channel } from '@/configs/wsConfig'

defineOptions({
  name: 'NotificationExport',
})

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
