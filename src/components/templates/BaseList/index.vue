<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { findIndex, omit } from 'lodash'
import CTable from '../../CTable/index.vue'
import type { FilterListItem, IBaseListConfig } from '../../../@model/templates/baseList'
import { VColors } from '../../../@model/vuetify'
import { DownloadFormat, SortDirection } from '../../../@model/templates/baseList'
import type { Filter } from '../../../@model/filter'
import { getStorage, removeStorageItem, setStorage } from '@/helpers/storage'
import { ListSort } from '@/@model'
import { useFilters } from '@/components/FiltersBlock/useFilters'
import { BaseField, SelectBaseField } from '@/@model/templates/baseField'
import { FieldType } from '@/@model/field'
import { convertLowerCaseFirstSymbol, isEmptyString, isNotEmptyNumber } from '@/helpers'
import type { PaginationResult } from '@/use/pagination'
import usePagination from '@/use/pagination'
import type { TableField } from '@/@model/templates/tableFields'
import { parseDateRange } from '@/helpers/filters'

const props = defineProps<{
  config?: IBaseListConfig
  useList?: unknown
}>()

const emits = defineEmits<{
  (e: 'rowClicked', item: Record<string, unknown>): void
}>()

const slots = useSlots()

const store = useStore()

// const router = useRouter()
const route = useRoute()
const searchQuery = ref('')
const currentPageName = route.name

const {
  entityName,

  fields,

  ListFilterModel,
  SideBarModel,

  pageName,

  /* canUpdateCb,
 canRemoveCb,
 beforeRemoveCallback, */
  ListItemModel,
} = props.useList()

// Pages
const CreatePageName = pageName ? `${pageName}Create` : `${entityName}Create`

// const UpdatePageName = pageName ? `${pageName}Update` : `${entityName}Update`

/* const isExistsCreatePage = checkExistsPage(CreatePageName)
const isExistsUpdatePage = checkExistsPage(UpdatePageName) */

// Action names
const moduleName = props.config?.customModuleName || convertLowerCaseFirstSymbol(entityName)

const fetchActionName: string = props.config?.withCustomFetchList
  ? `${moduleName}/fetch${entityName}List`
  : 'baseStoreCore/fetchEntityList'

const fetchReportActionName = 'baseStoreCore/fetchReport'
const updateActionName = 'baseStoreCore/updateEntity'

/* const deleteActionName = props.config?.withCustomDelete
  ? `${moduleName}/deleteEntity`
  : 'baseStoreCore/deleteEntity'

const multipleUpdateActionName = 'baseStoreCore/multipleUpdateEntity'
const multipleDeleteActionName = 'baseStoreCore/multipleDeleteEntity' */

// Permissions
/* const { canCreate, canUpdate, canUpdateSeo, canRemove, canExport }
    = basePermissions<IBaseListConfig>({ entityName, config: props.config })

const isShownCreateBtn = !!props.config?.withCreateBtn && isExistsCreatePage && canCreate

const canUpdateItem = (item): boolean =>
  canUpdateCb && item ? isExistsUpdatePage && canUpdateCb(item) : isExistsUpdatePage

const canRemoveItem = (item): boolean =>
  canRemoveCb && item ? canRemove && canRemoveCb(item) : canRemove */

// Sidebar
const isSidebarShown = ref(false)
const selectedItem: any = ref(null)

const sidebarSlots = computed(() =>
  Object.keys(slots).filter(
    key => key.includes('sidebar-row') || key.includes('sidebar-value'),
  ),
)

const resetSelectedItem = () => {
  selectedItem.value = null
}

const onClickRow = data => {
  if (props.config?.selectable)
    return

  if (props.config?.sidebar) {
    isSidebarShown.value = true
    selectedItem.value = data
  }
  emits('rowClicked', data)
}

/* const routerToUpdatePageId = item => {
  router.push(getUpdateRoute(item))
} */

// Table
// const refListTable = ref(null)

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

watch(
  () => items.value,
  () => {
    selectedItem.value = items.value.find((item: any) => item?.id === selectedItem.value?.id)
  },
  { deep: true },
)

const selectedFields = ref<TableField[]>([...fields])

/* const isLoadingList = computed(() => {
  const indexSymbolNextDash = entityName.indexOf('-') + 1
  const entityNameForLoad = entityName.replace(
      entityName[indexSymbolNextDash],
      entityName[indexSymbolNextDash].toLowerCase()
  )

  const entityUrl: string = convertCamelCase(entityNameForLoad, '/')
  return store.getters.isLoadingEndpoint([
    `${entityUrl}/list`,
    `${entityUrl}/update`,
    `${entityUrl}/delete`,
  ])
})

const size = props.config?.small ? 'sm' : 'md' */ // TODO: refactor sizes

// Sort
const sortStorageKey = `${currentPageName}-${entityName}-sort`
const sortFromStorage = getStorage(sortStorageKey, ListSort) as ListSort

const sortBy = sortFromStorage?.field || props.config.staticSorts?.field
const sortDir = sortFromStorage?.dir || props.config.staticSorts?.dir
const sortDesc = !!sortDir && sortDir === SortDirection.asc
const sortData = ref([{ key: sortBy, order: sortDesc }])

watch(sortData, newSortData => {
  newSortData.sortBy
    ? setStorage(sortStorageKey, newSortData)
    : removeStorageItem(sortStorageKey)
})

// Pagination
const perPageStorageKey = `${currentPageName}-${entityName}-perPage`

const paginationConfig: PaginationResult = usePagination({
  defaultPerPage: props.config.defaultPerPage,
  withIndependentPagination: props.config.withIndependentPagination,
  isUseRouter: !props.config.withIndependentPagination,
  storageKey: perPageStorageKey,
})

const {
  currentPage,
  perPage,

  /* perPageOptions,
  numberOfPages, */
  total,

  /* setPerPage,
  setupDataMeta,
  linkGen, */
  updateTotal,
  onChangePagination,
} = paginationConfig

// const dataMeta = setupDataMeta(refListTable)

/* const linkGenerator = (page: number) => {
  if (props.config?.withIndependentPagination)
    return

  return linkGen(page)
} */

// Fetch list
const getList = async () => {
  const filter = setRequestFilters()
  const sort = sortData.sortBy ? [new ListSort(sortData)] : undefined

  const { list, total } = await store.dispatch(fetchActionName, {
    type: entityName,
    data: {
      perPage: perPage.value,
      page: currentPage.value,
      filter,
      sort,
    },
    options: {
      listItemModel: ListItemModel,
      customApiPrefix: props.config?.customApiPrefix,
    },
  })

  items.value = list

  updateTotal(total)

  return list
}

const reFetchList = () => getList()

onChangePagination(reFetchList)

const checkSlotExistence = (slotName: string): boolean => !!slots[slotName]

/*
const getUpdateRoute = ({ id }): Location => {
  return isExistsUpdatePage && (canUpdate || canUpdateSeo)
      ? { name: UpdatePageName, params: { id } }
      : {}
}

const onClickToggleStatus = async ({ id, isActive }) => {
  await store.dispatch(updateActionName, {
    type: entityName,
    data: { form: { id, isActive: !isActive } },
    customApiPrefix: props.config?.customApiPrefix,
  })

  reFetchList()
}

const onUpdateItem = async (item) => {
  const response = await store.dispatch(updateActionName, {
    type: entityName,
    data: { form: item },
    customApiPrefix: props.config?.customApiPrefix,
  })

  reFetchList()

  return response
}

const onEditPosition = async ({ id }: { id: string }, position: number) => {
  await store.dispatch(updateActionName, {
    type: entityName,
    data: { form: { id, position } },
    customApiPrefix: props.config?.customApiPrefix,
  })

  reFetchList()
} */

// Search
/* watch(searchQuery, reFetchList) */

// Export

const setRequestFilters = () => {
  if (!ListFilterModel)
    return {}

  let filters = new ListFilterModel(props.config?.staticFilters)

  if (searchQuery.value)
    filters = new ListFilterModel({ ...props.config?.staticFilters, search: searchQuery.value })

  filters = appliedFilters.value.reduce(
    (acc, filter) => {
      const { key, trackBy = 'name' }: FilterListItem = props.config?.filterList.find(
        ({ type }: FilterListItem) => type === filter.key,
      )

      if (filter instanceof SelectBaseField) {
        acc[key] = filter.transformField({ trackBy, isStringDefaultValue: false })
      }
      else if (filter instanceof BaseField) {
        acc[key] = filter.transformField()
      }
      else if (filter.type === FieldType.Select) {
        acc[key] = filter.value?.[trackBy]
      }
      else if (filter.type === FieldType.MultiSelect) {
        acc[key] = filter.value.map((item: object) => item[trackBy])
      }
      else if (filter.type === FieldType.DateRange) {
        if (!filter.value || typeof filter.value !== 'string')
          return acc

        const [dateFrom, dateTo]: Array<string> = parseDateRange(filter.value)

        acc[`${key}From`] = dateFrom
        acc[`${key}To`] = dateTo
      }
      else if (filter.type === FieldType.SumRange) {
        if (filter.value?.some(value => isNotEmptyNumber(value) && !isEmptyString(value))) {
          const [sumFrom, sumTo]: Array<number> = filter.value

          acc[`${key}From`] = sumFrom
          acc[`${key}To`] = sumTo

          const invalidKeys = [`${key}From`, `${key}To`].filter(
            key => !isNotEmptyNumber(acc[key]),
          )

          acc = omit(acc, invalidKeys)
        }
      }
      else {
        acc[key] = filter.value
      }

      return acc
    },
    new ListFilterModel({
      ...props.config?.staticFilters,
      ...filters,
    }),
  )

  return filters
}

const onExportFormatSelected = async (format: string) => {
  const filter = setRequestFilters()
  const sort = sortData.sortBy ? [new ListSort(sortData)] : undefined

  const report: string = await store.dispatch(fetchReportActionName, {
    type: entityName,
    data: {
      filter: {
        ...filter,
        format,
      },
      perPage: total.value,
      sort,
    },
    customApiPrefix: props.config?.customApiPrefix,
  })

  const fakeLink: HTMLElement = document.createElement('a')

  fakeLink.setAttribute(
    'href',
    `data:${DownloadFormat[format]};charset=utf-8,${encodeURIComponent(report)}`,
  )
  fakeLink.setAttribute('target', '_blank')
  fakeLink.setAttribute('download', `${entityName}Report`)
  fakeLink.click()
}

// Filters
const { filters, selectedFilters, onChangeSelectedFilters } = useFilters(
  props.config.filterList,
)

const isFiltersShown = ref(false)

const appliedFilters = computed<Filter[]>(() => {
  const isSameEntity: boolean = entityName === store.getters['filtersCore/listEntityName']

  return isSameEntity ? store.getters['filtersCore/appliedListFilters'] : []
})

onMounted(() => {
  isFiltersShown.value = selectedFilters && selectedFilters.value.isNotEmpty
})

// Selectable
const selectedItems = ref([])

/* const allSelected = ref(false)
const indeterminate = ref(false) */

/* watch(selectedItems, newItems => {
  if (newItems.isEmpty) {
    indeterminate.value = false
    allSelected.value = false
  }
  else if (newItems.length === items.value.length) {
    indeterminate.value = false
    allSelected.value = true
  }
  else {
    indeterminate.value = true
    allSelected.value = false
  }
})

const onRowSelected = items => (selectedItems.value = items)

const onChangeSelected = (state: boolean, index: number) =>
  state ? refListTable.value.selectRow(index) : refListTable.value.unselectRow(index)

const toggleAll = (state: boolean) =>
  state ? refListTable.value.selectAllRows() : refListTable.value.clearSelected() */

// Multiple actions
/* const onClickToggleStatusMultiple = async (isActive: boolean) => {
  const data: Array<{ id: string; isActive: boolean }> = selectedItems.value.map(
      ({ id }: { id: string }) => ({
        id,
        isActive,
      })
  )

  await store.dispatch(multipleUpdateActionName, {
    type: entityName,
    data,
  })

  reFetchList()
}

const onClickDeleteMultiple = async () => {
  const ids: Array<string> = selectedItems.value.map(({ id }) => id)

  await store.dispatch(multipleDeleteActionName, {
    type: entityName,
    ids,
    customApiPrefix: props.config?.customApiPrefix,
  })

  reFetchList()
} */

// Draggable
const onDragChanged = async e => {
  if (!e)
    return

  const localItems: Array<any> = items.value
  const id = localItems[e.oldIndex].id
  const position: number = localItems[e.newIndex].position!

  if (!props.config?.withCustomDrag) {
    await store.dispatch(updateActionName, {
      type: entityName,
      data: { form: { id, position } },
      customApiPrefix: props.config?.customApiPrefix,
    })

    reFetchList()
  }

  emit('end', { itemId: id, newIndex: e.newIndex, oldIndex: e.oldIndex })
}

// Remove
const removeModalId = 'list-item-remove-modal'

const onClickRemove = item => {
  selectedItem.value = item
  if (beforeRemoveCallback) {
    const isAllowedRemove = beforeRemoveCallback(item)
    if (!isAllowedRemove)
      return
  }
  bvModal.show(removeModalId)
}

/* const onClickModalOk = async ({ hide, commentToRemove }) => {
  await store.dispatch(deleteActionName, {
    type: entityName,
    id: selectedItem.value.id,
    comment: commentToRemove,
    customApiPrefix: props.config?.customApiPrefix,
  })

  hide()
  reFetchList()
} */

const getIndexByItemFromList = item => findIndex(items.value || [], item)

const selectedItemIndex = computed(() => {
  if (!selectedItem.value)
    return NaN
  const itemIndex = getIndexByItemFromList(selectedItem.value)

  return itemIndex > -1 ? itemIndex : NaN
})

const selectedRowClass = rowItem => {
  const itemIndex = getIndexByItemFromList(rowItem)
  if (![selectedItemIndex.value, itemIndex].some(isNotEmptyNumber))
    return ''

  return selectedItemIndex.value === itemIndex
    ? `table-${rowItem?.rowVariant || 'default'}-bg`
    : ''
}
</script>

<template>
  <SideBar
    v-model:sidebar-active="isSidebarShown"
    :item="selectedItem"
    :entity-name="entityName"
    :side-bar-model="SideBarModel"
    :sidebar-collapse-mode="config?.sidebarCollapseMode"
    @remove="onClickRemove(selectedItem)"
    @hide="resetSelectedItem"
    @update:model-value="resetSelectedItem"
  >
    <template #sidebar-actions="{ form }">
      <slot
        name="sidebar-actions"
        :form="form"
        :item="selectedItem"
      />
    </template>

    <template #sidebar-action-items="{ form }">
      <slot
        name="sidebar-action-items"
        :form="form"
        :item="selectedItem"
      />
    </template>

    <template
      v-for="key in sidebarSlots"
      #[key]="{ item }"
    >
      <slot
        :name="key"
        :item="item"
      />
    </template>
  </SideBar>

  <ListSearch
    v-model="searchQuery"
    :right-search-btn="{
      canCreate: isShownCreateBtn,
      createPage: CreatePageName,
    }"
    :selected-filters="selectedFilters"
    :export-selector="{
      canShow: Boolean(config.withExport && canExport),
      disable: !total,
    }"
    :config="config"
    @on-click-filter="isFiltersShown = !isFiltersShown"
    @on-export-format-selected="onExportFormatSelected"
  >
    <template #right-search-btn>
      <slot name="right-search-btn" />
    </template>
    <template #left-search-btn>
      <slot name="left-search-btn" />
    </template>
  </ListSearch>

  <FiltersBlock
    v-if="config.filterList.isNotEmpty"
    :is-open="config.filterList.isNotEmpty && isFiltersShown"
    :entity-name="entityName"
    :filters="filters"
    @apply="reFetchList"
    @change-selected-filters="onChangeSelectedFilters"
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
    :tbody-tr-class="selectedRowClass"
    @end="onDragChanged"
    @row-selected="onRowSelected"
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
  <!--
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
  -->
  <div class="mx-2">
    <ListPagination
      v-if="config?.pagination"
      v-model="currentPage"
      :link-gen="linkGenerator"
      :pagination-config="paginationConfig"
      :data-meta="dataMeta"
    />
  </div>
</template>
