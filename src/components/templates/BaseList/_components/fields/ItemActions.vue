<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { useRouter } from 'vue-router'
import type { IBaseListConfig } from '../../../../../@model/templates/baseList'
import { BaseListActionsSlots } from '../../../../../@model/templates/baseList'
import { IconsList } from '../../../../../@model/enums/icons'
import { VColors, VSizes, VVariants } from '../../../../../@model/vuetify'
import { IS_TEST_ENV } from '../../../../../utils/constants'
import { checkExistsPage } from '../../../../../../src/helpers'

interface Props {
  item: any
  createPageName: string
  detailsPageName: string
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
const canShowDetails = computed(() => checkExistsPage(props.detailsPageName))

const onUpdateItem = () => router.push(props.getUpdateRoute(props.item))
const onCreateCopy = () => router.push({ name: props.createPageName, params: { id: props.item.id } })
const onClickDetails = () => router.push({ name: props.detailsPageName, params: { id: props.item.id } })
</script>

<template>
  <VMenu
    v-if="isShowActions"
    :attach="IS_TEST_ENV"
  >
    <template #activator="{ props }">
      <VBtn
        v-bind="props"
        icon
        :color="VColors.Secondary"
        :variant="VVariants.Text"
        :size="VSizes.Small"
        data-test-id="activator"
      >
        <VIcon
          :icon="IconsList.MoreVerticalIcon"
          color="grey-600"
        />
      </VBtn>
    </template>

    <VList
      class="actions-list"
      data-test-id="actions-list"
    >
      <slot
        v-if="existSlot(BaseListActionsSlots.PrependActionItem)"
        :name="BaseListActionsSlots.PrependActionItem"
        :item="item"
      />

      <VListItem
        v-if="canUpdate && (config.withDeactivation || config.withDeactivationBySpecificAction)"
        :prepend-icon="item.isActive ? IconsList.ToggleLeftIcon : IconsList.ToggleRightIcon"
        data-test-id="status-toggle"
        @click="emits('on-toggle-status', item)"
      >
        <VListItemTitle data-test-id="status-toggle-text">
          {{ item.isActive ? $t('action.deactivate') : $t('action.activate') }}
        </VListItemTitle>
      </VListItem>

      <VListItem
        v-if="canShowDetails"
        :prepend-icon="IconsList.EyeIcon"
        data-test-id="details"
        @click="onClickDetails"
      >
        <VListItemTitle>
          {{ $t('action.details') }}
        </VListItemTitle>
      </VListItem>

      <VListItem
        v-if="canShowEdit"
        :prepend-icon="IconsList.EditIcon"
        data-test-id="edit"
        @click="onUpdateItem"
      >
        <VListItemTitle>
          {{ $t('action.edit') }}
        </VListItemTitle>
      </VListItem>

      <VListItem
        v-if="canCreate && config.createFromCopy"
        data-test-id="copy"
        @click="onCreateCopy"
      >
        <template #prepend>
          <VIcon :icon="IconsList.CopyPlusIcon" />
        </template>
        <VListItemTitle>
          {{ $t('action.makeCopy') }}
        </VListItemTitle>
      </VListItem>

      <VListItem
        v-if="canRemoveItem"
        class="text-error hover-text-error"
        data-test-id="remove"
        @click="emits('on-remove', item)"
      >
        <template #prepend>
          <VIcon :icon="IconsList.Trash2Icon" />
        </template>
        <VListItemTitle class="on-hover-color-error text-error">
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
