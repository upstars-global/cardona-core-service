<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { IconsList } from '../../../../@model/enums/icons'
import { IBaseListConfig } from '../model'
import { Location } from 'vue-router'

interface Props {
  item: any
  createPageName: string
  config: IBaseListConfig
  canUpdate: boolean
  canUpdateItem: boolean
  getUpdateRoute: (item: { id: string }) => Location
  canRemoveItem: boolean
  canCreate: boolean
  canUpdateSeo: boolean
}

interface Emits {
  (event: 'on-toggle-status', payload: any): void
  (event: 'on-remove', payload: any): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()
const slots = useSlots()

const isExistsActionItemsSlot = computed(
  () => !!slots['action-items'] && !!slots['action-items']()?.length
)
const isShowActions = computed(() => {
  return [
    props.canUpdate && props.canUpdateItem,
    props.canUpdateSeo,
    props.canCreate && props.config.createFromCopy,
    props.canRemoveItem,
    isExistsActionItemsSlot.value,
  ].some(Boolean)
})

const canShowEdit = computed(() => (props.canUpdate || props.canUpdateSeo) && props.canUpdateItem)
</script>

<template>
  <b-dropdown
    v-if="isShowActions"
    class="dropdown-actions d-flex"
    variant="link"
    no-caret
    toggle-class="p-0"
    right
  >
    <template #button-content>
      <b-button variant="flat-dark" class="btn-icon">
        <feather-icon :icon="IconsList.MoreVerticalIcon" />
      </b-button>
    </template>

    <slot name="action-items" />

    <b-dropdown-item
      v-if="canUpdate && config.withDeactivation"
      @click="emits('on-toggle-status', item)"
    >
      <feather-icon :icon="item.isActive ? IconsList.ToggleLeftIcon : IconsList.ToggleRightIcon" />

      <span>
        {{ item.isActive ? $t('action.deactivate') : $t('action.activate') }}
      </span>
    </b-dropdown-item>

    <b-dropdown-item v-if="canShowEdit" :to="getUpdateRoute(item)">
      <feather-icon :icon="IconsList.EditIcon" />

      <span>
        {{ $t('action.edit') }}
      </span>
    </b-dropdown-item>

    <b-dropdown-item
      v-if="canCreate && config.createFromCopy"
      :to="{ name: createPageName, params: { id: item.id } }"
    >
      <feather-icon :icon="IconsList.CopyIcon" />

      <span>
        {{ $t('action.makeCopy') }}
      </span>
    </b-dropdown-item>

    <b-dropdown-item v-if="canRemoveItem" @click="emits('on-remove', item)">
      <feather-icon :icon="IconsList.Trash2Icon" class="text-danger" />

      <span class="text-danger">
        {{ $t('action.remove') }}
      </span>
    </b-dropdown-item>
  </b-dropdown>
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
