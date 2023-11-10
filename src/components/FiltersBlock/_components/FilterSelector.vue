<script setup lang="ts">
import type { FieldInfo } from '../../../@model/field'
import type { Filter } from '../../../@model/filter'
import { VColors, VVariants } from '@/@model/vuetify'
import { IconsList } from '@/@model/enums/icons'

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
  <VMenu :disabled="filters.isEmpty">
    <template #activator="{ props }">
      <VBtn
        :variant="VVariants.Outlined"
        :color="VColors.Secondary"
        dark
        v-bind="props"
        :append-icon="IconsList.ChevronDownIcon"
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
