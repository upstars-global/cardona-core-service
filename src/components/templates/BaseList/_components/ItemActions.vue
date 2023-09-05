<script setup lang="ts">
import { IconsList } from '../../../../@model/enums/icons'
import { IBaseListConfig } from '../model'

interface Props {
  item: any
  updatePageName: string
  createPageName: string
  config: IBaseListConfig
  canUpdate: boolean
  canRemove: boolean
}

interface Emits {
  (event: 'on-toggle-status', payload: any): void
  (event: 'on-remove', payload: any): void
}

defineProps<Props>()

const emits = defineEmits<Emits>()
</script>

<template>
  <b-dropdown class="d-flex" variant="link" no-caret toggle-class="p-0" right :data="item">
    <template #button-content>
      <b-button variant="flat-dark" class="btn-icon">
        <feather-icon :icon="IconsList.MoreVerticalIcon" />
      </b-button>
    </template>

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

    <b-dropdown-item :to="{ name: updatePageName, params: { id: item.id } }">
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

    <b-dropdown-item v-if="canRemove" @click="emits('on-remove', item)">
      <feather-icon :icon="IconsList.Trash2Icon" size="16" class="text-danger" />

      <span class="text-danger align-middle ml-50">
        {{ $t('action.remove') }}
      </span>
    </b-dropdown-item>
  </b-dropdown>
</template>
