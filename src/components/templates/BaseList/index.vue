<script setup lang="ts">
import { ref } from 'vue'
import type { IBaseListConfig } from '../../../@model/templates/baseList'
import { ListTypes } from '../../../@model/templates/baseList'
import DefaultBaseList from './types/default.vue'

withDefaults(defineProps<{
  config: IBaseListConfig
  useList: unknown
  type?: ListTypes
}>(), {
  type: ListTypes.Default,
})

const emits = defineEmits<{
  mounted: []
  rowClicked: [item: Record<string, unknown>]
  end: [item: Record<string, unknown>]
}>()

// const slots = useSlots()

const onClickRow = async data => {
  emits('rowClicked', data)
}

const onEnd = async data => {
  emits('end', data)
}

const onMountedList = async () => {
  emits('mounted')
}

const listByTypeRef = ref<InstanceType<typeof DefaultBaseList> | null>(null)

defineExpose({
  reFetchList: listByTypeRef.value?.reFetchList,
  resetSelectedItem: listByTypeRef.value?.resetSelectedItem,
  selectedItems: listByTypeRef.value?.selectedItems,
  disableRowIds: listByTypeRef.value?.disableRowIds,
  sortData: listByTypeRef.value?.sortData,
  items: listByTypeRef.value?.items,
  isSidebarShown: listByTypeRef.value?.isSidebarShown,
  searchQuery: listByTypeRef.value?.searchQuery,
})
</script>

<template>
  <DefaultBaseList
    ref="listByTypeRef"
    :config="config"
    :use-list="useList"
    @row-clicked="onClickRow"
    @end="onEnd"
    @mounted="onMountedList"
    v-on="{
      ...$attrs,
      ...Object.fromEntries(
        Object.entries($attrs).map(([key]) => [
          key,
          (...args) => $emit(key, ...args),
        ]),
      ),
    }"
  >
    <slot />

    <template
      v-for="(_, slotName) in $slots"
      :key="slotName"
      #[slotName]="slotProps"
    >
      <slot
        :name="slotName"
        v-bind="slotProps"
      />
    </template>
  </DefaultBaseList>
</template>

<style lang="scss" scoped>
.table-card-settings {
  :deep(.table-settings) {
    display: flex;
    padding: 0.5rem 1rem;

    .per-page-selector {
      min-width: 6rem;
    }
  }
}

:deep(.c-table) {
  .default-cell-value {
    max-width: 320px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  tr {
    td[data-c-field='actions'] {
      width: 3.5rem;
    }

    td[data-c-field="email"] {
      padding: 0 !important;
    }
  }
}

.empty-state-wrapper {
  height: 5.2rem;
}
</style>
