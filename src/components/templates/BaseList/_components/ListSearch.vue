<script setup lang="ts">
import { computed } from 'vue'
import SearchInput from './SearchInput.vue'
import ExportFormatSelector from './ExportFormatSelector.vue'
import { IconsList } from '../../../../@model/enums/icons'
import { IBaseListConfig } from '../model'
import { BaseField } from '../../../../@model/baseField'
import { BSize } from '../../../../@model/bootstrap'

interface Props {
  config: IBaseListConfig
  value: string
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
  (event: 'input', payload: string): void
  (event: 'on-click-filter'): void
  (event: 'on-export-format-selected', payload: string): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const size = computed(() => (props.config?.small ? BSize.Sm : BSize.Md))

const onFilterButtonClick = () => {
  emits('on-click-filter')
}

const onExportFormatSelected = (format: string) => {
  emits('on-export-format-selected', format)
}

const searchQuery = computed({
  get: () => props.value,
  set: (value) => emits('input', value),
})
</script>

<template>
  <b-row class="filters-row">
    <b-col>
      <div class="d-flex align-items-center justify-content-end">
        <slot name="left-search-btn" />

        <search-input
          v-if="config.withSearch"
          v-model="searchQuery"
          class="search"
          :size="size"
          :placeholder="config.searchPlaceholder"
        />

        <b-button
          v-if="config.filterList.isNotEmpty"
          variant="outline-secondary"
          :class="{ 'btn-icon': config.small }"
          class="d-flex align-items-center ml-1"
          :size="size"
          @click="onFilterButtonClick"
        >
          <feather-icon :icon="IconsList.FilterIcon" />

          <span v-if="!config.small" class="align-middle ml-50">
            {{ $t('common.filter._') }}
          </span>

          <span v-if="selectedFilters.isNotEmpty" class="align-middle ml-50">
            {{ selectedFilters.length }}
          </span>
        </b-button>

        <export-format-selector
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
          <b-button
            v-if="rightSearchBtn.canCreate"
            variant="primary"
            :to="{ name: rightSearchBtn.createPage }"
            class="ml-1"
          >
            <feather-icon :icon="IconsList.PlusIcon" class="mr-50" />

            <span class="text-nowrap">
              {{ $t('action.create') }}
            </span>
          </b-button>
        </slot>
      </div>
    </b-col>
  </b-row>
</template>

<style scoped lang="scss">
.filters-row {
  margin-bottom: 2rem;

  .search {
    flex-basis: 0;
    flex-grow: 1;
  }
}
</style>