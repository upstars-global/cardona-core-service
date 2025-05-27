<script setup lang="ts">
import type { BaseField } from '../../../@model/templates/baseField'
import { IconsList } from '../../../@model/enums/icons'
import { VColors, VSizes, VVariants } from '../../../@model/vuetify'
import { IS_TEST_ENV } from '../../../utils/constants'

const props = defineProps<{
  filters: BaseField[]
  size: VSizes
}>()

const emits = defineEmits<{
  (e: 'selected-filters-changed', filters: BaseField): void
}>()

const linkClass = { 'px-1 py-50 font-small-3': props.size === VSizes.Small }

const onChange = (filter: BaseField) => emits('selected-filters-changed', filter)
</script>

<template>
  <VMenu :attach="IS_TEST_ENV">
    <template #activator="{ props }">
      <VBtn
        :variant="VVariants.Outlined"
        :color="VColors.Secondary"
        dark
        v-bind="props"
        :size="size"
        :disabled="filters.isEmpty"
        :append-icon="IconsList.ChevronDownIcon"
        data-test-id="btn-filter-select"
      >
        {{ $t('action.addFilter') }}
      </VBtn>
    </template>
    <VList>
      <VListItem
        v-for="(filter, index) in filters"
        :key="index"
        data-test-id="filter-item"
        :link-class="linkClass"
        @click="onChange(filter)"
      >
        {{ filter.label }}
      </VListItem>
    </VList>
  </VMenu>
</template>
