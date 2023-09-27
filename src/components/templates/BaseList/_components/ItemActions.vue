<script setup lang="ts">
import { computed } from 'vue'
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
}

interface Emits {
  (event: 'on-toggle-status', payload: any): void
  (event: 'on-remove', payload: any): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const isShowActions = computed(() => {
  return [
    props.config.withDeactivation,
    props.canUpdateItem,
    props.config.createFromCopy,
    props.canRemoveItem,
  ].some(Boolean)
})
</script>

<template>
  <b-dropdown v-if="isShowActions" class="d-flex" variant="link" no-caret toggle-class="p-0" right>
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
      <feather-icon
        :icon="item.isActive ? IconsList.ToggleLeftIcon : IconsList.ToggleRightIcon"
        size="16"
      />

      <span class="align-middle ml-50">
        {{ item.isActive ? $t('action.deactivate') : $t('action.activate') }}
      </span>
    </b-dropdown-item>

    <b-dropdown-item v-if="canUpdateItem" :to="getUpdateRoute(item)">
      <feather-icon :icon="IconsList.EditIcon" size="16" />

      <span class="align-middle ml-50">
        {{ $t('action.edit') }}
      </span>
    </b-dropdown-item>

    <b-dropdown-item
      v-if="config.createFromCopy"
      :to="{ name: createPageName, params: { id: item.id } }"
    >
      <feather-icon :icon="IconsList.CopyIcon" size="16" />

      <span class="align-middle ml-50">
        {{ $t('action.makeCopy') }}
      </span>
    </b-dropdown-item>

    <b-dropdown-item v-if="canRemoveItem" @click="emits('on-remove', item)">
      <feather-icon :icon="IconsList.Trash2Icon" size="16" class="text-danger" />

      <span class="text-danger align-middle ml-50">
        {{ $t('action.remove') }}
      </span>
    </b-dropdown-item>
  </b-dropdown>
</template>
