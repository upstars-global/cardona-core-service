<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, inject, onBeforeMount, ref, useSlots, watch } from 'vue'
import { useStore } from 'vuex'
import { useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { debounce, findIndex } from 'lodash'
import { BaseListSlots } from '../../../@model/templates/baseList'
import CTable from '../../CTable/index.vue'
import type { ExportFormat, IBaseListConfig } from '../../../@model/templates/baseList'
import type { PayloadFilters } from '../../../@model/filter'
import RemoveModal from '../../../components/BaseModal/RemoveModal.vue'
import { getStorage, removeStorageItem, setStorage } from '../../../helpers/storage'
import { ListSort, SortedItem } from '../../../@model'
import { useFilters } from '../../../components/FiltersBlock/useFilters'
import type { BaseField } from '../../../@model/templates/baseField'
import type { TableField } from '../../../@model/templates/tableFields'
import { ListFieldType } from '../../../@model/templates/tableFields'
import { basePermissions } from '../../../helpers/base-permissions'
import type { SortItem } from '../../../@core/types'
import { IconsList } from '../../../@model/enums/icons'
import {
  checkExistsPage,
  convertCamelCase,
  convertLowerCaseFirstSymbol, isEmptyString, isNullOrUndefinedValue,
} from '../../../helpers'
import useToastService from '../../../helpers/toasts'
import { VSizes } from '../../../@model/vuetify'
import SideBar from '../../../components/templates/SideBar/index.vue'
import FiltersBlock from '../../../components/FiltersBlock/index.vue'
import CopyField from '../../../components/templates/_components/CopyField.vue'
import StatementField from '../../../components/templates/_components/StatementField.vue'
import DateWithSecondsField from '../../../components/templates/_components/DateWithSecondsField.vue'
import SumAndCurrency from '../../../components/templates/_components/SumAndCurrency.vue'
import StatusField from '../../../components/templates/_components/StatusField.vue'
import usePagination from './сomposables/pagination'
import type { PaginationResult } from './сomposables/pagination'
import MultipleActions from './_components/MultipleActions.vue'
import ListSearch from './_components/ListSearch.vue'
import PillStatusField from './_components/fields/PillStatusField.vue'
import NameWithIdField from './_components/fields/NameWithIdField.vue'
import NameWithShortIdField from './_components/fields/NameWithShortIdField.vue'
import EmailField from './_components/fields/EmailField.vue'
import BadgesField from './_components/fields/BadgesField.vue'
import PositionField from './_components/fields/PositionField.vue'
import ButtonField from './_components/fields/ButtonField.vue'
import CommentField from './_components/fields/CommentField.vue'
import ImageField from './_components/fields/ImageField.vue'
import ImageDetailField from './_components/fields/ImageDetailField.vue'
import DatePeriodField from './_components/fields/DatePeriodField.vue'
import CopyShortField from './_components/fields/CopyShortField.vue'
import ItemActions from './_components/fields/ItemActions.vue'
import ListPagination from './_components/ListPagination.vue'
import TableFields from './_components/TableFields.vue'
import DateField from './_components/fields/DateField.vue'
import { mapSortData } from './сomposables/sorting'
import { downloadReport } from './сomposables/export'
import { transformFilters } from './сomposables/filters'

const props = defineProps<{
  config: IBaseListConfig
  useList: unknown
}>()

const emits = defineEmits<{
  rowClicked: [item: Record<string, unknown>]
  end: [item: Record<string, unknown>]
}>()

const { toastError } = useToastService()

const modal = inject('modal')
const slots = useSlots()

const store = useStore()
const { t } = useI18n()

const router = useRouter()
const route = useRoute()
const searchQuery = ref('')
const currentPageName = route.name?.toString()
const disableRowIds = ref<string[]>([])

const {
  entityName,
  fields,
  ListFilterModel,
  SideBarModel,
  pageName,
  canUpdateCb,
  canRemoveCb,
  beforeRemoveCallback,
  ListItemModel,
} = props.useList()

const parseEntityNameWithTabs = (entityName: string) => {
  // Removes the #tabName from entityName
  // Example: "Tournaments#tabName" -> "Tournaments"
  // This helps save different settings for the same entity across different tabs
  return entityName.replace(/#\w+/, '').replace('..', '.')
}

// Pages
const CreatePageName = pageName ? `${pageName}Create` : `${parseEntityNameWithTabs(entityName)}Create`
const UpdatePageName = pageName ? `${pageName}Update` : `${parseEntityNameWithTabs(entityName)}Update`
const DetailsPageName = pageName ? `${pageName}Card` : `${parseEntityNameWithTabs(entityName)}Card`

const isExistsCreatePage = checkExistsPage(CreatePageName)
const isExistsUpdatePage = checkExistsPage(UpdatePageName)
const isExistsDetailsPage = checkExistsPage(DetailsPageName)

// Action names
const moduleName = props.config?.customModuleName || convertLowerCaseFirstSymbol(entityName)

const fetchActionName: string = props.config?.withCustomFetchList
  ? `${moduleName}/fetchEntityList`
  : 'baseStoreCore/fetchEntityList'

const fetchReportActionName = 'baseStoreCore/fetchReport'
const updateActionName = 'baseStoreCore/updateEntity'
const toggleStatusActionName = 'baseStoreCore/toggleStatusEntity'

const deleteActionName = props.config?.withCustomDelete
  ? `${moduleName}/deleteEntity`
  : 'baseStoreCore/deleteEntity'

const multipleUpdateActionName = 'baseStoreCore/multipleUpdateEntity'
const multipleDeleteActionName = 'baseStoreCore/multipleDeleteEntity'

// Permissions
const { canCreate, canUpdate, canUpdateSeo, canRemove, canExport }
  = basePermissions<IBaseListConfig>({ entityName, config: props.config })

const isShownCreateBtn = !!props.config?.withCreateBtn && isExistsCreatePage && canCreate

const canUpdateItem = (item): boolean =>
  canUpdateCb && item ? isExistsUpdatePage && canUpdateCb(item) : isExistsUpdatePage

const canRemoveItem = (item): boolean =>
  canRemoveCb && item ? canRemove && canRemoveCb(item) : canRemove

const canDraggable = computed(() => { return props.config.small ? canUpdate && props.config.draggable && !searchQuery.value : canUpdate && props.config.draggable })

// Sidebar
const isSidebarShown = ref(false)
const selectedItem: any = ref(null)

const getIndexByItemFromList = item => findIndex(items.value, item)

const sidebarSlots = computed(() =>
  Object.keys(slots).filter(
    key => key.includes('sidebar-row') || key.includes('sidebar-value'),
  ),
)

const resetSelectedItem = () => {
  selectedItem.value = null
  isSidebarShown.value = false
}

const onClickRow = async data => {
  emits('rowClicked', data)
  if (!props.config?.sidebar)
    return
  if (props.config?.cbShowSidebar) {
    await props.config?.cbShowSidebar(selectedItem, isSidebarShown, {
      itemList: data,
      index: getIndexByItemFromList(data),
    })
  }
  else {
    isSidebarShown.value = true
    selectedItem.value = data
  }
}

const routerToUpdatePageId = item => {
  router.push(getUpdateRoute(item))
}

// Table
const items = ref([])
const isInitialState = ref(true)

watch(
  () => items.value,
  () => {
    if (selectedItem.value)
      selectedItem.value = items.value[getIndexByItemFromList(selectedItem.value)]
  },
  { deep: true },
)

const selectedFields = ref<TableField[]>([...fields])

const isLoadingList = computed(() => {
  if (isInitialState.value || isDebouncedSearch.value)
    return true
  const indexSymbolNextDash = entityName.indexOf('-') + 1

  const entityNameForLoad = entityName.replace(
    entityName[indexSymbolNextDash],
    entityName[indexSymbolNextDash].toLowerCase(),
  )

  const entityUrl: string = parseEntityNameWithTabs(convertCamelCase(entityNameForLoad, '/'))

  const listUrl = `${entityUrl}/list`

  return props.config.loadingOnlyByList
    ? store.getters.isLoadingEndpoint([
      listUrl,
      ...props.config.loadingEndpointArr!,
    ])
    : store.getters.isLoadingEndpoint([
      listUrl,
      `${entityUrl}/update`,
      `${entityUrl}/active/switch`,
      `${entityUrl}/delete`,
      ...props.config.loadingEndpointArr!,
    ])
})

const size = props.config?.small ? VSizes.Small : VSizes.Medium

const emptyListText = computed(() => searchQuery.value || hasSelectedFilters.value ? t('emptyState.emptyRequest') : props.config.emptyText)

// Sort
const sortStorageKey = `${currentPageName}-${entityName}-sort`
const sortFromStorage: SortItem = getStorage(sortStorageKey, SortedItem) as SortItem

const sortBy = sortFromStorage?.key || props.config.staticSorts?.key
const sortDir = sortFromStorage?.order || props.config.staticSorts?.order
const sortData = ref(sortBy && sortDir ? [{ key: sortBy, order: sortDir }] as SortItem[] : [])

watch(() => sortData.value, async ([newSortData]) => {
  newSortData
    ? setStorage(sortStorageKey, newSortData)
    : removeStorageItem(sortStorageKey)
  await getList()
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
  perPageOptions,
  total,
  setPerPage,
  setPage,
  setupDataMeta,
  linkGen,
  updateTotal,
  onChangePagination,
} = paginationConfig

const itemsPerPage = computed(() => props.config?.pagination ? perPage.value : items.value.length)

const dataMeta = computed(() => setupDataMeta(items.value.length))

const linkGenerator = (page: number) => {
  if (props.config?.withIndependentPagination)
    return

  return linkGen(page)
}

// Fetch list
const getList = async () => {
  isDebouncedSearch.value = false

  const filter = setRequestFilters()
  const sort = mapSortData(sortData.value)

  const { list, total } = await store.dispatch(fetchActionName, {
    type: parseEntityNameWithTabs(entityName),
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

  selectedItems.value = []

  return list
}

const reFetchList = () => getList()

onChangePagination(() => {
  if (props.config.closeFilterOnPagination)
    isFiltersShown.value = false
  reFetchList()
})

const checkSlotExistence = (slotName: string): boolean => !!slots[slotName]

const getUpdateRoute = ({ id }): Location => {
  return isExistsUpdatePage && (canUpdateCb?.() ?? true)
    ? { name: UpdatePageName, params: { id } }
    : {}
}

const getDetailsRoute = ({ id }): Location => {
  return isExistsDetailsPage ? { name: DetailsPageName, params: { id } } : {}
}

const onClickToggleStatus = async ({ id, isActive, type = '' }) => {
  const actionName = props.config.withDeactivationBySpecificAction
    ? toggleStatusActionName
    : updateActionName

  await store.dispatch(actionName, {
    type: entityName,
    data: { form: { id, isActive: !isActive, type } },
    customApiPrefix: props.config?.customApiPrefix,
  })

  reFetchList()
}

const onEditPosition = async ({ id }: { id: string }, position: number) => {
  await store.dispatch(updateActionName, {
    type: entityName,
    data: { form: { id, position } },
    customApiPrefix: props.config?.customApiPrefix,
  })

  await reFetchList()
}

// Search
const debouncedSearch = debounce(reFetchList, 300)
const isDebouncedSearch = ref(false)

watch(() => searchQuery.value, () => {
  isDebouncedSearch.value = true
  debouncedSearch()
})

// Export

const setRequestFilters = (): PayloadFilters => {
  if (!ListFilterModel)
    return {}

  const appliedFiltersData = transformFilters(appliedFilters.value, props.config)

  const filtersData = new ListFilterModel({
    ...props.config?.staticFilters,
    search: searchQuery.value,
    ...appliedFiltersData,
  })

  for (const key in filtersData) {
    const isEmptyValue
      = isNullOrUndefinedValue(filtersData[key]) || isEmptyString(filtersData[key])

    const isEmptyArray = Array.isArray(filtersData[key]) && filtersData[key].isEmpty

    if (isEmptyValue || isEmptyArray)
      delete filtersData[key]
  }

  return filtersData
}

const onExportFormatSelected = async (format: ExportFormat) => {
  if (props.config?.maxExportItems && props.config?.maxExportItems < total.value) {
    toastError('maxLimitForExport', { quantity: props.config.maxExportItems })

    return
  }

  const filter = setRequestFilters()
  const sort = sortData.value.isNotEmpty ? [new ListSort({ sortBy: sortData.value[0].key, sortDesc: sortData.value[0].order })] : undefined

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

  downloadReport(report, entityName, format)
}

// Filters
const { filters, selectedFilters, onChangeSelectedFilters } = useFilters(
  props.config?.filterList,
)

const isFiltersShown = useStorage(`show-filter-list-${entityName || pageName}`, false)
const isOpenFilterBlock = computed(() => props.config.filterList?.isNotEmpty && isFiltersShown.value)

const appliedFilters = computed<BaseField[]>(() => {
  const isSameEntity: boolean = entityName === store.getters['filtersCore/listEntityName']

  return isSameEntity ? store.getters['filtersCore/appliedListFilters'] : []
})

const hasSelectedFilters = computed(() => selectedFilters && selectedFilters.value.isNotEmpty)

watch(() => hasSelectedFilters.value, hasFilters => {
  if (hasFilters)
    isFiltersShown.value = hasFilters
}, { immediate: true })

// Selectable
const selectedItems = ref<Record<string, unknown>[]>([])

const allSelected = ref(false)
const indeterminate = ref(false)

watch(selectedItems, newItems => {
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

// Multiple actions
const onClickToggleStatusMultiple = async (isActive: boolean) => {
  const data: Array<{ id: string; isActive: boolean }> = selectedItems.value.map(
    ({ id }: { id: string }) => ({
      id,
      isActive,
    }),
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
}

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

  emits('end', {
    itemId: id,
    newIndex: e.newIndex,
    oldIndex: e.oldIndex,
    page: currentPage.value,
    perPage: perPage.value,
  })
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

  modal.showModal(removeModalId)
}

const onClickModalOk = async ({ hide, commentToRemove }) => {
  hide()
  await store.dispatch(deleteActionName, {
    type: entityName,
    id: selectedItem.value.id,
    comment: commentToRemove,
    customApiPrefix: props.config?.customApiPrefix,
  })

  selectedItems.value = selectedItems.value.filter(item => item?.id !== selectedItem.value.id)
  resetSelectedItem()
  await reFetchList()
}

onBeforeMount(async () => {
  await getList()
  isInitialState.value = false
})

const editingId = ref<string | null>(null)

const onOpenEdit = (id: string) => editingId.value = id

defineExpose({ reFetchList, resetSelectedItem, selectedItems, disableRowIds, sortData, items, isSidebarShown, searchQuery })
</script>

<template>
  <div class="d-flex flex-column">
    <RemoveModal
      :config="config"
      :remove-modal-id="removeModalId"
      :entity-name="entityName"
      @on-click-modal-ok="onClickModalOk"
    />
    <slot
      :name="BaseListSlots.TableHeader"
      :selected-items="selectedItems"
      :total="total"
      :search="searchQuery"
    />

    <SideBar
      v-if="config.sidebar"
      v-model:sidebar-active="isSidebarShown"
      :item="selectedItem"
      :entity-name="entityName"
      :side-bar-model="SideBarModel"
      :can-update="canUpdate"
      :can-update-item="canUpdateItem(selectedItem)"
      :can-remove-item="canRemoveItem(selectedItem)"
      :sidebar-collapse-mode="config?.sidebarCollapseMode"
      @remove="onClickRemove(selectedItem)"
      @hide="resetSelectedItem"
      @update="routerToUpdatePageId(selectedItem)"
    >
      <template #sidebar-actions="{ form }">
        <slot
          :name="BaseListSlots.SidebarActions"
          :form="form"
          :item="selectedItem"
        />
      </template>

      <template #sidebar-action-items="{ form }">
        <slot
          :name="BaseListSlots.SidebarActionItems"
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
      v-if="!config.hideSearchBlock"
      v-model.trim="searchQuery"
      class="pb-6 list-search"
      :right-search-btn="{
        canCreate: isShownCreateBtn,
        createPage: CreatePageName,
      }"
      :selected-filters="selectedFilters"
      :export-selector="{
        canShow: !!(config.withExport && canExport),
        disable: !total,
      }"
      :config="config"
      :is-open-filter-block="isOpenFilterBlock"
      @on-click-filter="isFiltersShown = !isFiltersShown"
      @on-export-format-selected="onExportFormatSelected"
    >
      <template #right-search-btn>
        <slot
          :name="BaseListSlots.RightSearchBtn"
          :can-create="canCreate"
          :can-update="canUpdate"
          :create-page-name="CreatePageName"
        />
      </template>
      <template #left-search-btn>
        <slot :name="BaseListSlots.LeftSearchBtn" />
      </template>
    </ListSearch>

    <FiltersBlock
      v-if="config.filterList?.isNotEmpty"
      :is-open="isOpenFilterBlock"
      :entity-name="entityName"
      :filters="filters"
      :size="size"
      @apply="reFetchList"
      @change-selected-filters="onChangeSelectedFilters"
    />

    <slot :name="BaseListSlots.CustomFilter" />

    <VCard class="table-card-settings">
      <div
        v-if="config.withSettings && (!canUpdate || selectedItems.isEmpty)"
        class="table-settings align-center"
        :class="config?.pagination ? 'justify-space-between' : 'justify-end'"
      >
        <!-- Table per page select -->
        <div
          v-if="config?.pagination"
          class="d-flex gap-3 align-center justify-content-start"
        >
          <span>
            {{ $t('common.show') }}
          </span>

          <VueSelect
            :model-value="perPage"
            :options="perPageOptions"
            class="per-page-selector d-inline-block"
            :dir="store.getters['appConfigCore/dirOption']"
            :searchable="false"
            :clearable="false"
            @update:model-value="setPerPage"
          >
            <template #open-indicator="{ attributes }">
              <VIcon
                v-bind="attributes"
                :icon="IconsList.ChevronDownIcon"
              />
            </template>
          </VueSelect>
        </div>

        <!-- Table field settings -->
        <div class="d-flex align-center justify-end">
          <slot :name="BaseListSlots.TableFieldSetting" />

          <TableFields
            v-model="selectedFields"
            :entity-name="pageName || entityName"
            :list="fields"
          />
        </div>
      </div>
      <MultipleActions
        v-else-if="config.withMultipleActions && selectedItems.isNotEmpty"
        :number-selected-items="selectedItems.length"
        :can-remove="canRemove"
        @on-activate="onClickToggleStatusMultiple(true)"
        @on-deactivate="onClickToggleStatusMultiple(false)"
        @on-remove="onClickDeleteMultiple"
      >
        <slot
          :name="BaseListSlots.MultipleActions"
          :selected-items="selectedItems"
          :can-update="canUpdate"
        />
      </MultipleActions>

      <CTable
        v-model:sort-data="sortData"
        :is-loading-list="isLoadingList"
        :fields="selectedFields"
        :rows="items"
        :select-mode="config.selectMode"
        :selectable="config.selectable"
        :small="config.small"
        :draggable="canDraggable"
        :hover="config.hover"
        :skeleton-rows="config.skeletonRows"
        :skeleton-cols="config.skeletonCols"
        :selected-items="selectedItems"
        :items-per-page="itemsPerPage"
        :disabled-row-ids="disableRowIds"
        @end="onDragChanged"
        @row-selected="onRowSelected"
        @row-clicked="onClickRow"
      >
        <template
          v-for="(fieldItem, index) in selectedFields"
          :key="`base-list_cell-${fieldItem.key}`"
          #[`cell(${fieldItem.key})`]="{ field, item, cell }"
        >
          <slot
            v-if="checkSlotExistence(`cell(${fieldItem.key})`)"
            :name="`cell(${fieldItem.key})`"
            :field="field"
            :item="item.raw"
            :cell="cell"
            :value="item.value"
            :get-update-route="getUpdateRoute"
            :index="getIndexByItemFromList(item.value)"
            @click.stop
          />
          <StatusField
            v-else-if="field.type === ListFieldType.Status"
            :key="`${index}_${field.type}`"
            :value="cell"
          />

          <SumAndCurrency
            v-else-if="field.type === ListFieldType.SumAndCurrency"
            :key="`${index}_${field.type}`"
            :align="field.align"
            :data="{
              amount: cell,
              currency: item.raw.currency,
              remainder: item.raw.remainder,
            }"
          />

          <PillStatusField
            v-else-if="field.type === ListFieldType.PillStatus"
            :key="`${index}_${field.type}`"
            :is-active="cell"
          />

          <NameWithIdField
            v-else-if="field.type === ListFieldType.NameWithId"
            :key="`${index}_${field.type}`"
            :item="item.raw"
            :get-update-route="getUpdateRoute"
            :get-details-route="getDetailsRoute"
            :is-show-you="config.isShowYou"
          >
            <slot
              :name="`${field.key}-nameWithIdTitle`"
              :item="item.raw"
              :can-update="canUpdate"
            />
          </NameWithIdField>

          <NameWithShortIdField
            v-else-if="field.type === ListFieldType.NameWithShortId"
            :key="`${index}_${field.type}`"
            :item="item.raw"
            :get-update-route="getUpdateRoute"
            :get-details-route="getDetailsRoute"
            :is-show-you="config.isShowYou"
          >
            <slot
              :name="`${field.key}-nameWithIdTitle`"
              :item="item.raw"
            />
          </NameWithShortIdField>

          <EmailField
            v-else-if="field.type === ListFieldType.Email"
            :key="`${index}_${field.type}`"
            :item="item.raw"
            :get-update-route="getUpdateRoute"
          />

          <DateField
            v-else-if="field.type === ListFieldType.Date"
            :key="`${index}_${field.type}`"
            :date="cell"
          />

          <DateWithSecondsField
            v-else-if="field.type === ListFieldType.DateWithSeconds"
            :key="`${index}_${field.type}`"
            :date="cell"
          />

          <StatementField
            v-else-if="field.type === ListFieldType.Statement"
            :key="`${index}_${field.type}`"
            :state="cell"
          />

          <BadgesField
            v-else-if="field.type === ListFieldType.Badges"
            :key="`${index}_${field.type}`"
            :list-badges="cell"
          >
            <template #default="{ value }">
              <slot
                :name="`${field.key}-badgeTitle`"
                :item="item.raw"
                :cell="cell"
                :value="value"
              />
            </template>
          </BadgesField>

          <PositionField
            v-else-if="field.type === ListFieldType.Priority"
            :id="item.raw.id"
            :key="item.raw.id"
            :position="cell"
            :size="field.size"
            :can-update="canUpdate"
            :editing-id="editingId"
            @edit-position="(val) => onEditPosition(item.raw, val)"
            @open-edit="onOpenEdit(item.raw.id)"
          />

          <ButtonField
            v-else-if="field.type === ListFieldType.Button"
            :key="`${index}_${field.type}`"
            :btn-name="cell"
          />

          <CommentField
            v-else-if="field.type === ListFieldType.Comment"
            :key="`${index}_${field.type}`"
            :value="cell"
          />

          <ImageField
            v-else-if="field.type === ListFieldType.Image"
            :key="`${index}_${field.type}`"
            :image-path="cell"
            :size="field.size"
          />

          <ImageDetailField
            v-else-if="field.type === ListFieldType.ImageFull"
            :id="item.raw.id"
            :key="`${index}_${field.type}`"
            :image-path="item.raw[field.key]?.imagePath"
            :size="field.size"
            :compression-for-preview="item.raw[field.key]?.compressionForPreview || 0"
          />

          <DatePeriodField
            v-else-if="field.type === ListFieldType.Period"
            :key="`${index}_${field.type}`"
            :period="cell"
          />

          <CopyField
            v-else-if="field.type === ListFieldType.Copy"
            :key="`${index}_${field.type}`"
            :value="cell"
          />

          <CopyShortField
            v-else-if="field.type === ListFieldType.CopyShort"
            :key="`${index}_${field.type}`"
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
            :key="item.raw"
            :item="item.raw"
            :create-page-name="CreatePageName"
            :details-page-name="DetailsPageName"
            :can-update="canUpdate"
            :can-create="canCreate"
            :can-update-seo="canUpdateSeo"
            :can-update-item="canUpdateItem(item.raw)"
            :can-remove-item="canRemoveItem(item.raw)"
            :config="config"
            :get-update-route="getUpdateRoute"
            @on-remove="onClickRemove"
            @on-toggle-status="onClickToggleStatus"
          >
            <template
              v-if="checkSlotExistence(BaseListSlots.PrependActionItem)"
              #[BaseListSlots.PrependActionItem]
            >
              <slot
                :name="BaseListSlots.PrependActionItem"
                :item="item"
                :can-update="canUpdate"
              />
            </template>

            <template #[BaseListSlots.DetailsActionItem]>
              <slot
                :name="BaseListSlots.DetailsActionItem"
                :item="item"
                :page-name="DetailsPageName"
              />
            </template>

            <template
              v-if="checkSlotExistence(BaseListSlots.AppendActionItem)"
              #[BaseListSlots.AppendActionItem]
            >
              <slot
                :name="BaseListSlots.AppendActionItem"
                :item="item"
                :can-update="canUpdate"
                :can-create="canCreate"
              />
            </template>
          </ItemActions>
        </template>

        <template #empty>
          <div class="d-flex flex-column justify-center align-center p-2 text-color-mute empty-state-wrapper">
            <slot :name="BaseListSlots.Empty">
              <span>
                {{ emptyListText }}
              </span>
            </slot>
          </div>
        </template>
      </CTable>
    </VCard>
    <div
      v-if="items.isNotEmpty"
      :class="config.small ? 'pt-4' : 'pt-8'"
    >
      <ListPagination
        v-if="config?.pagination"
        data-test-id="list-pagination"
        :model-value="currentPage"
        :link-gen="linkGenerator"
        :pagination-config="paginationConfig"
        :data-meta="dataMeta"
        :small="config.small"
        @update:model-value="setPage"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table-card-settings {
  :deep(.table-settings) {
    display: flex;
    padding: 0.5rem 1.5rem;

    .per-page-selector {
      min-width: 6rem;
    }
  }
}

:deep(.c-table) {
  .default-cell-value {
    max-width: 320px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  tr {
    td[data-c-field='actions'] {
      width: 3.5rem;
    }

    td[data-c-field="email"] {
      padding: 0 !important;
    }
  }
}

.empty-state-wrapper {
  height: 5.2rem;
}
</style>
