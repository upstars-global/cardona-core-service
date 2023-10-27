<script setup lang="ts">
import { computed } from 'vue'
import type { IBaseListConfig } from '../../../../../@model/templates/baseList'
import { IconsList } from '@/@model/enums/icons'

interface Props {
  item: any
  createPageName: string
  config: IBaseListConfig
  canUpdate: boolean
  canUpdateItem: boolean
  getUpdateRoute: (item: { id: string }) => Location
  canRemoveItem: boolean
}

interface Emits {
  (event: 'on-toggle-status', payload: any): void
  (event: 'on-remove', payload: any): void
}

const prop = defineProps<Props>()
const emits = defineEmits<Emits>()

const isShowActions = computed(() => {
  return [
    prop.config.withDeactivation,
    prop.canUpdateItem,
    prop.config.createFromCopy,
    prop.canRemoveItem,
  ].some(Boolean)
})
</script>

<template>
  <VMenu v-if="isShowActions">
    <template #activator="{ props }">
      <VBtn v-bind="props">
        <VIcon :icon="IconsList.MoreVerticalIcon" />
      </VBtn>
    </template>

    <slot name="action-items" />

    <VList>
      <VListItem
        v-if="canUpdate && config.withDeactivation"
        @click="emits('on-toggle-status', item)"
      >
        <template #prepend>
          <VIcon :icon="item.isActive ? IconsList.ToggleLeftIcon : IconsList.ToggleRightIcon" />
        </template>
        <VListItemTitle>
          {{ item.isActive ? $t('action.deactivate') : $t('action.activate') }}
        </VListItemTitle>
      </VListItem>
      <VListItem v-if="canUpdateItem">
        <template #prepend>
          <VIcon :icon="IconsList.EditIcon" />
        </template>
        <VListItemTitle>
          {{ $t('action.edit') }}
        </VListItemTitle>
      </VListItem>
      <VListItem
        v-if="canRemoveItem"
        @click="emits('on-remove', item)"
      >
        <template #prepend>
          <VIcon :icon="IconsList.Trash2Icon" />
        </template>
        <VListItemTitle>
          {{ $t('action.remove') }}
        </VListItemTitle>
      </VListItem>
      <VListItem v-if="config.createFromCopy">
        <template #prepend>
          <VIcon :icon="IconsList.CopyIcon" />
        </template>
        <VListItemTitle>
          {{ $t('action.makeCopy') }}
        </VListItemTitle>
      </VListItem>
    </VList>
  </VMenu>
</template>

<style lang="scss" scoped>
.dropdown-actions {
  :deep(.dropdown-item) {
    display: flex;
    align-items: center;

    .feather {
      margin-right: 0.5rem;
    }
  }
}
</style>
