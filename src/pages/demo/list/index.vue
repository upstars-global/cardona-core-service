<template>
  <base-list :use-list="useDemoList" :config="listConfig" class="demo-list">
    <template #cell(winBack)="{ item }">
      <sum-and-currency
        :data="{
          amount: item.wagerValue,
          currency: item?.currency,
          remainder: item.wagerLimit,
        }"
      />
    </template>

    <template #cell(customActions)="{ item }">
      <b-dropdown class="d-flex" variant="link" no-caret toggle-class="p-0" right>
        <template #button-content>
          <b-button variant="flat-dark" class="btn-icon">
            <feather-icon icon="MoreVerticalIcon" />
          </b-button>
        </template>

        <b-dropdown-item>
          <feather-icon :icon="item.isActive ? 'ToggleLeftIcon' : 'ToggleRightIcon'" size="16" />

          <span class="align-middle ml-50">
            {{ item.isActive ? $t('action.deactivate') : $t('action.activate') }}
          </span>
        </b-dropdown-item>

        <b-dropdown-item>
          <feather-icon icon="EditIcon" size="16" />

          <span class="align-middle ml-50">
            {{ $t('action.edit') }}
          </span>
        </b-dropdown-item>

        <b-dropdown-item>
          <feather-icon icon="CopyIcon" size="16" />

          <span class="align-middle ml-50">
            {{ $t('action.makeCopy') }}
          </span>
        </b-dropdown-item>

        <b-dropdown-item>
          <feather-icon icon="Trash2Icon" size="16" class="text-danger" />

          <span class="text-danger align-middle ml-50">
            {{ $t('action.remove') }}
          </span>
        </b-dropdown-item>
      </b-dropdown>
    </template>
  </base-list>
</template>

<script lang="ts">
export default {
  name: 'DemoList',
}
</script>

<script setup lang="ts">
import BaseList from '../../../components/templates/BaseList/index.vue'
import SumAndCurrency from '../../../components/SumAndCurrency.vue'
import { BaseListConfig } from '../../../components/templates/BaseList/model'
import { useDemoList } from '../useDemo'
import { useUtils as useI18nUtils } from '../../../@core/libs/i18n'

const { t } = useI18nUtils()

const listConfig = new BaseListConfig({
  withSettings: true,
  skeletonColumns: 10,
  responsive: true,
  draggable: true,
  withCustomFetchList: true,
})
</script>

<style lang="scss" scoped>
@import '../../../@core/scss/base/core/colors/palette-variables.scss';

.demo-list {
  &:deep(.our-table) {
    tr {
      th[data-c-field='isActive'] {
        width: 5%;
        max-width: 10%;
      }
    }
  }
}
</style>
