<script setup lang="ts">
import CTable from '../../CTable/index.vue'
import type { IBaseListConfig } from '../../../@model/templates/baseList'
import type { TableField } from '../../../@model/templates/tableFields'
import { SortDirection } from '../../../@model/templates/baseList'
import { paginationMeta } from '../../../@fake-db/utils'
import type { Options } from '../../../@core/types'
import { ListSort } from '../../../@model'
import { getStorage } from '../../../helpers/storage'
import { VColors } from '../../../@model/vuetify'

const props = defineProps<{
  config?: IBaseListConfig
  useList?: unknown
}>()

const emits = defineEmits<{
  (e: 'rowClicked', item: Record<string, unknown>): void
}>()

const {
  entityName,

  // fields,

  /* ListFilterModel, */
  SideBarModel,

  /* pageName,
  canUpdateCb,
  canRemoveCb,
  beforeRemoveCallback,
  ListItemModel, */
} = props.useList()

const currentPageName = 'demo'

const slots = useSlots()
const selectedItem = ref(null)
const selectedItems = ref([])
const isSidebarShown = ref(false)

const sortStorageKey = `${currentPageName}-${entityName}-sort`
const sortFromStorage = getStorage(sortStorageKey, ListSort) as ListSort

const sortBy = sortFromStorage?.field || props.config.staticSorts?.field
const sortDir = sortFromStorage?.dir || props.config.staticSorts?.dir
const sortDesc = !!sortDir && sortDir === SortDirection.asc
const sortData = ref([{ key: sortBy, order: sortDesc }])

const options = ref<Options>({
  page: 1,
  itemsPerPage: 2,
  sortBy: [],
  groupBy: [],
  search: undefined,
})

const fields = ref([
  {
    key: 'isActive',
    title: 'Status',
    type: 'pill-status',
    size: 'md',
    sortable: true,
    removable: true,
  },
  {
    key: 'status',
    title: 'Status',
    type: 'status',
    size: 'md',
    sortable: true,
  },
  {
    key: 'shortId',
    title: 'short ID',
    type: 'copy-short',
    size: 'md',
  },
  {
    key: 'nameSlot',
    title: 'Name',
    type: 'name-with-id',
    size: 'md',
  },
  {
    key: 'nameWithShortId',
    title: 'Name with shortId',
    type: 'name-with-short-id',
    size: 'md',
  },
  {
    key: 'innerLink',
    title: 'Link',
    size: 'md',
  },
  {
    key: 'buttonName',
    title: 'Button',
    type: 'button',
    size: 'md',
  },
  {
    key: 'tags',
    title: 'Tags',
    type: 'badges',
    size: 'md',
  },
  {
    key: 'login',
    title: 'Login',
    type: 'copy',
    size: 'md',
  },
  {
    key: 'date',
    title: 'Date',
    type: 'date',
    size: 'md',
  },
  {
    key: 'newDate',
    title: 'Created',
    type: 'date-with-seconds',
    size: 'md',
  },
  {
    key: 'period',
    title: 'Display period',
    type: 'period',
    size: 'md',
  },
  {
    key: 'sumPeriod',
    title: 'Sum period',
    size: 'md',
  },
  {
    key: 'imagePath',
    title: 'Image',
    type: 'image',
    size: 'md',
  },
  {
    key: 'position',
    title: 'Priority',
    type: 'priority',
    size: 'md',
  },
  {
    key: 'state',
    title: 'State',
    type: 'statement',
    size: 'md',
  },
  {
    key: 'amount',
    title: 'Sum',
    type: 'sum-and-currency',
    size: 'md',
  },
  {
    key: 'winBack',
    title: 'Sum',
    type: 'sum-and-currency',
    size: 'md',
  },
  {
    key: 'comment',
    title: 'Comment',
    type: 'comment',
    size: 'md',
  },
  {
    key: 'gameId',
    title: 'Game ID',
    size: 'md',
  },
  {
    key: 'type',
    title: 'Type',
    size: 'md',
  },
  {
    key: 'actions',
    title: '',
    size: 'md',
  },
])

const selectedFields = ref<TableField[]>([...fields.value])

const items = ref([
  {
    id: '632c39448e03b2dab20c8a77',
    shortId: '632c39448e03b2dab20c8a77',
    partnerCode: '123632c39448e03b2dab20c8a77',
    name: 'Test',
    nameWithShortId: 'Test',
    isActive: true,
    status: 'new',
    amount: 70000,
    currency: 'EUR',
    wagerValue: '4000',
    wagerLimit: '300',
    date: '2022-12-31T10:00:00+00:00',
    newDate: '2022-11-31T10:00:00+00:00',
    email: 'test@test.com',
    period: {
      dateFrom: '2022-12-31T10:00:00+00:00',
      dateTo: '2024-04-26T20:59:00+00:00',
    },
    buttonName: 'Test button name',
    login: 'My login',
    localization: 'en',
    country: 'en',
    position: 1,
    imagePath: '/demo-images/1.png',
    tags: [
      {
        id: '638f1a4c9bb32010930bf230',
        name: 'test',
        position: 3,
      },
      {
        id: '638f1a4c9bb32010930bf231',
        name: 'test 1',
        position: 23,
      },
      {
        id: '638f1a4c9bb32010930bf232',
        name: 'test 2',
        position: 5,
      },
    ],
    type: {
      id: 'deposit',
      name: 'Deposit',
    },
    gameId: '622c39448e03b2dab20c8a77',
    state: true,
    comment: 'Some commmmmmmmmmmmmmment Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum',
    rowVariant: VColors.Primary,
  },
  {
    id: '632c39448e03b2dab20c8a78',
    shortId: '632c39448e03b2dab20c8a78',
    partnerCode: '883632c39448e03b2dab20c8a78',
    name: 'Test1',
    nameWithShortId: 'Test1',
    isActive: false,
    amount: 1000,
    currency: 'USD',
    wagerValue: '77000',
    wagerLimit: '3200',
    status: 'active',
    date: '2022-12-31T10:00:00+00:00',
    newDate: '2022-10-31T10:00:00+00:00',
    period: {
      dateFrom: '2022-12-31T10:00:00+00:00',
      dateTo: '2024-04-26T20:59:00+00:00',
    },
    email: 'test@test.com',
    buttonName: 'button name',
    login: 'Some',
    position: 4,
    imagePath: '/demo-images/2.png',
    tags: [
      {
        id: '638f1a4c9bb32010930bf233',
        name: 'test 3',
      },
      {
        id: '638f1a4c9bb32010930bf234',
        name: 'test 4',
        position: 3,
      },
      {
        id: '638f1a4c9bb32010930bf235',
        name: 'test 5',
        position: 23,
      },
    ],
    type: {
      id: 'deposit',
      name: 'Deposit',
    },
    gameId: '622c39448e03b2dab20c8a78',
    state: false,
    comment: 'Some',
    paymentsToday: '100',
    paymentsWeek: '1100',
    paymentsMonth: '11100',
    rowVariant: VColors.Info,
  },
  {
    id: '632c39448e03b2dab20c8a79',
    shortId: '632c39448e03b2dab20c8a79',
    partnerCode: '783632c39448e03b2dab20c8a78',
    name: 'Test2',
    nameWithShortId: 'Test2',
    isActive: true,
    amount: 0,
    currency: 'EUR',
    wagerValue: '0',
    wagerLimit: '0',
    status: 'inactive',
    date: '2022-12-31T10:00:00+00:00',
    newDate: '2022-09-31T10:00:00+00:00',
    period: {
      dateFrom: '2022-12-31T10:00:00+00:00',
      dateTo: '2024-04-26T20:59:00+00:00',
    },
    email: 'test@test.com',
    buttonName: 'Test button name',
    login: 'cwilliams1956@game.com',
    position: 1,
    imagePath: '/demo-images/4.png',
    tags: [
      {
        id: '638f1a4c9bb32010930bf231',
        name: 'test 1',
        position: 23,
      },
      {
        id: '638f1a4c9bb32010930bf236',
        name: 'test 6',
        position: 3,
      },
      {
        id: '638f1a4c9bb32010930bf235',
        name: 'test 5',
        position: 23,
      },
    ],
    gameId: '622c39448e03b2dab20c8a79',
    state: true,
    comment: '',
    type: {
      id: 'payout',
      name: 'Payout',
    },
    paymentsToday: '200',
    paymentsWeek: '2200',
    paymentsMonth: '22200',
    rowVariant: 'light-info',
  },
  {
    id: '632c39448e03b2dab20c8a75',
    shortId: '632c39448e03b2dab20c8a75',
    partnerCode: '8a632c39448e03b2dab20c8a75',
    name: 'Test',
    nameWithShortId: 'Test',
    isActive: false,
    status: 'delete',
    amount: 20000,
    currency: 'USD',
    wagerValue: '40200',
    wagerLimit: '30990',
    date: '2022-12-31T10:00:00+00:00',
    newDate: '2022-12-31T10:00:00+00:00',
    period: {
      dateFrom: '2022-12-31T10:00:00+00:00',
      dateTo: '2024-04-26T20:59:00+00:00',
    },
    email: 'test@test.com',
    buttonName: 'Some name',
    login: '',
    position: 55,
    imagePath: '/demo-images/5.png',
    tags: [
      {
        id: '638f1a4c9bb32010930bf231',
        name: 'test 1',
        position: 23,
      },
      {
        id: '638f1a4c9bb32010930bf238',
        name: 'test 8',
      },
      {
        id: '638f1a4c9bb32010930bf239',
        name: 'test 9',
      },
    ],
    gameId: '622c39448e03b2dab20c8a75',
    state: true,
    comment: 'Some commmmmmmmmmmmmmment',
    type: {
      id: 'deposit',
      name: 'Deposit',
    },
    paymentsToday: '300',
    paymentsWeek: '3300',
    paymentsMonth: '33300',
    rowVariant: 'light-warning',
  },
])

const onClickRow = data => {
  if (props.config?.selectable)
    return

  if (props.config?.sidebar)
    isSidebarShown.value = true

  selectedItem.value = data

  emits('rowClicked', data)
}

const resetSelectedItem = () => {
  selectedItem.value = null
}

const checkSlotExistence = (slotName: string): boolean => !!slots[slotName]
</script>

<template>
  <SideBar
    v-model:sidebar-active="isSidebarShown"
    :item="selectedItem"
    :entity-name="entityName"
    :side-bar-model="SideBarModel"
    :sidebar-collapse-mode="config?.sidebarCollapseMode"
    @update:model-value="resetSelectedItem"
  />
  <CTable
    v-model:sort-data="sortData"
    :fields="fields"
    :rows="items"
    :select-mode="config.selectMode"
    :selectable="config.selectable"
    :small="config.small"
    :draggable="config.draggable"
    :hover="config.hover"
    :selected-items="selectedItems"
    @row-clicked="onClickRow"
  >
    <template
      v-for="(fieldItem) in selectedFields"
      :key="`base-list_cell-${fieldItem.key}`"
      #[`cell(${fieldItem.key})`]="{ field, item, cell }"
    >
      <slot
        v-if="checkSlotExistence(`cell(${fieldItem.key})`)"
        :name="`cell(${fieldItem.key})`"
        :field="field"
        :item="item"
        :cell="cell"
      />

      <template v-else>
        {{ cell }}
      </template>
    </template>
  </CTable>
  <div class="d-flex align-center justify-center justify-sm-space-between flex-wrap gap-3 pa-5 pt-3">
    <p class="text-sm text-disabled mb-0">
      {{ paginationMeta(options, items.length) }}
    </p>

    <VPagination
      v-model="options.page"
      :total-visible="Math.ceil(items.length / options.itemsPerPage)"
      :length="Math.ceil(items.length / options.itemsPerPage)"
      rounded="circle"
    />
  </div>
</template>
