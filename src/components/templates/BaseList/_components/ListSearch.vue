<script setup lang="ts">
import { computed } from 'vue'
import { IconsList } from '../../../../@model/enums/icons'
import type { Filter } from '../../../../@model/filter'
import { BSize } from '../../../../@model/bootstrap'
import type { IBaseListConfig } from '../../../../@model/templates/baseList'
import AppTextField from '../../../../@core/components/app-form-elements/AppTextField.vue'

interface Props {
  config: IBaseListConfig
  modelValue: string
  selectedFilters: Array<Filter>
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
  (event: 'input', payload: string): void
  (event: 'on-click-filter'): void
  (event: 'on-export-format-selected', payload: string): void
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
  set: value => emits('input', value),
})
</script>

<template>
  <VRow class="filters-row">
    <VCol>
      <div class="d-flex align-items-center justify-content-end">
        <slot name="left-search-btn" />

        <AppTextField
          v-if="config.withSearch"
          v-model="searchQuery"
          class="search mr-3"
          :placeholder="config.searchPlaceholder"
        />

        <VBtn
          v-if="config.filterList?.isNotEmpty"
          :prepend-icon="IconsList.FilterIcon"
          @click="onFilterButtonClick"
        >
          <span
            v-if="!config.small"
            class="align-middle "
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
          class="ml-1"
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
            class="ml-1"
          >
            <VIcon
              :icon="IconsList.PlusIcon"
              class="mr-50"
            />

            <span class="text-nowrap">
              {{ $t('action.create') }}
            </span>
          </VBtn>
        </slot>
      </div>
    </VCol>
  </VRow>
</template>

<style scoped lang="scss">
.filters-row {
  margin-bottom: 2rem;
}
</style>
