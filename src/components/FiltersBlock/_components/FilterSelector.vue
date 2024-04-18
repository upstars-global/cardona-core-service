<script setup lang="ts">
import type { BaseField } from '../../../@model/templates/baseField'
import { IconsList } from '../../../@model/enums/icons'
import { VColors, VSizes, VVariants } from '../../../@model/vuetify'

const props = defineProps<{
  filters: BaseField[]
  size: VSizes
}>()

const emits = defineEmits<{
  (e: 'selected-filters-changed', filters: BaseField): void
}>()

const isSmallSize: boolean = props.size === VSizes.Small

const onChange = (filter: BaseField) => emits('selected-filters-changed', filter)
</script>

<template>
  <VMenu>
    <template #activator="{ props }">
      <VBtn
        :variant="VVariants.Outlined"
        :color="VColors.Secondary"
        dark
        v-bind="props"
        :disabled="filters.isEmpty"
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
