<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { _RouteLocationBase } from 'vue-router'
import BaseList from '../../../components/templates/BaseList/index.vue'
import { useDemoList } from '../useDemo'
import { FilterType } from '../../../@model/filter'
import { IconsList } from '../../../@model/enums/icons'
import { BaseListConfig, SortDirection } from '../../../@model/templates/baseList'
import { VColors, VSizes, VVariants } from '../../../@model/vuetify'
import { ProjectFilterTypes } from '@filterConfig'
import BtnIcon from '@/components/templates/_components/BtnIcon.vue'

const { t } = useI18n()

const listConfig = new BaseListConfig({
  withSettings: true,
  withCustomFetchList: true,
  withSearch: true,
  createFromCopy: true,
  withExport: true,
  sidebar: true,
  sidebarCollapseMode: true,
  withDeactivation: true,
  selectable: true,
  searchPlaceholder: t('placeholder.search._'),
  staticSorts: {
    key: 'shortId',
    order: SortDirection.asc,
  },
  withMultipleActions: true,
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
    {
      type: FilterType.SumRange,
      key: 'sumRange',
    },
  ],
})

const getUpdateRoute = ({ id }): _RouteLocationBase => ({ name: 'DemoUpdate', params: { id } })

const buttonState = ref({})

const setButtonState = (key: string): void => {
  buttonState.value = {
    ...buttonState.value,
    [key]: !buttonState.value[key] || false,
  }
}
</script>

<template>
  <BaseList
    :use-list="useDemoList"
    :config="listConfig"
    class="demo-list mr-md-1 mr-sm-0"
  >
    <template #table-field-setting>
      <VIcon
        :icon="IconsList.BookIcon"
        size="21"
        class="mr-1"
      />
    </template>
    <template #cell(winBack)="{ item }">
      <SumAndCurrency
        :data="{
          amount: item.wagerValue,
          currency: item?.currency,
          remainder: item.wagerLimit,
        }"
      />
    </template>
    <template #nameSlot-nameWithIdTitle="{ item }">
      {{ item.name }}
    </template>
    <template #cell(editableField)="{ item }">
      <EditFieldWrapper :value="item.editableField">
        <template #default="{ value }">
          <div>{{ value.from }} - {{ value.to }}</div>
        </template>
        <template #input="{ inputValue, updateValue }">
          <NumberRangeField
            :model-value="inputValue"
            @update:modelValue="updateValue"
          />
        </template>
      </EditFieldWrapper>
    </template>

    <template #cell(type)="{ item }">
      {{ item.type.name }}
    </template>

    <template #cell(innerLink)="{ item }">
      <InnerBlankLink
        :value="{ title: item.name, route: getUpdateRoute(item) }"
        :size="VSizes.Large"
      />
      <InnerBlankLink :value="{ title: item.name, route: getUpdateRoute(item) }" />
      <InnerBlankLink
        :value="{ title: item.name, route: getUpdateRoute(item) }"
        :size="VSizes.Small"
      />
    </template>

    <template #cell(sumPeriod)="{ item }">
      <SumPeriod
        :data="{
          today: item.paymentsToday,
          week: item.paymentsWeek,
          month: item.paymentsMonth,
          currency: item.currency,
        }"
      />
    </template>
    <template #sidebar-row(callbackData)="{ item }">
      <template v-if="item">
        <h6 class="mb-1">
          {{ $t('common.callback') }}
        </h6>
        <CodeViewEditor :model-value="item" />
      </template>
    </template>
    <template #cell(settings)="{ item }">
      <div class="d-flex gap-2">
        <BtnIcon
          :icon="IconsList.ClockIcon"
          :value="!!buttonState[item.id]"
          :tooltip-text="Boolean(buttonState[item.id]) ? $t('common.isActive') : $t('common.unActive')"
          @click="setButtonState(item.id)"
        />
        <BtnIcon
          is-static
          :icon="IconsList.ClockIcon"
          :value="!!buttonState[item.id]"
          :tooltip-text="Boolean(buttonState[item.id]) ? $t('common.isActive') : $t('common.unActive')"
          @click="setButtonState(item.id)"
        />
      </div>
    </template>
  </BaseList>
</template>

 <style scoped lang="scss">
  :deep(.code-view-editor) {
    .CodeMirror-linenumber {
      display: none;
    }
    .CodeMirror-gutters {
      display: none;
    }
  }
  .demo-list {
      :deep(td[data-c-field='editableField']) {
        .editable-wrapper {
          display: flex;
          justify-content: start;
          align-items: center;
          min-width: 12rem;
        }
    }
  }
</style>
