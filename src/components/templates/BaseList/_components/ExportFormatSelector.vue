<script setup lang="ts">
import { computed } from 'vue'
import { pickBy } from 'lodash'
import { ExportFormat } from '../../../../@model/templates/baseList'
import { IconsList } from '../../../../@model/enums/icons'
import { VColors, VSizes, VVariants } from '../../../../@model/vuetify'
import { IS_TEST_ENV } from '../../../../utils/constants'

interface Props {
  formatOfExports?: Array<ExportFormat>
  small?: boolean
  isLoadingExport?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoadingExport: false,
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
          :size="small ? VSizes.Small : VSizes.Medium"
          :variant="VVariants.Outlined"
          :color="VColors.Secondary"
          v-bind="isOneTypeExport ? {} : props"
          data-test-id="menu-activator"
          @click="isOneTypeExport && onClick(formatOfExports[0])"
        >
          <span class="px-1">
            <VIcon
              v-if="!isLoadingExport"
              :icon="IconsList.UploadIcon"
            />
            <VProgressCircular
              v-else
              indeterminate
              :size="20"
            />
          </span> {{ $t('action.export') }}
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
