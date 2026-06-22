<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, inject, onBeforeMount, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'
import { useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { debounce, findIndex, has, isUndefined } from 'lodash'
import type { ExportFormat, IBaseListConfig, ProjectsFilterOption } from '../../../../@model/templates/baseList'
import { BaseListSlots, ProjectsFilterMode } from '../../../../@model/templates/baseList'
import CTable from '../../../CTable/index.vue'
import type { PayloadFilters } from '../../../../@model/filter'
import RemoveModal from '../../../../components/BaseModal/RemoveModal.vue'
import { getStorage, removeStorageItem, setStorage } from '../../../../helpers/storage'
import { ListSort, SortedItem } from '../../../../@model'
import { useFilters } from '../../../../components/FiltersBlock/useFilters'
import type { BaseField } from '../../../../@model/templates/baseField'
import type { TableField } from '../../../../@model/templates/tableFields'
import { basePermissions } from '../../../../helpers/base-permissions'
import type { SortItem } from '../../../../@core/types'
import { IconsList } from '../../../../@model/enums/icons'
import {
  checkExistsPage,
  convertCamelCase,
  isEmptyString,
  isNullOrUndefinedValue,
} from '../../../../helpers'
import { VSizes } from '../../../../@model/vuetify'
import SideBar from '../../../../components/templates/SideBar/index.vue'
import FiltersBlock from '../../../../components/FiltersBlock/index.vue'
import { useLoaderStore } from '../../../../stores/loader'
import { useBaseStoreCore } from '../../../../stores/baseStoreCore'
import { useUserStore } from '../../../../stores/user'
import { useAppConfigCoreStore } from '../../../../stores/appConfigCore'
import { useFiltersStore } from '../../../../stores/filtersCore'
import { useBaseListSelection } from '../../../../stores/baseListSelection'
import usePagination from '../сomposables/pagination'
import type { PaginationResult } from '../сomposables/pagination'
import MultipleActions from '../_components/MultipleActions.vue'
import ListSearch from '../_components/ListSearch.vue'
import ListPagination from '../_components/ListPagination.vue'
import TableFields from '../_components/TableFields.vue'
import ProjectsFilter from '../_components/ProjectsFilter.vue'
import { mapSortData } from '../сomposables/sorting'
import { transformFilters } from '../сomposables/filters'
import { useInlineFilters } from '../сomposables/inlineFilters'
import InlineFilters from '../_components/InlineFilters.vue'
import ImageDetailModal from '../_components/ImageDetailModal.vue'
import { ModalsId } from '../../../../@model/modalsId'
import BaseListCell from '../_components/BaseListCell.vue'

defineOptions({
  name: 'DefaultBaseList',
})

const props = defineProps<{
  config: IBaseListConfig
  useList: unknown
}>()

const emits = defineEmits<{
  mounted: []
  rowClicked: [item: Record<string, unknown>]
  end: [item: Record<string, unknown>]
}>()

const modal = inject('modal')
const slots = useSlots()

const baseStoreCore = useBaseStoreCore()
const appConfigCoreStore = useAppConfigCoreStore()
const userStore = useUserStore()
const loaderStore = useLoaderStore()
const filtersCoreStore = useFiltersStore()
const baseListSelectionStore = useBaseListSelection()
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
  canCopyCb,
  beforeRemoveCallback,
  ListItemModel,
  useStore,
} = props.useList()

const customStore: ReturnType<typeof useBaseStoreCore> = useStore ? useStore() : null

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

// Actions
const fetchAction: CallableFunction = customStore?.fetchEntityList
  ? customStore.fetchEntityList
  : baseStoreCore.fetchEntityList

const deleteAction = customStore?.deleteEntity
  ? customStore.deleteEntity
  : baseStoreCore.deleteEntity

const multipleDeleteAction = customStore?.multipleDeleteEntity
  ? customStore.multipleDeleteEntity
  : baseStoreCore.multipleDeleteEntity

const fetchReportAction = customStore?.fetchReport
  ? customStore.fetchReport
  : baseStoreCore.fetchReport

// Permissions
const { canCreate, canUpdate, canUpdateSeo, canRemove, canExport }
  = basePermissions<IBaseListConfig>({ entityName, config: props.config })

const isShownCreateBtn = !!props.config?.withCreateBtn && isExistsCreatePage && canCreate

const canUpdateItem = (item): boolean =>
  canUpdateCb && item ? isExistsUpdatePage && canUpdateCb(item) : isExistsUpdatePage

const canRemoveItem = (item): boolean =>
  canRemoveCb && item ? canRemove && canRemoveCb(item) : canRemove

const canCopyItem = (item): boolean =>
  canCopyCb && item ? canCopyCb(item) : true

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
      entityName,
      inlineFilters: inlineFilters.value,
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

const normalizedEntityName = computed(() => {
  return entityName.replace(/-(.)/g, (_, char) => `-${char.toLowerCase()}`)
})

const entityUrl = computed(() => {
  return parseEntityNameWithTabs(convertCamelCase(normalizedEntityName.value, '/'))
})

const isLoadingExport = computed(() => {
  const listUrl = `${entityUrl.value}/list/report`

  return loaderStore.isLoadingEndpoint([listUrl])
})

const isLoadingList = computed(() => {
  if (props.config.disableLoading)
    return false

  if (isInitialState.value || isDebouncedSearch.value)
    return true

  const listUrl = `${entityUrl.value}/list`

  if (props.config.loadingOnlyByList) {
    return loaderStore.isLoadingEndpoint([
      listUrl,
      ...(props.config.loadingEndpointArr ?? []),
    ])
  }

  return loaderStore.isLoadingEndpoint([
    listUrl,
    `${entityUrl.value}/update`,
    `${entityUrl.value}/active/switch`,
    `${entityUrl.value}/delete`,
    ...(props.config.loadingEndpointArr ?? []),
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
  if (props.config.saveSort) {
    newSortData
      ? setStorage(sortStorageKey, newSortData)
      : removeStorageItem(sortStorageKey)
  }
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

const combineFilter = (
  filters: Record<string, any> = {},
  projectAlias?: string,
): Record<string, any> | undefined => {
  const existProjectInPath = route.path?.includes(`/${projectAlias}/`)
  const exitsProjectParam = has(filters, 'project') && filters.project

  if (existProjectInPath && !exitsProjectParam)
    filters.project = projectAlias

  return Object.values(filters).some(v => !isUndefined(v)) ? filters : undefined
}

// Fetch list
const getList = async () => {
  isDebouncedSearch.value = false

  const filter = setRequestFilters()
  const sort = mapSortData(sortData.value)

  const actualPerPage = !props.config.pagination && props.config.defaultPerPage
    ? props.config.defaultPerPage
    : perPage.value

  const { list, total } = await fetchAction({
    type: parseEntityNameWithTabs(entityName),
    data: {
      perPage: actualPerPage,
      page: currentPage.value,
      filter,
      sort,
    },
    options: {
      listItemModel: ListItemModel,
      customApiPrefix: props.config?.customApiPrefix,
      cancelPrevious: props.config?.cancelPreviousRequest,
    },
  })

  items.value = list
  updateTotal(total)

  isInitialState.value = false

  selectedItems.value = list.filter(item => allSelectedIds.value?.has(item.id))

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

const onClickToggleStatus = async ({ id, isActive }) => {
  const actionToggleStatus = props.config.withDeactivationBySpecificAction
    ? baseStoreCore.toggleStatusEntity
    : baseStoreCore.updateEntity

  await actionToggleStatus({
    type: entityName,
    data: { form: { id, isActive: !isActive } },
    customApiPrefix: props.config?.customApiPrefix,
  })

  reFetchList()
}

const onEditPosition = async ({ id }: { id: string }, position: number) => {
  await baseStoreCore.updateEntity({
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
    return combineFilter({}, userStore.getSelectedProject?.alias)

  const appliedFiltersData = transformFilters(appliedFilters.value, props.config)

  const projectFilterFiledParams = props.config.withProjectsFilter ? { projects: projectsFilter.value } : {}

  const filtersData = new ListFilterModel({
    ...props.config?.staticFilters,
    search: searchQuery.value,
    ...appliedFiltersData,
    ...projectFilterFiledParams,
    ...inlineFilters.value,
  })

  for (const key in filtersData) {
    const isEmptyValue
      = isNullOrUndefinedValue(filtersData[key]) || isEmptyString(filtersData[key])

    const isEmptyArray = Array.isArray(filtersData[key]) && filtersData[key].isEmpty

    if (isEmptyValue || isEmptyArray)
      delete filtersData[key]
  }

  return combineFilter(filtersData, userStore.getSelectedProject?.alias)
}

const onExportFormatSelected = async (format: ExportFormat) => {
  const filter = setRequestFilters()
  const sort = sortData.value.isNotEmpty ? [new ListSort({ sortBy: sortData.value[0].key, sortDesc: sortData.value[0].order })] : undefined

  await fetchReportAction({
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
}

// Projects filters
const userProjects = computed<ProjectsFilterOption[]>(() => appConfigCoreStore.verifiedProjects.map(({ id, alias, name }) => ({
  id,
  alias,
  title: name,
})))

const projectsFilter = ref<string[]>([userStore.getSelectedProject?.alias])

// Filters
const { filters, selectedFilters, onChangeSelectedFilters } = useFilters(
  props.config?.filterList,
)

props.config?.filterList?.forEach((config, index) => {
  if (config.defaultValue !== undefined && filters.value[index])
    filters.value[index].value = config.defaultValue
})

const defaultSelectedFilters = computed(() =>
  filters.value.filter((_, index) => props.config?.filterList?.[index]?.defaultValue !== undefined),
)

const { inlineFilters, filterFields, onFieldUpdate } = useInlineFilters(props.config?.inlineFilters, reFetchList)

const isFiltersShown = useStorage(`show-filter-list-${entityName || pageName}`, false)
const isOpenFilterBlock = computed(() => props.config.filterList?.isNotEmpty && isFiltersShown.value)

watch(() => userStore.getSelectedProject?.alias, (_newAlias, oldAlias) => {
  if (!oldAlias)
    return

  filtersCoreStore.setListFilters([])
  filtersCoreStore.setListEntityName()
  filtersCoreStore.setListPath()
  onChangeSelectedFilters([])
  filtersBlockRef.value?.clearFilters()
})

const appliedFilters = computed<BaseField[]>(() => {
  const isSameEntity: boolean = entityName === filtersCoreStore.listEntityName

  return isSameEntity ? filtersCoreStore.appliedListFilters : []
})

const hasSelectedFilters = computed(() => selectedFilters && selectedFilters.value.isNotEmpty)

watch(() => hasSelectedFilters.value, hasFilters => {
  if (hasFilters)
    isFiltersShown.value = hasFilters
}, { immediate: true })

// Selectable
const selectedItems = ref<Record<string, unknown>[]>([])
const allSelectedIds = computed(() => baseListSelectionStore.getAllSelectedIds(entityName))

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

const onRowSelected = checkedItems => {
  selectedItems.value = checkedItems

  const allItemsIds = items.value.map(({ id }) => id)
  const selectedItemsIds = checkedItems.map(({ id }) => id)

  baseListSelectionStore.syncPageSelection(entityName, allItemsIds, selectedItemsIds)
}

// Multiple actions
const onClickToggleStatusMultiple = async (isActive: boolean) => {
  const data: Array<{ id: string; isActive: boolean }> = [...allSelectedIds.value].map(
    id => ({
      id,
      isActive,
    }),
  )

  await baseStoreCore.multipleUpdateEntity({
    type: entityName,
    data,
  })

  reFetchList()
}

const onClickDeleteMultiple = async () => {
  const ids: Array<string> = [...allSelectedIds.value]
  const isOneMoreId = ids.length > 1

  const action: CallableFunction = isOneMoreId ? multipleDeleteAction : deleteAction
  const params = isOneMoreId ? { ids } : { id: ids[0] }

  await action({
    type: entityName,
    ...params,
    customApiPrefix: props.config?.customApiPrefix,
  })

  baseListSelectionStore.clearSelectedIds(entityName)

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
    await baseStoreCore.updateEntity({
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

  await deleteAction({
    type: entityName,
    id: selectedItem.value.id,
    comment: commentToRemove,
    customApiPrefix: props.config?.customApiPrefix,
    inlineFilters: inlineFilters.value,
  })

  selectedItems.value = selectedItems.value.filter(item => item?.id !== selectedItem.value.id)

  const allItemsIds = items.value.map(({ id }) => id)
  const selectedItemsIds = selectedItems.value.map(({ id }) => id)

  baseListSelectionStore.syncPageSelection(entityName, allItemsIds, selectedItemsIds)

  resetSelectedItem()
  await reFetchList()
}

const initDefaultFilters = () => {
  const isSameEntity = entityName === filtersCoreStore.listEntityName
  const isSamePath = route.path === filtersCoreStore.listPath
  if (defaultSelectedFilters.value.length && (!isSameEntity || !isSamePath)) {
    filtersCoreStore.setListEntityName(entityName)
    filtersCoreStore.setListPath(route.path)
    filtersCoreStore.setListFilters(defaultSelectedFilters.value as BaseField[])
  }
}

onBeforeMount(async () => {
  if (props.config.withProjectsFilter)
    projectsFilter.value = props.config.projectsFilterMode === ProjectsFilterMode.All ? userProjects.value.map(project => project.alias) : [userStore.getSelectedProject?.alias]

  initDefaultFilters()

  await getList()

  isInitialState.value = false
})

const editingId = ref<string | null>(null)

const onOpenEdit = (id: string) => editingId.value = id

onMounted(() => {
  emits('mounted')
})

onBeforeUnmount(() => {
  baseListSelectionStore.clearSelectedIds(entityName)
})

const filtersBlockRef = ref(null)

const showDetailImage = (imagePath: string) => {
  modal.showModal(ModalsId.ImageDetailModal, { imagePath })
}

defineExpose({ reFetchList, resetSelectedItem, selectedItems, disableRowIds, sortData, items, isSidebarShown, searchQuery })
</script>

<template>
  <div
    class="d-flex flex-column default__base-list"
    data-test-id="default-base-list"
  >
    <ImageDetailModal />
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
      :entity-name="entityName"
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
          :can-remove="canRemove"
          :inline-filters="inlineFilters"
          :on-click-remove="onClickRemove"
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
      :is-loading-export="isLoadingExport"
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
          :inline-filters
        />
      </template>
      <template #left-search-btn>
        <div
          v-if="config.inlineFilters?.isNotEmpty"
          class="w-auto d-flex align-center justify-content-start"
          :class="{
            'w-auto': config.withSearch,
            'w-100': !config.withSearch,
          }"
        >
          <InlineFilters
            :filter-fields="filterFields"
            @change="onFieldUpdate"
          />
        </div>
        <slot :name="BaseListSlots.LeftSearchBtn" />
      </template>
    </ListSearch>

    <ProjectsFilter
      v-if="config.withProjectsFilter"
      v-model="projectsFilter"
      :projects="userProjects"
      class="mb-6"
      @update:model-value="reFetchList"
    />

    <FiltersBlock
      v-if="config.filterList?.isNotEmpty"
      ref="filtersBlockRef"
      :is-open="isOpenFilterBlock"
      :entity-name="entityName"
      :filters="filters"
      :size="size"
      :default-selected-filters="defaultSelectedFilters"
      @apply="reFetchList"
      @change-selected-filters="onChangeSelectedFilters"
    >
      <template
        v-for="filter in filters"
        :key="`filter-field-${filter.key}`"
        #[`filter(${filter.key})`]="{ selectedFilters, size, index }"
      >
        <slot
          :name="`filter(${filter.key})`"
          :selected-filters="selectedFilters"
          :size="size"
          :index="index"
        />
      </template>
    </FiltersBlock>

    <slot :name="BaseListSlots.CustomFilter" />

    <div
      v-if="config.withTopPagination && items.isNotEmpty && config.pagination"
      class="mb-6"
      :class="{ 'mt-6': config.filterList?.isEmpty && config.hideSearchBlock }"
    >
      <ListPagination
        data-test-id="list-pagination"
        :model-value="currentPage"
        :link-gen="linkGenerator"
        :pagination-config="paginationConfig"
        :data-meta="dataMeta"
        :small="config.small"
        @update:model-value="setPage"
      />
    </div>
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
            :dir="appConfigCoreStore.dirOption"
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
          <slot
            :name="BaseListSlots.TableFieldSetting"
            :selected-items="selectedItems"
            :items="items"
          />

          <TableFields
            v-model="selectedFields"
            :entity-name="pageName || entityName"
            :list="fields"
          />
        </div>
      </div>
      <MultipleActions
        v-else-if="config.withMultipleActions && selectedItems.isNotEmpty"
        :action="typeof config.withMultipleActions !== 'boolean' ? config.withMultipleActions : null"
        :entity-name="entityName"
        :number-selected-items="allSelectedIds.size"
        :can-remove="canRemove"
        @on-activate="onClickToggleStatusMultiple(true)"
        @on-deactivate="onClickToggleStatusMultiple(false)"
        @on-remove="onClickDeleteMultiple"
      >
        <template
          v-if="checkSlotExistence(BaseListSlots.PrependMultipleAction)"
          #[BaseListSlots.PrependMultipleAction]
        >
          <slot
            :name="BaseListSlots.PrependMultipleAction"
            :selected-items="selectedItems"
            :can-update="canUpdate"
            :entity-name="entityName"
          />
        </template>

        <slot
          :name="BaseListSlots.MultipleActions"
          :selected-items="selectedItems"
          :can-update="canUpdate"
          :entity-name="entityName"
        />
      </MultipleActions>

      <CTable
        v-model:sort-data="sortData"
        :is-loading-list="isLoadingList"
        :fields="selectedFields"
        :rows="items"
        :select-mode="config.selectMode"
        :selectable="config.selectable && (canUpdate || canRemove)"
        :small="config.small"
        :draggable="canDraggable"
        :hover="config.hover"
        :show-expand="config.showExpand"
        :skeleton-rows="config.skeletonRows"
        :skeleton-cols="config.skeletonCols"
        :selected-items="selectedItems"
        :items-per-page="itemsPerPage"
        :disabled-row-ids="disableRowIds"
        :cell-cb-class="config.cellCbClass"
        @end="onDragChanged"
        @row-selected="onRowSelected"
        @row-clicked="onClickRow"
      >
        <template
          v-for="fieldItem in selectedFields"
          :key="`base-list_cell-${fieldItem.key}`"
          #[`cellExpand(${fieldItem.key})`]="{ field, item, cell, toggleExpand, isExpanded }"
        >
          <BaseListCell
            :field="field"
            :item="item"
            :cell="cell"
            :get-update-route="getUpdateRoute"
            :get-details-route="getDetailsRoute"
            :is-show-you="config.isShowYou"
            :can-update="canUpdate"
            :editing-id="editingId"
            :create-page-name="CreatePageName"
            :details-page-name="DetailsPageName"
            :can-create="canCreate"
            :can-update-seo="canUpdateSeo"
            :can-update-item="canUpdateItem(item.raw)"
            :can-remove-item="canRemoveItem(item.raw)"
            :can-copy-item="canCopyItem(item.raw)"
            :config="config"
            @edit-position="(rawItem, val) => onEditPosition(rawItem, val)"
            @open-edit="onOpenEdit"
            @show-detail-image="showDetailImage"
            @on-remove="onClickRemove"
            @on-toggle-status="onClickToggleStatus"
          >
            <!--  If don't use slot of expand apply components and slot of base row  -->
            <template
              v-if="checkSlotExistence(`cell(${fieldItem.key})`)"
              #custom-slot
            >
              <slot
                :name="checkSlotExistence(`cellExpand(${fieldItem.key})`) ? `cellExpand(${fieldItem.key})` : `cell(${fieldItem.key})`"
                :field="field"
                :item="item.raw"
                :cell="cell"
                :value="item.value"
                :get-update-route="getUpdateRoute"
                :index="getIndexByItemFromList(item.value)"
                :toggle-expand="toggleExpand"
                :is-expanded="isExpanded"
              />
            </template>

            <template #nameWithIdTitle="{ item: nameItem, canUpdate: nameCanUpdate }">
              <slot
                :name="`${field.key}-nameWithIdTitle`"
                :item="nameItem"
                :can-update="nameCanUpdate"
              />
            </template>

            <template #badgeTitle="{ item: badgeItem, cell: badgeCell, value }">
              <slot
                :name="`${field.key}-badgeTitle`"
                :item="badgeItem"
                :cell="badgeCell"
                :value="value"
              />
            </template>

            <template
              v-if="checkSlotExistence(BaseListSlots.PrependActionItem)"
              #prependActionItem="{ item: actionItem, canUpdate: actionCanUpdate }"
            >
              <slot
                :name="BaseListSlots.PrependActionItem"
                :item="actionItem"
                :can-update="actionCanUpdate"
              />
            </template>

            <template #detailsActionItem="{ item: actionItem, pageName }">
              <slot
                :name="BaseListSlots.DetailsActionItem"
                :item="actionItem"
                :page-name="pageName"
              />
            </template>

            <template
              v-if="checkSlotExistence(BaseListSlots.AppendActionItem)"
              #appendActionItem="{ item: actionItem, canUpdate: actionCanUpdate, canCreate: actionCanCreate }"
            >
              <slot
                :name="BaseListSlots.AppendActionItem"
                :item="actionItem"
                :can-update="actionCanUpdate"
                :can-create="actionCanCreate"
              />
            </template>
          </BaseListCell>
        </template>

        <template
          v-for="fieldItem in selectedFields"
          :key="`base-list_cell-${fieldItem.key}`"
          #[`cell(${fieldItem.key})`]="{ field, item, cell, toggleExpand, isExpanded }"
        >
          <BaseListCell
            :field="field"
            :item="item"
            :cell="cell"
            :get-update-route="getUpdateRoute"
            :get-details-route="getDetailsRoute"
            :is-show-you="config.isShowYou"
            :can-update="canUpdate"
            :editing-id="editingId"
            :create-page-name="CreatePageName"
            :details-page-name="DetailsPageName"
            :can-create="canCreate"
            :can-update-seo="canUpdateSeo"
            :can-update-item="canUpdateItem(item.raw)"
            :can-remove-item="canRemoveItem(item.raw)"
            :can-copy-item="canCopyItem(item.raw)"
            :config="config"
            @edit-position="(rawItem, val) => onEditPosition(rawItem, val)"
            @open-edit="onOpenEdit"
            @show-detail-image="showDetailImage"
            @on-remove="onClickRemove"
            @on-toggle-status="onClickToggleStatus"
          >
            <template
              v-if="checkSlotExistence(`cell(${fieldItem.key})`)"
              #custom-slot
            >
              <slot
                :name="`cell(${fieldItem.key})`"
                :field="field"
                :item="item.raw"
                :cell="cell"
                :value="item.value"
                :create-page-name="CreatePageName"
                :can-create="canCreate"
                :can-remove="canRemove"
                :inline-filters="inlineFilters"
                :get-update-route="getUpdateRoute"
                :index="getIndexByItemFromList(item.value)"
                :toggle-expand="toggleExpand"
                :is-expanded="isExpanded"
                :on-click-remove="onClickRemove"
              />
            </template>

            <template #nameWithIdTitle="{ item: nameItem, canUpdate: nameCanUpdate }">
              <slot
                :name="`${field.key}-nameWithIdTitle`"
                :item="nameItem"
                :can-update="nameCanUpdate"
              />
            </template>

            <template #badgeTitle="{ item: badgeItem, cell: badgeCell, value }">
              <slot
                :name="`${field.key}-badgeTitle`"
                :item="badgeItem"
                :cell="badgeCell"
                :value="value"
              />
            </template>

            <template
              v-if="checkSlotExistence(BaseListSlots.PrependActionItem)"
              #prependActionItem="{ item: actionItem, canUpdate: actionCanUpdate }"
            >
              <slot
                :name="BaseListSlots.PrependActionItem"
                :item="actionItem"
                :can-update="actionCanUpdate"
              />
            </template>

            <template #detailsActionItem="{ item: actionItem, pageName: actionPageName }">
              <slot
                :name="BaseListSlots.DetailsActionItem"
                :item="actionItem"
                :page-name="actionPageName"
              />
            </template>

            <template
              v-if="checkSlotExistence(BaseListSlots.AppendActionItem)"
              #appendActionItem="{ item: actionItem, canUpdate: actionCanUpdate, canCreate: actionCanCreate }"
            >
              <slot
                :name="BaseListSlots.AppendActionItem"
                :item="actionItem"
                :can-update="actionCanUpdate"
                :can-create="actionCanCreate"
                :entity-name="entityName"
              />
            </template>
          </BaseListCell>
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
      v-if="items.isNotEmpty && config.pagination"
      class="pt-6"
    >
      <ListPagination
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
.default__base-list {
  :deep(.c-table) {
    .c-table-cell-padding {
      padding: var(--default__c-table-cell-padding);
    }

    .c-table-sm-cell-padding {
      padding: var(--default__c-table-sm-cell-padding);
    }
  }

  .empty-state-wrapper {
    height: 7.25rem;
  }
}
</style>
