<script setup lang="ts">
import { computed } from 'vue'
import { debounce } from 'lodash'
import { IconsList } from '../../../../@model/enums/icons'
import type { IBaseListConfig } from '../../../../@model/templates/baseList'
import { BaseListSlots } from '../../../../@model/templates/baseList'
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
const TIME_DEBOUNCE = 500

const onFilterButtonClick = () => {
  emits('on-click-filter')
}

const onExportFormatSelected = (format: string) => {
  emits('on-export-format-selected', format)
}

const searchQuery = computed({
  get: () => props.modelValue,
  set: debounce((value: string) => emits('update:modelValue', value), TIME_DEBOUNCE),
})
</script>

<template>
  <VRow no-gutters>
    <VCol>
      <div class="d-flex gap-4 align-center justify-end list-search-row">
        <slot :name="BaseListSlots.LeftSearchBtn" />

        <AppTextField
          v-if="config.withSearch"
          v-model="searchQuery"
          :prepend-inner-icon="IconsList.SearchIcon"
          :placeholder="config.searchPlaceholder"
          data-test-id="search-input"
          class="search bg-surface"
        />

        <VBtn
          v-if="config.filterList?.isNotEmpty"
          :variant="VVariants.Outlined"
          :color="VColors.Secondary"
          :active="isOpenFilterBlock"
          class="filter-btn"
          data-test-id="filter-btn"
          :class="{ 'filter-btn--small': config?.small }"
          @click="onFilterButtonClick"
        >
          <VIcon :icon="IconsList.FilterIcon" />
          <span
            v-if="!config.small"
            class="align-middle ml-1"
            data-test-id="filter-btn-text"
          >
            {{ $t('common.filter._') }}
          </span>

          <span
            v-if="selectedFilters?.isNotEmpty"
            class="align-middle ml-1"
            data-test-id="filter-count"
          >
            {{ selectedFilters.length }}
          </span>
        </VBtn>

        <ExportFormatSelector
          v-if="exportSelector.canShow"
          data-test-id="export-format-selector"
          :small="config.small"
          :disabled="exportSelector.disable"
          :format-of-exports="config.formatOfExports"
          @export-format-selected="onExportFormatSelected"
        />

        <slot
          :name="BaseListSlots.RightSearchBtn"
          :can-create="rightSearchBtn.canCreate"
          :create-page-name="rightSearchBtn.createPage"
        >
          <VBtn
            v-if="rightSearchBtn.canCreate"
            :to="{ name: rightSearchBtn.createPage }"
            :prepend-icon="IconsList.PlusIcon"
            :color="VColors.Primary"
            data-test-id="right-search-btn"
          >
            <span
              data-test-id="right-search-btn-text"
              class="text-nowrap"
            >
              {{ $t('action.create') }}
            </span>
          </VBtn>
        </slot>
      </div>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
.search {
  :deep(.v-input__control) {
    margin-top: 1px;
    height: 38px;
  }
}
.filter-btn {
  &--small {
    min-width: 2.5rem;
    padding: 0 0.625rem;
  }
}
</style>
