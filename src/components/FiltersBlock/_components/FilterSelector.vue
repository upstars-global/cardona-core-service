<script setup lang="ts">
import type { FieldInfo } from '../../../@model/field'
import type { Filter } from '../../../@model/filter'

const props = defineProps<{
  filters: FieldInfo[]
  size: string // TODO: refactor sizes
}>()

const emits = defineEmits<{
  (e: 'selectedFiltersChanged', filters: Filter[]): void
}>()

const isSmallSize: boolean = props.size === 'sm' // TODO: refactor sizes

const onChange = (filter: FieldInfo) => emits('selectedFiltersChanged', filter)
</script>

<template>
  <!--        TODO: refactor variant/color -->
  <VMenu
    variant="outline-secondary"
    :disabled="filters.isEmpty"
  >
    <template #activator="{ props }">
      <VBtn
        color="primary"
        dark
        v-bind="props"
      >
        {{ $t('action.selectEntity') }}
      </VBtn>
    </template>
    <VList>
      <VListItem
        v-for="(filter, index) in filters"
        :key="index"
        :link-class="{ 'px-1 py-50 font-small-3': isSmallSize }"
        @click="onChange(filter)"
      >
        {{ filter.label }}
      </VListItem>
    </VList>
  </VMenu>
</template>
