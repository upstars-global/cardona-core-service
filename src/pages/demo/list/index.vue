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
import BtnIcon from '../../../components/templates/_components/BtnIcon.vue'
import { ProjectFilterTypes } from '@filterConfig'

const { t } = useI18n()

const listConfig = new BaseListConfig({
  withCustomFetchList: true,
  withSearch: true,
  createFromCopy: true,
  withExport: true,
  sidebar: true,
  sidebarCollapseMode: true,
  withDeactivation: true,
  selectable: true,
  searchPlaceholder: t('placeholder.search._'),
  draggable: true,
  scrollPagination: { perPage: 50 },
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
  showExpand: true,
  pagination: false,
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
        class="mr-1"
      />
    </template>
    <template #cell(expand)="{ item, isExpanded, toggleExpand }">
      <VBtn
        :variant="VVariants.Outlined"
        :size="42"
        @click.stop="toggleExpand(item.id)"
      >
        <VIcon :icon="isExpanded ? IconsList.ChevronUpIcon : IconsList.ChevronDownIcon" />
      </VBtn>
    </template>
    <template #cellExpand(expand)>
      <!--      It need for not render expand button into expand -->
      <div />
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
            @update:model-value="updateValue"
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
        :copy-element="item.name"
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
        <VTooltip location="bottom">
          <template #activator="{ props }">
            <VBtn
              :color="Boolean(buttonState[item.id]) ? VColors.Success : VColors.Error"
              :variant="VVariants.Tonal"
              :size="VSizes.XSmall"
              :icon="IconsList.ClockIcon"
              rounded="lg"
              v-bind="props"
              @click.stop="setButtonState(item.id)"
            />
          </template>
          {{ Boolean(buttonState[item.id]) ? $t('common.isActive') : $t('common.unActive') }}
        </VTooltip>
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
</style>
