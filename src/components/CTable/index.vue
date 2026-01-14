<script setup lang="ts">
import { computed, ref } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import { VDataTable } from 'vuetify/labs/VDataTable'
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'
import { find } from 'lodash'
import type { TableField } from '../../@model/templates/tableFields'
import type { SortItem } from '../../@core/types'
import type { SelectMode } from '../../@model/enums/selectMode'
import { AlignType } from '../../@model/templates/tableFields'
import { IconsList } from '../../@model/enums/icons'
import { SortDirection } from '../../@model/templates/baseList'

const props = withDefaults(defineProps<{
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
  showExpand?: boolean
  disabledRowIds?: string[]
  skeletonRows?: number
  skeletonCols?: number
}>(), {
  disabledRowIds: [],
})

const emits = defineEmits<{
  (e: 'rowSelected', items: Array<Record<string, unknown>>): void
  (e: 'rowClicked', item: Record<string, unknown>): void
  (e: 'end', data: Record<string, unknown>): void
  (e: 'update:sortData', event: SortItem[]): void
}>()

const cTable = ref({})
const tableWrapperComponent = computed(() => props.draggable ? VueDraggableNext : 'tbody')

const compareClasses = (item: Record<string, unknown>, isSelected: boolean): Record<string, boolean> => {
  return {
    [`table-light-${item.rowVariant}`]: !!item.rowVariant,
    'c-table__row--selected': isSelected,
    'is-hover-row': props.hover,
    'row-disabled': props.disabledRowIds?.includes(item.id),
  }
}

const onSelectRow = (items: Array<Record<string, unknown>>) => {
  emits('rowSelected', items)
}

const onRowClicked = (item: Record<string, unknown>) => {
  emits('rowClicked', item)
}

const onDragEnd = (event: { moved: object }) => {
  emits('end', event.moved)
}

const cellClasses = computed(() => props.small ? 'c-table-sm-cell-padding' : 'c-table-cell-padding')
const maxSkeletonRows = 25

const skeletonRows = computed(() =>
  props.skeletonRows
    ? props.skeletonRows
    : !props.itemsPerPage || props.itemsPerPage > maxSkeletonRows
      ? +maxSkeletonRows
      : +props.itemsPerPage)

const emptyColspan = computed(() => props.selectable ? props.fields.length + 1 : props.fields.length)
const isSortableColumn = (column: TableField): boolean => props.fields?.find(item => item?.key === column?.key)?.sortable

const sortParams = ref(props.sortData?.map(item => ({
  ...item,
  order: item?.order,
  isActive: true,
})))

const handleSorByField = ({ key }: { key: string }) => {
  const itemIndex = sortParams.value.findIndex(item => item?.key === key)

  if (itemIndex !== -1) {
    if (sortParams.value[itemIndex].order === 'DESC') {
      emits('update:sortData', [])
      sortParams.value[itemIndex].order = ''

      return
    }
    sortParams.value[itemIndex].order = sortParams.value[itemIndex].order === 'ASC' ? 'DESC' : 'ASC'
  }
  else {
    sortParams.value = [{ key, order: 'ASC', isActive: true }]
  }
  emits('update:sortData', sortParams.value.filter(item => item?.isActive))
}

const isActiveSort = (key: string, direction: string): boolean => {
  const currentItem = find(sortParams.value, { key })

  return currentItem?.isActive && currentItem?.order?.toLowerCase() === direction
}

const actualHeadersTable = computed(() => {
  if (!props.skeletonCols)
    return props.fields

  return props.isLoadingList ? props.fields.slice(0, props.skeletonCols) : props.fields
})

const getActualField = (fields: Array<unknown>) => {
  if (!props.skeletonCols)
    return fields

  return props.isLoadingList ? fields.slice(0, props.skeletonCols) : fields
}

const expanded = ref<string[]>([])

const toggleExpand = (id: string) => {
  if (expanded.value.includes(id))
    expanded.value = expanded.value.filter(expandId => expandId !== id)
  else
    expanded.value.push(id)
}
</script>

<template>
  <VDataTable
    ref="cTable"
    :model-value="selectedItems"
    :show-select="selectable"
    :select-strategy="selectMode"
    :headers="actualHeadersTable"
    :items="rows"
    return-object
    class="c-table"
    :items-per-page="itemsPerPage"
    :density="small ? 'compact' : 'comfortable'"
    @update:model-value="onSelectRow"
  >
    <template #headers="{ columns, toggleSort, sortBy, someSelected, allSelected, selectAll }">
      <th
        v-if="draggable"
        class="pl-1 pr-0 c-table__header-cell"
        data-c-field="draggable"
        data-test-id="draggable-th"
      />
      <th
        v-if="props.selectable"
        class="c-table__header-cell pa-0"
        data-c-field="selectable"
        data-test-id="selectable-th"
      >
        <VSkeletonLoader
          v-if="isLoadingList"
          class="col-table-skeleton py-0 pr-0"
          :class="cellClasses"
          type="text"
        />
        <VCheckbox
          v-else
          :model-value="allSelected || someSelected"
          :indeterminate="allSelected ? false : someSelected"
          :disabled="isLoadingList"
          class="selectable-checkbox"
          data-test-id="select-all-checkbox"
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
          :data-test-id="`table-th-${column.key}`"
          :data-c-field="column.key"
          @click="isSortableColumn(column) && handleSorByField(column)"
        >
          <VSkeletonLoader
            v-show="isLoadingList"
            type="text"
            class="col-table-skeleton"
            data-test-id="skeleton-loader"
          />
          <div
            class="d-flex align-center c-table__header-title column-title"
            data-test-id="column-title"
            :class="{
              'justify-end': column.align === AlignType.Right,
              'justify-center': column.align === AlignType.Center,
              'gap-2': column.align,
              'justify-space-between': !column.align,
              'd-none': !isLoadingList,
            }"
            :style=" isLoadingList && `display: none !important`"
          >
            {{ column.title }}

            <div
              v-if="isSortableColumn(column)"
              class="c-table__header-cell-icon-wrapper"
              :class="{ small: props.small }"
              :data-test-id="`sort-col-${column.key}`"
            >
              <VIcon
                :icon="IconsList.ChevronUpIcon"
                class="d-block c-table__header-cell-icon"
                :data-test-id="`sort-icon-${SortDirection.desc}`"
                :class="{ 'c-table__header-cell-icon--active': isActiveSort(column.key, SortDirection.desc) }"
              />
              <VIcon
                :icon="IconsList.ChevronDownIcon"
                class="d-block c-table__header-cell-icon"
                :data-test-id="`sort-icon-${SortDirection.asc}`"
                :class="{ 'c-table__header-cell-icon--active': isActiveSort(column.key, SortDirection.asc) }"
              />
            </div>
          </div>
        </th>
      </template>
    </template>
    <template #tbody="{ items, select, toggleSelect, isSelected }">
      <tbody
        v-if="isLoadingList"
        data-test-id="tbody-skeleton"
      >
        <slot name="skeleton">
          <tr
            v-for="index in skeletonRows"
            :key="`skeleton-row_${index}`"
            data-test-id="skeleton-row"
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
              v-for="(field, cellIndex) in getActualField(fields)"
              :key="`skeleton-cell_${index}_${cellIndex}`"
              class="c-table__cell"
              data-test-id="skeleton-coll"
              :class="cellClasses"
              :data-c-field="field.key"
            >
              <VSkeletonLoader type="text" />
            </td>
          </tr>
        </slot>
      </tbody>
      <Component
        :is="tableWrapperComponent"
        v-else
        class="dragArea list-group w-full"
        :list="items"
        data-test-id="drag-area"
        tag="tbody"
        @change="onDragEnd"
      >
        <template
          v-for="(item, index) in items"
          :key="`c-table-row_${index}`"
        >
          <!-- Main row -->
          <tr
            class="c-table__row"
            data-test-id="table-row"
            :class="compareClasses(item.raw, isSelected([item]))"
            @click="onRowClicked(item.raw)"
          >
            <td
              v-if="draggable"
              class="pl-1 pr-0 c-table__cell"
              data-c-field="draggable"
              data-test-id="draggable-trigger"
            >
              <VIcon
                v-if="!isLoadingList"
                :icon="IconsList.DragVerticalIcon"
                class="dragging-icon"
              />
            </td>

            <td
              v-if="props.selectable"
              class="c-table__cell pa-0"
              data-c-field="selectable"
              data-test-id="selectable"
            >
              <VCheckbox
                :model-value="isSelected([item])"
                data-test-id="selectable-checkbox"
                :disabled="disabledRowIds?.includes(item.raw.id)"
                class="selectable-checkbox"
                @update:model-value="select([item], $event)"
                @click.stop
              />
            </td>

            <td
              v-for="field in fields"
              :key="`c-table-cell_${index}_${field.key}`"
              class="c-table__cell text-body-1 whitespace-no-wrap"
              :class="cellClasses"
              :data-c-field="field.key"
            >
              <slot
                :name="`cell(${field.key})`"
                :field="field"
                :item="item"
                :cell="item.raw[field.key]"
                :toggle-expand="toggleExpand"
                :is-expanded="expanded.includes(item.raw.id)"
              >
                {{ item.raw[field.key] }}
              </slot>
            </td>
          </tr>

          <!-- Expand row -->
          <template v-for="raw in item.raw?.groups">
            <tr
              v-if="showExpand && expanded.includes(item.raw.id)"
              :key="`${item.raw.id}-expand`"
            >
              <!-- [START] Add for similar col and cell in table  -->
              <td v-if="props.selectable" />
              <td
                v-if="props.selectable"
                class="c-table-expand__cell"
                :class="{ 'c-table-cell-padding': !props.small, 'px-0': props.small }"
                data-c-expand-field="selectable"
              />
              <!-- [END] Add for similar col and cell in table -->
              <td
                v-for="field in fields"
                :key="`c-table-expand-cell_${index}_${field.key}`"
                class="c-table-expand__cell text-body-1 whitespace-no-wrap"
                :class="cellClasses"
                :data-c-expand-field="field.key"
              >
                <slot
                  :name="`cellExpand(${field.key})`"
                  :field="field"
                  :item="{ ...item, raw, value: raw }"
                  :cell="raw[field.key]"
                  :toggle-expand="toggleExpand"
                  :is-expanded="expanded.includes(item.raw.id)"
                >
                  {{ raw[field.key] }}
                </slot>
              </td>
            </tr>
          </template>
        </template>
      </Component>

      <tr v-if="items.isEmpty && !isLoadingList">
        <td
          :colspan="emptyColspan"
          class="text-center text-body-1"
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
  .c-table__header-cell {
    background: rgba(var(--v-theme-grey-800), 0.08);
    .column-title {
      color: rgb(var(--v-theme-grey-900), 0.62);
    }
  }

  .c-table__header-cell-icon-wrapper {
    position: relative;
    width: 1rem;
    height: 1.4rem;

    &.small {
      height: 1rem;

      .c-table__header-cell-icon {
        height: 0.5rem;
      }
    }
  }
  .c-table__header-cell-icon {
    opacity: 0.5;
    width: 0.7rem;
    height: 0.7rem;

    &--active {
      opacity: 1;
    }
  }
  .is-hover-row {
    &:hover {
      background: rgb(var(--v-theme-grey-100));
    }
  }
  .c-table__row {
    cursor: pointer;
    &--selected {
      background: rgb(var(--v-theme-grey-100));
    }
  }
  .c-table__header-cell,
  .c-table__cell {
    &[data-c-field='selectable'] {
      min-width: 3rem;
      width: 4.25rem;
    }
    &[data-c-field='draggable'] {
      width: 1.25rem;
      max-width: 1.25rem;
      .v-icon {
        font-size: 1rem;
      }
    }
  }

  .c-table-cell-padding {
    padding: 0.75rem 1rem;
  }

  .c-table-sm-cell-padding {
    padding: 0.5rem 0.75rem;
  }

  .c-table__cell{
    background-color: transparent;
    cursor: pointer;
  }
  :deep(.v-skeleton-loader__text) {
    margin-left: 0;
    margin-right: 0;
    border-radius: 0.25rem;
  }

  :deep(.v-data-table-header__content) {
    white-space: nowrap;
  }

  .c-table__row {
    &:hover {
      .dragging-icon {
        opacity: 1;
      }
    }
  }
  .dragging-icon {
    opacity: 0;
    transition: opacity 0.3s;
  }

  :deep(tbody) {
    td {
      height: var(--compact__c-table-td-height);

      .v-skeleton-loader {
        width: 90%;
      }
    }
  }

  th {
    height: var(--c-table-th-height);
  }

  :deep(.v-checkbox) {
    display: flex;
    justify-content: center;
  }
}

.col-table-skeleton {
  height: 1rem;
  background-color: initial !important;

  :deep(.v-skeleton-loader) {
    padding: 0;
    margin: 0;
  }
  :deep(.v-skeleton-loader__bone) {
    height: 12px !important;
    margin: 0;
    margin-inline: auto;
  }
}
</style>
