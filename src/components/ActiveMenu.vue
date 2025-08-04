<script setup lang="ts">
import { computed } from 'vue'
import { VColors, VVariants } from '../@model/vuetify'
import { IconsList } from '../@model/enums/icons'
import type { OptionsItem } from '../@model'
import type { ActiveMenuOptionsItem } from '../@model/activeMenu'

const props = defineProps<{
  selectedItem: ActiveMenuOptionsItem
  options: ActiveMenuOptionsItem[]
}>()

defineEmits<{
  'item-selected': [item: OptionsItem]
}>()

const displayedSelectedItem = computed(() => props.selectedItem ?? props.options[0])

const isSelectedOption = (item: OptionsItem): boolean => props.selectedItem.id === item.id
</script>

<template>
  <VMenu offset="4">
    <template #activator="{ props }">
      <VBtn
        :variant="VVariants.Outlined"
        :color="VColors.Secondary"
        v-bind="props"
        :append-icon="IconsList.ChevronDownIcon"
        :prepend-icon="displayedSelectedItem.prependIcon"
        class="px-4"
      >
        {{ displayedSelectedItem.name }}
      </VBtn>
    </template>

    <VList>
      <VListItem
        v-for="(item, index) in options"
        :key="index"
        :class="{ selected: isSelectedOption(item) }"
        :value="index"
        @click="$emit('item-selected', item)"
      >
        <VListItemTitle>
          {{ item.name }}

          <VIcon
            v-if="isSelectedOption(item)"
            :icon="IconsList.CheckIcon"
            :color="VColors.White"
            size="20"
          />
        </VListItemTitle>
      </VListItem>
    </VList>
  </VMenu>
</template>

<style lang="scss" scoped>
:deep(.selected) {
  background-color: rgba(var(--v-theme-primary));

  .v-list-item-title {
    display: flex;
    justify-content: space-between;
    color: rgba(var(--v-theme-surface));
  }
}
</style>
