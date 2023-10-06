<script setup lang="ts">
import { VDataTable } from 'vuetify/labs/VDataTable'
import { VueDraggableNext } from 'vue-draggable-next'
import type { TableField } from '../../@model/components/tableFields'

const props = defineProps<{
  fields: TableField[unknown]
  rows: Array<unknown>
  class?: string
  hover?: boolean
  showEmpty?: boolean
  selectMode?: boolean
  selectable?: boolean
  small?: boolean
  draggable?: boolean
  sortData?: { key: string; order?: boolean | 'asc' | 'desc' }[] // TODO: create model
  tbodyTrClass?: string
}>()

const emits = defineEmits('rowSelected', 'rowClicked', 'end', 'update:sortData')

const tableWrapperComponent = ref(props.draggable ? VueDraggableNext : 'tbody')

const compareClasses = item => {
  const rowVariant = item.rowVariant ? `table-light-${item.rowVariant}` : ''
  const isHover = props.hover ? 'is-hover-row' : ''

  return [rowVariant, isHover]
}

const onSelectRow = items => {
  emits('rowSelected', items)
}

const onRowClicked = item => {
  emits('rowClicked', item)
}

const onUpdateSortData = event => {
  emits('update:sortData', event)
}

const onDragEnd = data => {
  emits('end', data)
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
          @click="onRowClicked"
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
  .v-data-table-header__content {
    white-space: nowrap;
  }
}
</style>
