<script setup lang="ts">
import { IconsList } from '../../@model/enums/icons'
import { VColors, VSizes, VVariants } from '../../@model/vuetify'

defineOptions({
  name: 'NotificationExport',
})
</script>

<template>
  <div>
    <VBtn
      :variant="VVariants.Text"
      :size="VSizes.XSmall"
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
  </div>
</template>
