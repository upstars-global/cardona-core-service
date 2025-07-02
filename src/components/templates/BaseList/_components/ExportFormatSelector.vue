<script setup lang="ts">
import { computed } from 'vue'
import { pickBy } from 'lodash'
import { ExportFormat } from '../../../../@model/templates/baseList'
import { IconsList } from '../../../../@model/enums/icons'
import { VColors, VVariants } from '../../../../@model/vuetify'
import { IS_TEST_ENV } from '../../../../utils/constants'

interface Props {
  formatOfExports?: Array<ExportFormat>
}

const props = withDefaults(defineProps<Props>(), {
  formatOfExports: [ExportFormat.JSON, ExportFormat.JSON],
})

const emits = defineEmits<{
  (e: 'exportFormatSelected', format: string): void
}>()

const onClick = (format: string) => emits('exportFormatSelected', format)

const actualExportFormats = computed(() => {
  if (props?.formatOfExports?.isEmpty)
    return ExportFormat

  return pickBy(ExportFormat, (value: ExportFormat) => props.formatOfExports.includes(value))
})

const isOneTypeExport = computed(() => props.formatOfExports.length === 1)
</script>

<template>
  <div>
    <VMenu :attach="IS_TEST_ENV">
      <template #activator="{ props }">
        <VBtn
          :variant="VVariants.Outlined"
          :color="VColors.Secondary"
          v-bind="isOneTypeExport ? {} : props"
          :prepend-icon="IconsList.UploadIcon"
          data-test-id="menu-activator"
          @click="isOneTypeExport && onClick(formatOfExports[0])"
        >
          {{ $t('action.export') }}
        </VBtn>
      </template>
      <VList v-if="!isOneTypeExport">
        <VListItem
          v-for="(value, key) in actualExportFormats"
          :key="value"
          :data-test-id="`export-${value}`"
          @click="onClick(value)"
        >
          {{ key }}
        </VListItem>
      </VList>
    </VMenu>
  </div>
</template>
