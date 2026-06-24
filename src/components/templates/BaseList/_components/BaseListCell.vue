<script setup lang="ts">
import type { IBaseListConfig } from '../../../../@model/templates/baseList'
import { BaseListSlots } from '../../../../@model/templates/baseList'
import type { TableField } from '../../../../@model/templates/tableFields'
import { ListFieldType } from '../../../../@model/templates/tableFields'
import CopyField from '../../_components/CopyField.vue'
import StatementField from '../../_components/StatementField.vue'
import DateWithSecondsField from '../../_components/DateWithSecondsField.vue'
import SumAndCurrency from '../../_components/SumAndCurrency.vue'
import StatusField from '../../_components/StatusField.vue'
import PillStatusField from './fields/PillStatusField.vue'
import NameWithIdField from './fields/NameWithIdField.vue'
import NameWithShortIdField from './fields/NameWithShortIdField.vue'
import EmailField from './fields/EmailField.vue'
import DateField from './fields/DateField.vue'
import BadgesField from './fields/BadgesField.vue'
import PositionField from './fields/PositionField.vue'
import ButtonField from './fields/ButtonField.vue'
import CommentField from './fields/CommentField.vue'
import ImageField from './fields/ImageField.vue'
import ImageDetailField from './fields/ImageDetailField.vue'
import DatePeriodField from './fields/DatePeriodField.vue'
import CopyShortField from './fields/CopyShortField.vue'
import ItemActions from './fields/ItemActions.vue'

defineOptions({ name: 'BaseListCell' })

const props = defineProps<{
  field: TableField
  item: { raw: Record<string, unknown>; value: unknown }
  cell: unknown
  getUpdateRoute: (item: { id: string }) => object
  getDetailsRoute: (item: { id: string }) => object
  isShowYou: boolean
  canUpdate: boolean
  editingId: string | null
  createPageName: string
  detailsPageName: string
  canCreate: boolean
  canUpdateSeo: boolean
  canUpdateItem: boolean
  canRemoveItem: boolean
  canCopyItem: boolean
  config: IBaseListConfig
}>()

const emit = defineEmits<{
  'edit-position': [item: Record<string, unknown>, val: number]
  'open-edit': [id: string]
  'show-detail-image': [imagePath: string]
  'on-remove': [item: unknown]
  'on-toggle-status': [item: unknown]
}>()
</script>

<template>
  <span
    v-if="$slots['custom-slot']"
    style="display: contents"
    @click.stop
  >
    <slot name="custom-slot" />
  </span>
  <StatusField
    v-else-if="field.type === ListFieldType.Status"
    :value="cell"
  />

  <SumAndCurrency
    v-else-if="field.type === ListFieldType.SumAndCurrency"
    :align="field.align"
    :data="{
      amount: cell,
      currency: item.raw.currency,
      remainder: item.raw.remainder,
    }"
  />

  <PillStatusField
    v-else-if="field.type === ListFieldType.PillStatus"
    :is-active="cell"
  />

  <NameWithIdField
    v-else-if="field.type === ListFieldType.NameWithId"
    :item="item.raw"
    :get-update-route="getUpdateRoute"
    :get-details-route="getDetailsRoute"
    :is-show-you="isShowYou"
  >
    <slot
      name="nameWithIdTitle"
      :item="item.raw"
      :can-update="canUpdate"
    />
  </NameWithIdField>

  <NameWithShortIdField
    v-else-if="field.type === ListFieldType.NameWithShortId"
    :item="item.raw"
    :get-update-route="getUpdateRoute"
    :get-details-route="getDetailsRoute"
    :is-show-you="isShowYou"
  >
    <slot
      name="nameWithIdTitle"
      :item="item.raw"
    />
  </NameWithShortIdField>

  <EmailField
    v-else-if="field.type === ListFieldType.Email"
    :item="item.raw"
    :get-update-route="getUpdateRoute"
  />

  <DateField
    v-else-if="field.type === ListFieldType.Date"
    :date="cell"
  />

  <DateWithSecondsField
    v-else-if="field.type === ListFieldType.DateWithSeconds"
    :date="cell"
  />

  <StatementField
    v-else-if="field.type === ListFieldType.Statement"
    :state="cell"
  />

  <BadgesField
    v-else-if="field.type === ListFieldType.Badges"
    :list-badges="cell"
  >
    <template #default="{ value }">
      <slot
        name="badgeTitle"
        :item="item.raw"
        :cell="cell"
        :value="value"
      />
    </template>
  </BadgesField>

  <PositionField
    v-else-if="field.type === ListFieldType.Priority"
    :id="(item.raw.id as string)"
    :position="cell"
    :size="field.size"
    :can-update="canUpdate"
    :editing-id="editingId"
    @edit-position="(val) => emit('edit-position', item.raw, val)"
    @open-edit="emit('open-edit', item.raw.id as string)"
  />

  <ButtonField
    v-else-if="field.type === ListFieldType.Button"
    :btn-name="cell"
  />

  <CommentField
    v-else-if="field.type === ListFieldType.Comment"
    :value="cell"
  />

  <ImageField
    v-else-if="field.type === ListFieldType.Image"
    :image-path="cell"
    :size="field.size"
  />

  <ImageDetailField
    v-else-if="field.type === ListFieldType.ImageFull"
    :id="(item.raw.id as string)"
    :image-path="(item.raw[field.key] as any)?.imagePath"
    :size="field.size"
    :compression-for-preview="(item.raw[field.key] as any)?.compressionForPreview || 0"
    @show-modal="emit('show-detail-image', $event)"
  />

  <DatePeriodField
    v-else-if="field.type === ListFieldType.Period"
    :period="cell"
  />

  <CopyField
    v-else-if="field.type === ListFieldType.Copy"
    :value="cell"
  />

  <CopyShortField
    v-else-if="field.type === ListFieldType.CopyShort"
    :value="cell"
  />

  <template v-else-if="field.type === ListFieldType.Percent">
    {{ cell }} %
  </template>
  <template v-else>
    <div class="default-cell-value">
      {{ cell }}
    </div>
  </template>

  <ItemActions
    v-if="field.key === 'actions'"
    :key="(item.raw as any)"
    :item="item.raw"
    :create-page-name="createPageName"
    :details-page-name="detailsPageName"
    :can-update="canUpdate"
    :can-create="canCreate"
    :can-update-seo="canUpdateSeo"
    :can-update-item="canUpdateItem"
    :can-remove-item="canRemoveItem"
    :can-copy-item="canCopyItem"
    :config="config"
    :get-update-route="getUpdateRoute"
    @on-remove="emit('on-remove', $event)"
    @on-toggle-status="emit('on-toggle-status', $event)"
  >
    <template
      v-if="$slots['prependActionItem']"
      #[BaseListSlots.PrependActionItem]
    >
      <slot
        name="prependActionItem"
        :item="item"
        :can-update="canUpdate"
      />
    </template>

    <template #[BaseListSlots.DetailsActionItem]>
      <slot
        name="detailsActionItem"
        :item="item"
        :page-name="detailsPageName"
      />
    </template>

    <template
      v-if="$slots['appendActionItem']"
      #[BaseListSlots.AppendActionItem]
    >
      <slot
        name="appendActionItem"
        :item="item"
        :can-update="canUpdate"
        :can-create="canCreate"
      />
    </template>
  </ItemActions>
</template>