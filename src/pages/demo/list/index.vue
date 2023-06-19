<template>
  <base-list :use-list="useDemoList" :config="listConfig" class="demo-list">
    <template #right-search-btn>
      <b-button variant="primary" :to="{ name: 'DemoCreate' }" class="ml-1">
        <feather-icon icon="PlusIcon" class="mr-50" />

        <span class="text-nowrap">
          {{ $t('action.create') }}
        </span>
      </b-button>
    </template>

    <template #cell(name)="{ item }">
      <name-with-id-field :item="item" :get-update-route="getUpdateRoute" />
    </template>

    <template #cell(winBack)="{ item }">
      <sum-and-currency
        :data="{
          amount: item.wagerValue,
          currency: item?.currency,
          remainder: item.wagerLimit,
        }"
      />
    </template>

    <template #cell(type)="{ item }">
      {{ item.type.name }}
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

        <b-dropdown-item :to="{ name: 'DemoUpdate', params: { id: '1' } }">
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
import { Location } from 'vue-router'
import { useDemoList } from '../useDemo'
import { useUtils as useI18nUtils } from '../../../@core/libs/i18n'
import { FilterType } from '../../../@model/filter'
import { ProjectFilterTypes } from '@filterConfig'
import NameWithIdField from '../../../components/templates/BaseList/_components/NameWithIdField.vue'

const { t } = useI18nUtils()

const listConfig = new BaseListConfig({
  withSettings: true,
  skeletonColumns: 10,
  responsive: true,
  draggable: true,
  withCustomFetchList: true,
  withSearch: true,
  filterList: [
    {
      type: FilterType.Status,
      key: 'isActive',
    },
    {
      type: FilterType.DateRangeCreative,
      key: 'created',
    },
    {
      type: ProjectFilterTypes.Tags,
      key: 'tagsIds',
      trackBy: 'id',
    },
    {
      type: FilterType.TransactionsType,
      key: 'type',
      trackBy: 'id',
    },
    {
      type: FilterType.GameId,
      key: 'gameId',
    },
  ],
})

const getUpdateRoute = ({ id }): Location => ({ name: 'DemoUpdate', params: { id } })
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
