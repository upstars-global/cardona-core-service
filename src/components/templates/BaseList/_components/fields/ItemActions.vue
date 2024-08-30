<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { useRouter } from 'vue-router'
import type { IBaseListConfig } from '../../../../../@model/templates/baseList'
import { BaseListActionsSlots } from '../../../../../@model/templates/baseList'
import { IconsList } from '../../../../../@model/enums/icons'
import { VColors, VSizes, VVariants } from '../../../../../@model/vuetify'

interface Props {
  item: any
  createPageName: string
  config: IBaseListConfig
  canUpdate: boolean
  canUpdateItem: boolean
  canUpdateSeo: boolean
  canCreate: boolean
  getUpdateRoute: (item: { id: string }) => Location
  canRemoveItem?: boolean
}

interface Emits {
  (event: 'on-toggle-status', payload: any): void
  (event: 'on-remove', payload: any): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const router = useRouter()
const slots = useSlots()

const existSlot = (slotKey: BaseListActionsSlots) => !!slots[slotKey]

const isExistsActionItemsSlot = computed(
  () => {
    return [BaseListActionsSlots.PrependActionItem, BaseListActionsSlots.AppendActionItem].some(slotName => !!slots[slotName] && !!slots[slotName]()[0].children.length)
  },
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

const onUpdateItem = () => {
  router.push(props.getUpdateRoute(props.item))
}

const onCreateCopy = () => {
  router.push({ name: props.createPageName, params: { id: props.item.id } })
}
</script>

<template>
  <VMenu v-if="isShowActions">
    <template #activator="{ props }">
      <VBtn
        v-bind="props"
        icon
        :color="VColors.Secondary"
        :variant="VVariants.Text"
        :size="VSizes.Small"
      >
        <VIcon
          :icon="IconsList.MoreVerticalIcon"
          color="grey-600"
        />
      </VBtn>
    </template>

    <VList>
      <slot
        v-if="existSlot(BaseListActionsSlots.PrependActionItem)"
        :name="BaseListActionsSlots.PrependActionItem"
        :item="item"
      />

      <VListItem
        v-if="canUpdate && config.withDeactivation"
        :prepend-icon="item.isActive ? IconsList.ToggleLeftIcon : IconsList.ToggleRightIcon"
        @click="emits('on-toggle-status', item)"
      >
        <VListItemTitle>
          {{ item.isActive ? $t('action.deactivate') : $t('action.activate') }}
        </VListItemTitle>
      </VListItem>

      <VListItem
        v-if="canShowEdit"
        :prepend-icon="IconsList.EditIcon"
        @click="onUpdateItem"
      >
        <VListItemTitle>
          {{ $t('action.edit') }}
        </VListItemTitle>
      </VListItem>

      <VListItem
        v-if="canCreate && config.createFromCopy"
        :prepend-icon="IconsList.CopyPlusIcon"
        @click="onCreateCopy"
      >
        <VListItemTitle>
          {{ $t('action.makeCopy') }}
        </VListItemTitle>
      </VListItem>

      <VListItem
        v-if="canRemoveItem"
        class="text-error"
        @click="emits('on-remove', item)"
      >
        <template #prepend>
          <VIcon :icon="IconsList.Trash2Icon" />
        </template>
        <VListItemTitle>
          {{ $t('action.remove') }}
        </VListItemTitle>
      </VListItem>

      <slot
        v-if="existSlot(BaseListActionsSlots.AppendActionItem)"
        :name="BaseListActionsSlots.AppendActionItem"
        :item="item"
      />
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
