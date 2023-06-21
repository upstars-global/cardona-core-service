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

    <template #cell(innerLink)="{ item }">
      <inner-blank-link :value="{ title: item.name, route: getUpdateRoute(item) }" size="xl" />
      <inner-blank-link :value="{ title: item.name, route: getUpdateRoute(item) }" />
      <inner-blank-link :value="{ title: item.name, route: getUpdateRoute(item) }" size="sm" />
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
import InnerBlankLink from '../../../components/templates/_components/InnerBlankLink.vue'

const { t } = useI18nUtils()

const listConfig = new BaseListConfig({
  withSettings: true,
  skeletonColumns: 10,
  responsive: true,
  draggable: true,
  withCustomFetchList: true,
  withSearch: true,
  createFromCopy: true,
  withExport: true,
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
