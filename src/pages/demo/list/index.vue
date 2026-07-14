<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { _RouteLocationBase } from 'vue-router'
import BaseList from '../../../components/templates/BaseList/index.vue'
import { useDemoList } from '../useDemo'
import { DemoListItem } from '../../../@model/demo'
import { FilterType } from '../../../@model/filter'
import { IconsList } from '../../../@model/enums/icons'
import { BaseListConfig, SortDirection } from '../../../@model/templates/baseList'
import { VColors, VSizes, VVariants } from '../../../@model/vuetify'
import BtnIcon from '../../../components/templates/_components/BtnIcon.vue'
import { ProjectFilterTypes } from '@filterConfig'

const { t } = useI18n()

const listConfig = new BaseListConfig({
  withSettings: true,
  withSearch: true,
  createFromCopy: true,
  withExport: true,
  sidebar: true,
  sidebarCollapseMode: true,
  withDeactivation: true,
  selectable: true,
  searchPlaceholder: t('placeholder.search._'),
  draggable: true,
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
  inlineFilters: [
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
  ],
  showExpand: true,
})

const getUpdateRoute = ({ id }): _RouteLocationBase => ({ name: 'DemoUpdate', params: { id } })

const buttonState = ref({})

const setButtonState = (key: string): void => {
  buttonState.value = {
    ...buttonState.value,
    [key]: !buttonState.value[key] || false,
  }
}

// ─── 1000-item performance mock ──────────────────────────────────────────────
// Pre-generates items outside Vue reactivity so there's zero proxy overhead.
// Toggle the button in the template to switch between real API and mock data.
const MOCK_COUNT = 500

const CURRENCIES = ['USD', 'EUR', 'UAH']
const LOCALES = ['en', 'uk', 'de']
const COUNTRIES = ['UA', 'PL', 'DE']
const TYPE_NAMES = ['Deposit', 'Withdrawal', 'Bonus']

const mockItems = Array.from({ length: MOCK_COUNT }, (_, idx) => {
  const i = idx + 1
  return new DemoListItem({
    id: `mock-${i}`,
    shortId: String(i).padStart(6, '0'),
    partnerCode: `PC${i}`,
    name: `Demo Item #${i}`,
    isActive: i % 3 !== 0,
    status: i % 2 === 0 ? 'active' : 'inactive',
    amount: (i * 137) % 99_999,
    currency: CURRENCIES[i % 3],
    wagerValue: String((i * 10) % 1_000),
    wagerLimit: String((i * 50) % 5_000),
    date: new Date(Date.now() - i * 86_400_000).toISOString(),
    newDate: new Date(Date.now() - i * 3_600_000).toISOString(),
    email: `user${i}@demo.com`,
    period: { dateFrom: '2024-01-01', dateTo: '2024-12-31' },
    buttonName: `Action ${i}`,
    login: `login_${i}`,
    localization: LOCALES[i % 3],
    country: COUNTRIES[i % 3],
    position: i,
    positionByInputWrapper: i,
    imagePath: '',
    imageFull: { id: `img-${i}`, imagePath: '' },
    tags: i % 5 === 0 ? [{ id: 'tag1', name: 'Tag 1' }, { id: 'tag2', name: 'Tag 2' }] : [],
    type: { id: 'deposit' as any, name: TYPE_NAMES[i % 3] },
    gameId: `game-${i % 20}`,
    state: i % 4 === 0,
    comment: i % 7 === 0 ? `Comment for item ${i}` : '',
    rowVariant: null as any,
    editableField: { from: i % 100, to: (i % 100) + 50 },
    callbackData: { index: i },
  })
})

const mockListConfig = new BaseListConfig({
  withSettings: true,
  selectable: true,
  showExpand: true,
  withDeactivation: true,
  withMultipleActions: true,
  pagination: false,
  defaultPerPage: MOCK_COUNT,
  // Virtual scroll: only ~30 visible rows in DOM instead of all MOCK_COUNT
  itemHeight: 52,
})

const useDemoListMock = () => ({
  ...useDemoList(),
  useStore: () => ({
    fetchEntityList: async ({ data: { perPage, page } }: any) => {
      const start = ((page ?? 1) - 1) * (perPage ?? MOCK_COUNT)
      return { list: mockItems.slice(start, start + (perPage ?? MOCK_COUNT)), total: MOCK_COUNT }
    },
  }),
})

const isMock = ref(false)
// ─────────────────────────────────────────────────────────────────────────────
</script>

<template>
  <div class="d-flex align-center gap-3 mb-4">
    <VBtn
      :color="isMock ? VColors.Success : VColors.Secondary"
      :variant="VVariants.Tonal"
      size="small"
      @click="isMock = !isMock"
    >
      {{ isMock ? `Mock ${MOCK_COUNT} items (active)` : `Load mock ${MOCK_COUNT} items` }}
    </VBtn>
    <span
      v-if="isMock"
      class="text-caption text-disabled"
    >
      Rendering {{ MOCK_COUNT }} rows — use DevTools Performance to measure v-memo impact
    </span>
  </div>

  <BaseList
    :key="String(isMock)"
    :use-list="isMock ? useDemoListMock : useDemoList"
    :config="isMock ? mockListConfig : listConfig"
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
 :deep([data-c-field="editableField"]) {
   &:has(.editable-wrapper--open) {
   min-width: 300px;
   }
 }
  :deep(.code-view-editor) {
    .CodeMirror-linenumber {
      display: none;
    }
    .CodeMirror-gutters {
      display: none;
    }
  }
</style>
