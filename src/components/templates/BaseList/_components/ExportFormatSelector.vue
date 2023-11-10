<script setup lang="ts">
import { ExportFormat } from '../../../../@model/templates/baseList'
import { IconsList } from '../../../../@model/enums/icons'
import { VColors, VVariants } from '../../../../@model/vuetify'

defineProps<{
  disabled: boolean
}>()

const emits = defineEmits<{
  (e: 'exportFormatSelected', format: string): void
}>()

const onClick = (format: string) => emits('exportFormatSelected', format)
</script>

<template>
  <VMenu>
    <template #activator="{ props }">
      <VBtn
        :variant="VVariants.Outlined"
        :color="VColors.Secondary"
        v-bind="props"
        :prepend-icon="IconsList.UploadIcon"
      >
        {{ $t('action.export') }}
      </VBtn>
    </template>
    <VList>
      <VListItem
        v-for="(value, key) in ExportFormat"
        :key="value"
        @click="onClick(value)"
      >
        {{ key }}
      </VListItem>
    </VList>
  </VMenu>
</template>
