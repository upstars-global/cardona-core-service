<script setup lang="ts">
import { ExportFormat } from '../../../../@model/templates/baseList'

defineProps<{
  disabled: boolean
}>()

const emits = defineEmits<{
  (e: 'exportFormatSelected', format: string): void
}>()

const onClick = (format: string) => emits('exportFormatSelected', format)
</script>

<template>
  <!--
    <b-dropdown variant="outline-secondary" :disabled="disabled">
    <template #button-content>
    <feather-icon :icon="IconsList.UploadIcon" />

    <span class="ml-50">
    {{ $t('action.export') }}
    </span>
    </template>

    <template #default>
    <b-dropdown-item v-for="(value, key) in ExportFormat" :key="value" @click="onClick(value)">
    {{ key }}
    </b-dropdown-item>
    </template>
    </b-dropdown>
  -->
  <VMenu>
    <template #activator="{ props }">
      <!-- TODO: refactor variant/color -->
      <VBtn
        color="primary"
        v-bind="props"
      >
        Activator slot
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
