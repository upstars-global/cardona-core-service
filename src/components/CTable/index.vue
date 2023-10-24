<script setup lang="ts">
import { VDataTable } from 'vuetify/labs/VDataTable'
import { VueDraggableNext } from 'vue-draggable-next'
import type { TableField } from '../../@model/templates/tableFields'
import type { SortItem } from '../../@core/types'
import type { SelectMode } from '../../@model/enums/selectMode'

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
  tbodyTrClass?: string
}>()

const emits = defineEmits<{
  (e: 'rowSelected', items: Array<Record<string, unknown>>): void
  (e: 'rowClicked', item: Record<string, unknown>): void
  (e: 'end', data: Record<string, unknown>): void
  (e: 'update:sortData', event: SortItem[]): void
}>()

const tableWrapperComponent = ref(props.draggable ? VueDraggableNext : 'tbody')

const compareClasses = (item: Record<string, unknown>): Record<string, boolean> => {
  return { [`table-light-${item.rowVariant}`]: !!item.rowVariant, 'is-hover-row': props.hover } // TODO: refactor variant/color
}

const onSelectRow = (items: Array<Record<string, unknown>>) => {
  emits('rowSelected', items)
}

const onRowClicked = (item: Record<string, unknown>) => {
  emits('rowClicked', item)
}

const onUpdateSortData = event => {
  emits('update:sortData', event)
}

const onDragEnd = (event: { moved: object }) => {
  emits('end', event.moved)
}
</script>

<template>
  <VDataTable
    :show-select="selectable"
    :select-strategy="selectMode"
    :headers="fields"
    :items="rows"
    :sort-by="sortData"
    return-object
    class="c-table"
    @update:sort-by="onUpdateSortData"
    @update:model-value="onSelectRow"
  >
    <template #tbody="{ items, select, isSelected }">
      <Component
        :is="tableWrapperComponent"
        class="dragArea list-group w-full"
        :list="items"
        tag="tbody"
        @change="onDragEnd"
      >
        <tr
          v-for="(item, index) in items"
          :key="`c-table-row_${index}`"
          class="c-table__row table-default-bg"
          :class="compareClasses(item.raw)"
          @click="onRowClicked(item.raw)"
        >
          <td
            v-if="props.selectable"
            class="c-table__cell"
          >
            <VCheckbox
              :model-value="isSelected([item])"
              @update:model-value="select([item], $event)"
            />
          </td>
          <td
            v-for="field in fields"
            :key="`c-table-cell_${index}_${field.key}`"
            class="c-table__cell"
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
    </template>
    <template #body />
    <template #bottom />
  </VDataTable>
</template>

<style scoped lang="scss">
.v-data-table.c-table {
  .c-table__row {
    cursor: pointer;
  }
  .c-table__cell {
    background-color: transparent;
  }
  :deep(.v-data-table-header__content) {
    white-space: nowrap;
  }
}
</style>
