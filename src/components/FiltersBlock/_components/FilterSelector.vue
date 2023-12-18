<script setup lang="ts">
import {VColors, VSizes, VVariants} from '@/@model/vuetify'
import { IconsList } from '@/@model/enums/icons'
import {BaseField} from "@/@model/templates/baseField";

const props = defineProps<{
  filters: BaseField[]
  size: VSizes
}>()

const emits = defineEmits<{
  (e: 'selectedFiltersChanged', filters: BaseField): void
}>()

const isSmallSize: boolean = props.size === VSizes.Small

const onChange = (filter: BaseField) => emits('selectedFiltersChanged', filter)
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
