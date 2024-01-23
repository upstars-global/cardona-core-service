<script setup lang="ts">
import { computed, ref } from 'vue'

import { VueDraggableNext } from 'vue-draggable-next'
import { VDataTable } from 'vuetify/labs/VDataTable'
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'
import type { TableField } from '../../@model/templates/tableFields'
import type { SortItem } from '../../@core/types'
import type { SelectMode } from '../../@model/enums/selectMode'
import { AlignType } from '../../@model/templates/tableFields'
import { IconsList } from '../../@model/enums/icons'
import { SortDirection } from '../../@model/templates/baseList'

const props = defineProps<{
  fields: TableField[]
  rows: Array<Record<string, unknown>>
  class?: string
  hover?: boolean
  showEmpty?: boolean
  selectMode?: SelectMode
  selectable?: boolean
  small?: boolean
  draggable?: boolean
  sortData?: SortItem[]
  itemsPerPage: number
  selectedItems: Array<Record<string, unknown>>
  isLoadingList: boolean
}>()

const emits = defineEmits<{
  (e: 'rowSelected', items: Array<Record<string, unknown>>): void
  (e: 'rowClicked', item: Record<string, unknown>): void
  (e: 'end', data: Record<string, unknown>): void
  (e: 'update:sortData', event: SortItem[]): void
}>()

const cTable = ref({})
const tableWrapperComponent = ref(props.draggable ? VueDraggableNext : 'tbody')

const compareClasses = (item: Record<string, unknown>, isSelected: boolean): Record<string, boolean> => {
  return {
    [`table-light-${item.rowVariant}`]: !!item.rowVariant,
    'c-table__row--selected': isSelected,
    'is-hover-row': props.hover,
  }
}

const onSelectRow = (items: Array<Record<string, unknown>>) => {
  emits('rowSelected', items)
}

const onRowClicked = (item: Record<string, unknown>) => {
  emits('rowClicked', item)
}

const onUpdateSortData = (event: any) => {
  emits('update:sortData', event)
}

const onDragEnd = (event: { moved: object }) => {
  emits('end', event.moved)
}

const cellClasses = computed(() => props.small ? 'py-2 px-3' : 'py-3 px-4')
const maxSkeletonRows = 25
const skeletonRows = computed(() => props.itemsPerPage > maxSkeletonRows ? +maxSkeletonRows : +props.itemsPerPage)
</script>

<template>
  <VDataTable
    ref="cTable"
    :model-value="selectedItems"
    :show-select="selectable"
    :select-strategy="selectMode"
    :headers="fields"
    :items="rows"
    :sort-by="sortData"
    return-object
    class="c-table"
    :items-per-page="itemsPerPage"
    :density="small ? 'compact' : 'comfortable'"
    @update:sort-by="onUpdateSortData"
    @update:model-value="onSelectRow"
  >
    <template #headers="{ columns, isSorted, toggleSort, sortBy, someSelected, allSelected, selectAll }">
      <th
        v-if="props.selectable"
        class="c-table__header-cell"
        :class="cellClasses"
        data-c-field="selectable"
      >
        <VCheckbox
          :model-value="allSelected"
          :indeterminate="allSelected ? false : someSelected"
          :disabled="isLoadingList"
          @update:model-value="selectAll"
        />
      </th>
      <template
        v-for="(column, index) in columns"
        :key="`c-table-cell_${index}_${column.key}`"
      >
        <th
          v-if="column.key !== 'data-table-select'"
          class="c-table__header-cell whitespace-no-wrap text-left cursor-pointer"
          :class="cellClasses"
          :data-c-field="column.key"
          @click="toggleSort(column)"
        >
          <div
            class="d-flex align-center"
            :class="{
              'justify-end': column.align === AlignType.Right,
              'justify-center': column.align === AlignType.Center,
              'gap-2': column.align,
              'justify-space-between': !column.align,
            }"
          >
            {{ column.title }}

            <div
              v-if="isSorted(column)"
              class="c-table__header-cell-icon-wrapper"
            >
              <VIcon
                :icon="IconsList.ChevronUpIcon"
                class="d-block c-table__header-cell-icon"
                :class="{ 'c-table__header-cell-icon--active': sortBy[0].order === SortDirection.desc || sortBy[0].order === false }"
              />
              <VIcon
                :icon="IconsList.ChevronDownIcon"
                class="d-block c-table__header-cell-icon"
                :class="{ 'c-table__header-cell-icon--active': sortBy[0].order === SortDirection.asc || sortBy[0].order === true }"
              />
            </div>
          </div>
        </th>
      </template>
    </template>
    <template #tbody="{ items, select, toggleSelect, isSelected }">
      <template v-if="isLoadingList">
        <tr
          v-for="index in skeletonRows"
          :key="`skeleton-row_${index}`"
        >
          <td
            v-if="props.selectable"
            class="c-table__cell"
            :class="cellClasses"
            data-c-field="selectable"
          >
            <VSkeletonLoader type="text" />
          </td>
          <td
            v-for="(_, cellIndex) in fields"
            :key="`skeleton-cell_${index}_${cellIndex}`"
            class="c-table__cell"
            :class="cellClasses"
          >
            <VSkeletonLoader type="text" />
          </td>
        </tr>
      </template>
      <Component
        :is="tableWrapperComponent"
        v-else
        class="dragArea list-group w-full"
        :list="items"
        tag="tbody"
        @change="onDragEnd"
      >
        <tr
          v-for="(item, index) in items"
          :key="`c-table-row_${index}`"
          class="c-table__row table-default-bg"
          :class="compareClasses(item.raw, isSelected([item]))"
          @click="onRowClicked(item.raw)"
        >
          <td
            v-if="props.selectable"
            class="c-table__cell"
            :class="cellClasses"
            data-c-field="selectable"
          >
            <VCheckbox
              :model-value="isSelected([item])"
              @update:model-value="select([item], $event)"
              @click.stop
            />
          </td>
          <td
            v-for="field in fields"
            :key="`c-table-cell_${index}_${field.key}`"
            class="c-table__cell whitespace-no-wrap"
            :class="cellClasses"
            :data-c-field="field.key"
          >
            <slot
              :name="`cell(${field.key})`"
              :field="field"
              :item="item"
              :cell="item.raw[field.key]"
            >
              {{ item.raw[field.key] }}
            </slot>
          </td>
        </tr>
      </Component>

      <tr v-if="items.isEmpty && !isLoadingList">
        <td
          :colspan="fields.length"
          class="text-center pa-4"
        >
          <slot name="empty" />
        </td>
      </tr>
    </template>
    <template #body />
    <template #bottom />
  </VDataTable>
</template>

<style scoped lang="scss">
.v-data-table.c-table {
  border-radius: 0;

  .c-table__header-cell {
    background: rgba(var(--v-theme-grey-800), 0.08);
  }

  .c-table__header-cell-icon-wrapper {
    position: relative;
    width: 1rem;
    height: 1rem;
  }
  .c-table__header-cell-icon {
    opacity: 0.5;
    width: 0.5rem;
    height: 0.5rem;

    &--active {
      opacity: 1;
    }
  }
  .c-table__row {
    cursor: pointer;
    &--selected,
    &:hover {
      background: rgba(var(--v-theme-secondary), 0.08);
    }
  }
  .c-table__cell {
    background-color: transparent;
    cursor: pointer;
    &[data-c-field='selectable'] {
      min-width: 4.25rem;
    }
  }
  :deep(.v-skeleton-loader__text) {
    margin-left: 0;
    margin-right: 0;
    border-radius: 0.25rem;
  }

  :deep(.v-data-table-header__content) {
    white-space: nowrap;
  }
}
</style>
