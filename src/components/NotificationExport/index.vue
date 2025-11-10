<script setup lang="ts">
import { IconsList } from '../../@model/enums/icons'
import { VColors, VSizes, VVariants } from '../../@model/vuetify'
import { Location } from '../../@model/enums/tooltipPlacement'

defineOptions({
  name: 'NotificationExport',
})
</script>

<template>
  <div>
    <VTooltip :location="Location.Left" :text="$t('notification._')">
      <template #activator="{ props }">
        <VBtn
          v-bind="props"
          :variant="VVariants.Text"
          :size="VSizes.XSmall"
          :color="VColors.Secondary"
          rounded="lg"
          icon
        >
          <VBadge
            :color="VColors.Primary"
            dot
          >
            <VIcon
              :icon="IconsList.BellIcon"
              :size="20"
            />
          </VBadge>
        </VBtn>
      </template>
    </VTooltip>
  </div>
</template>
