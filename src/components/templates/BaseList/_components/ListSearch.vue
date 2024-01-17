<script setup lang="ts">
import { computed } from 'vue'
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
}

interface Emits {
  (e: 'update:modelValue', payload: string): void
  (e: 'onClickFilter'): void
  (e: 'onExportFormatSelected', payload: string): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const size = computed(() => (props.config?.small ? BSize.Sm : BSize.Md)) // TODO: refactor sizes

const onFilterButtonClick = () => {
  emits('onClickFilter')
}

const onExportFormatSelected = (format: string) => {
  emits('onExportFormatSelected', format)
}

const searchQuery = computed({
  get: () => props.modelValue,
  set: value => emits('update:modelValue', value),
})
</script>

<template>
  <VRow no-gutters>
    <VCol>
      <div class="d-flex gap-4 align-center justify-content-end">
        <slot name="left-search-btn" />

        <AppTextField
          v-if="config.withSearch"
          v-model="searchQuery"
          :prepend-inner-icon="IconsList.SearchIcon"
          :placeholder="config.searchPlaceholder"
          :bg-color="VColors.White"
          class="search"
        />

        <VBtn
          v-if="config.filterList?.isNotEmpty"
          :prepend-icon="IconsList.FilterIcon"
          :variant="VVariants.Outlined"
          :color="VColors.Secondary"
          @click="onFilterButtonClick"
        >
          <span
            v-if="!config.small"
            class="align-middle"
          >
            {{ $t('common.filter._') }}
          </span>

          <span
            v-if="selectedFilters?.isNotEmpty"
            class="align-middle"
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
