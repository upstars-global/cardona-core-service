<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { IconsList } from '../../../../@model/enums/icons'
import { BSize } from '../../../../@model/bootstrap'
import type { IBaseListConfig } from '../../../../@model/templates/baseList'
import AppTextField from '../../../../@core/components/app-form-elements/AppTextField.vue'
import { VColors, VVariants } from '../../../../@model/vuetify'
import ExportFormatSelector from '../../../../components/templates/BaseList/_components/ExportFormatSelector.vue'
import type { BaseField } from '../../../../@model/templates/baseField'

interface Props {
  config: IBaseListConfig
  modelValue: string
  selectedFilters: Array<BaseField>
  exportSelector: {
    canShow: boolean
    disable: boolean
  }
  rightSearchBtn: {
    canCreate: boolean
    createPage: string
  }
  isOpenFilterBlock?: boolean
}

interface Emits {
  (e: 'update:modelValue', payload: string): void
  (e: 'on-click-filter'): void
  (e: 'on-export-format-selected', payload: string): void
}
const props = defineProps<Props>()
const emits = defineEmits<Emits>()
const slots = useSlots()
const size = computed(() => (props.config?.small ? BSize.Sm : BSize.Md)) // TODO: refactor sizes

const onFilterButtonClick = () => {
  emits('on-click-filter')
}

const onExportFormatSelected = (format: string) => {
  emits('on-export-format-selected', format)
}

const searchQuery = computed({
  get: () => props.modelValue,
  set: value => emits('update:modelValue', value),
})
</script>

<template>
  <VRow no-gutters>
    <VCol>
      <div class="d-flex gap-4 align-center justify-end">
        <slot name="left-search-btn" />

        <AppTextField
          v-if="config.withSearch"
          v-model="searchQuery"
          :prepend-inner-icon="IconsList.SearchIcon"
          :placeholder="config.searchPlaceholder"
          class="search bg-surface"
        />

        <VBtn
          v-if="config.filterList?.isNotEmpty"
          :variant="VVariants.Outlined"
          :color="VColors.Secondary"
          :active="isOpenFilterBlock"
          @click="onFilterButtonClick"
        >
          <VIcon :icon="IconsList.FilterIcon" />
          <span
            v-if="!config.small"
            class="align-middle ml-1"
          >
            {{ $t('common.filter._') }}
          </span>

          <span
            v-if="selectedFilters?.isNotEmpty"
            class="align-middle ml-1"
          >
            {{ selectedFilters.length }}
          </span>
        </VBtn>

        <ExportFormatSelector
          v-if="exportSelector.canShow"
          :disabled="exportSelector.disable"
          @export-format-selected="onExportFormatSelected"
        />

        <slot
          name="right-search-btn"
          :can-create="rightSearchBtn.canCreate"
          :create-page-name="rightSearchBtn.createPage"
        >
          <VBtn
            v-if="rightSearchBtn.canCreate"
            :to="{ name: rightSearchBtn.createPage }"
            :prepend-icon="IconsList.PlusIcon"
            :color="VColors.Primary"
          >
            <span class="text-nowrap">
              {{ $t('action.create') }}
            </span>
          </VBtn>
        </slot>
      </div>
    </VCol>
  </VRow>
</template>
