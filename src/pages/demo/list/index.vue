<template>
  <base-list :use-list="useDemoList" :config="listConfig" class="demo-list mr-md-1 mr-sm-0">
    <template #table-field-setting>
      <feather-icon :icon="IconsList.BookIcon" size="21" class="mr-1" />
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
    <template #nameSlot-nameWithIdTitle="{ item }"> {{ item.name }}</template>
    <template #cell(type)="{ item }">
      {{ item.type.name }}
    </template>

    <template #cell(innerLink)="{ item }">
      <inner-blank-link :value="{ title: item.name, route: getUpdateRoute(item) }" size="xl" />
      <inner-blank-link :value="{ title: item.name, route: getUpdateRoute(item) }" />
      <inner-blank-link :value="{ title: item.name, route: getUpdateRoute(item) }" size="sm" />
    </template>

    <template #cell(sumPeriod)="{ item }">
      <sum-period
        :data="{
          today: item.paymentsToday,
          week: item.paymentsWeek,
          month: item.paymentsMonth,
          currency: item.currency,
        }"
      />
    </template>
    <template #cell(settings)="{ item }">
      <div class="d-flex">
        <btn-icon disabled :icon="IconsList.ClockIcon" :value="!!buttonState[item.id]" />
        <btn-icon
          class="ml-50"
          :value="!!buttonState[item.id]"
          :icon="IconsList.ClockIcon"
          :tooltip-text="
            Boolean(buttonState[item.id]) ? $t('common.isActive') : $t('common.unActive')
          "
          @click="setButtonState(item.id)"
        />
      </div>
    </template>
  </base-list>
</template>

<script lang="ts">
export default {
  name: 'DemoList',
}
</script>

<script setup lang="ts">
import { ref } from 'vue'
import BaseList from '../../../components/templates/BaseList/index.vue'
import SumAndCurrency from '../../../components/SumAndCurrency.vue'
import { BaseListConfig } from '../../../components/templates/BaseList/model'
import { Location } from 'vue-router'
import { useDemoList } from '../useDemo'
import { useUtils as useI18nUtils } from '../../../@core/libs/i18n'
import { FilterType } from '../../../@model/filter'
import { ProjectFilterTypes } from '@filterConfig'
import InnerBlankLink from '../../../components/templates/_components/InnerBlankLink.vue'
import SumPeriod from '../../../components/templates/_components/SumPeriod.vue'
import BtnIcon from '../../../components/BtnIcon.vue'
import { IconsList } from '../../../@model/enums/icons'

const { t } = useI18nUtils()

const listConfig = new BaseListConfig({
  withSettings: true,
  skeletonColumns: 10,
  responsive: true,
  withCustomFetchList: true,
  withSearch: true,
  createFromCopy: true,
  withExport: true,
  sidebar: true,
  sidebarCollapseMode: true,
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
      type: FilterType.DemoType,
      key: 'type',
      trackBy: 'id',
    },
    {
      type: ProjectFilterTypes.Tags,
      key: 'tagsIds',
      trackBy: 'id',
    },
    {
      type: FilterType.GameId,
      key: 'gameId',
    },
  ],
})

const getUpdateRoute = ({ id }): Location => ({ name: 'DemoUpdate', params: { id } })

const buttonState = ref({})
const setButtonState = (key: string): void => {
  buttonState.value = {
    ...buttonState.value,
    [key]: !buttonState.value[key] || false,
  }
}
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
