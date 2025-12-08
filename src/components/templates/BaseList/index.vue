<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue'
import type { IBaseListConfig } from '../../../@model/templates/baseList'
import { ListTypes } from '../../../@model/templates/baseList'
import type DefaultBaseList from './types/default.vue'

const props = withDefaults(defineProps<{
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

const componentsMap = {
  default: () => import('./types/default.vue'),
}

const dynamicComponent = computed(() =>
  defineAsyncComponent(componentsMap[props.type]),
)

defineExpose({
  get reFetchList() { return listByTypeRef.value?.reFetchList },
  get resetSelectedItem() { return listByTypeRef.value?.resetSelectedItem },
  get selectedItems() { return listByTypeRef.value?.selectedItems },
  get disableRowIds() { return listByTypeRef.value?.disableRowIds },
  get sortData() { return listByTypeRef.value?.sortData },
  get items() { return listByTypeRef.value?.items },
  get isSidebarShown() { return listByTypeRef.value?.isSidebarShown },
  get searchQuery() { return listByTypeRef.value?.searchQuery },
})
</script>

<template>
  <div>
    <component
      :is="dynamicComponent"
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
        #[slotName]="slotProps = {}"
      >
        <slot
          :name="slotName"
          v-bind="slotProps"
        />
      </template>
    </component>
  </div>
</template>
