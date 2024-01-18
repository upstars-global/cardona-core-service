<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, inject, onBeforeMount, onMounted, ref, useSlots, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import CTable from '../../CTable/index.vue'
import type { FilterListItem, IBaseListConfig } from '../../../@model/templates/baseList'
import { DownloadFormat, SortDirection } from '../../../@model/templates/baseList'
import type { PayloadFilters } from '../../../@model/filter'
import RemoveModal from '../../../components/templates/BaseList/_components/fields/RemoveModal.vue'
import { getStorage, removeStorageItem, setStorage } from '../../../helpers/storage'
import { ListSort } from '../../../@model'
import { useFilters } from '../../../components/FiltersBlock/useFilters'
import {
  BaseField,
  DateBaseField,
  MultiSelectBaseField,
  NumberRangeBaseField,
  SelectBaseField,
} from '../../../@model/templates/baseField'
import type { PaginationResult } from '../../../use/pagination'
import usePagination from '../../../use/pagination'
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
import { VSizes } from '../../../@model/vuetify'
import SideBar from '../../../components/templates/SideBar/index.vue'
import FiltersBlock from '../../../components/FiltersBlock/index.vue'
import CopyField from '../../../components/templates/_components/CopyField.vue'
import StatementField from '../../../components/templates/_components/StatementField.vue'
import DateWithSecondsField from '../../../components/templates/_components/DateWithSecondsField.vue'
import SumAndCurrency from '../../../components/templates/_components/SumAndCurrency.vue'
import StatusField from '../../../components/templates/_components/StatusField.vue'
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

const props = defineProps<{
  config: IBaseListConfig
  useList: unknown
}>()

const emits = defineEmits<{
  rowClicked: [item: Record<string, unknown>]
  end: [item: Record<string, unknown>]
}>()

const modal = inject('modal')
const slots = useSlots()

const store = useStore()
const { t } = useI18n()

const router = useRouter()
const route = useRoute()
const searchQuery = ref('')
const currentPageName = route.name?.toString()

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

// Pages
const CreatePageName = pageName ? `${pageName}Create` : `${entityName}Create`
const UpdatePageName = pageName ? `${pageName}Update` : `${entityName}Update`

const isExistsCreatePage = checkExistsPage(CreatePageName)
const isExistsUpdatePage = checkExistsPage(UpdatePageName)

// Action names
const moduleName = props.config?.customModuleName || convertLowerCaseFirstSymbol(entityName)

const fetchActionName: string = props.config?.withCustomFetchList
  ? `${moduleName}/fetch${entityName}List`
  : 'baseStoreCore/fetchEntityList'

const fetchReportActionName = 'baseStoreCore/fetchReport'
const updateActionName = 'baseStoreCore/updateEntity'

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
  if (props.config?.sidebar) {
    isSidebarShown.value = true
    selectedItem.value = data
  }
  emits('rowClicked', data)
}

const routerToUpdatePageId = item => {
  router.push(getUpdateRoute(item))
}

// Table
const items = ref([])

watch(
  () => items.value,
  () => {
    selectedItem.value = items.value.find((item: any) => item?.id === selectedItem.value?.id)
  },
  { deep: true },
)

const selectedFields = ref<TableField[]>([...fields])

const isLoadingList = computed(() => {
  const indexSymbolNextDash = entityName.indexOf('-') + 1

  const entityNameForLoad = entityName.replace(
    entityName[indexSymbolNextDash],
    entityName[indexSymbolNextDash].toLowerCase(),
  )

  const entityUrl: string = convertCamelCase(entityNameForLoad, '/')

  return store.getters.isLoadingEndpoint([
    `${entityUrl}/list`,
    `${entityUrl}/update`,
    `${entityUrl}/delete`,
  ])
})

const size = props.config?.small ? VSizes.Small : VSizes.Medium

const emptyListText = computed(() =>
  searchQuery.value || hasSelectedFilters.value
    ? t('emptyState.emptyRequest')
    : props.config.emptyText,
)

// Sort
const sortStorageKey = `${currentPageName}-${entityName}-sort`
const sortFromStorage = getStorage(sortStorageKey, ListSort) as ListSort

const sortBy = sortFromStorage?.key || props.config.staticSorts?.key
const sortDir = sortFromStorage?.order || props.config.staticSorts?.order
const sortDesc = !!sortDir && sortDir === SortDirection.asc
const sortData = ref([{ key: sortBy, order: sortDesc }] as SortItem[])

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

const dataMeta = computed(() => setupDataMeta(items.value.length))

const linkGenerator = (page: number) => {
  if (props.config?.withIndependentPagination)
    return

  return linkGen(page)
}

watch(() => perPage.value, () => {
  getList()
})

// Fetch list
const getList = async () => {
  const filter = setRequestFilters()
  const sort = sortData.value[0].key ? [new ListSort({ sortBy: sortData.value[0].key, sortDesc: sortData.value[0].order })] : undefined

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

onChangePagination(() => {
  reFetchList()
  selectedItems.value = []
})

const checkSlotExistence = (slotName: string): boolean => !!slots[slotName]

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

const onEditPosition = async ({ id }: { id: string }, position: number) => {
  await store.dispatch(updateActionName, {
    type: entityName,
    data: { form: { id, position } },
    customApiPrefix: props.config?.customApiPrefix,
  })

  await reFetchList()
}

// Search
watch(() => searchQuery.value, reFetchList)

// Export

const setRequestFilters = (): PayloadFilters => {
  if (!ListFilterModel)
    return {}

  const appliedFiltersData = appliedFilters.value.reduce((acc, filter) => {
    const { key, trackBy = 'name' }: FilterListItem = props.config?.filterList.find(
      ({ type }: FilterListItem) => type === filter.key,
    )

    if (filter instanceof SelectBaseField) {
      acc[key] = filter.transformField({ trackBy, isStringDefaultValue: false })
    }
    else if (filter instanceof MultiSelectBaseField) {
      acc[key] = filter.transformField({ trackBy })
    }
    else if (filter instanceof DateBaseField || filter instanceof NumberRangeBaseField) {
      const transformedFilterValue = filter.transformField(key)

      if (!transformedFilterValue)
        return acc
      else if (typeof transformedFilterValue === 'string')
        acc[key] = transformedFilterValue
      else acc = { ...acc, ...transformedFilterValue }
    }
    else if (filter instanceof BaseField) {
      acc[key] = filter.transformField()
    }

    return acc
  }, {})

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

const onExportFormatSelected = async (format: string) => {
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
  props.config?.filterList,
)

const isFiltersShown = ref(false)

const appliedFilters = computed<BaseField[]>(() => {
  const isSameEntity: boolean = entityName === store.getters['filtersCore/listEntityName']

  return isSameEntity ? store.getters['filtersCore/appliedListFilters'] : []
})

const hasSelectedFilters = computed(() => selectedFilters && selectedFilters.value.isNotEmpty)

onMounted(() => {
  isFiltersShown.value = hasSelectedFilters.value
})

// Selectable
const selectedItems = ref([])

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

  emits('end', { itemId: id, newIndex: e.newIndex, oldIndex: e.oldIndex })
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
  await store.dispatch(deleteActionName, {
    type: entityName,
    id: selectedItem.value.id,
    comment: commentToRemove,
    customApiPrefix: props.config?.customApiPrefix,
  })

  hide()
  reFetchList()
}

onBeforeMount(async () => {
  await getList()
})
</script>

<template>
  <div class="d-flex flex-column gap-5">
    <RemoveModal
      :config="config"
      :remove-modal-id="removeModalId"
      :entity-name="entityName"
      @on-click-modal-ok="onClickModalOk"
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
      v-if="config.filterList?.isNotEmpty && isFiltersShown"
      :is-open="config.filterList?.isNotEmpty && isFiltersShown"
      :entity-name="entityName"
      :filters="filters"
      :size="size"
      @apply="reFetchList"
      @change-selected-filters="onChangeSelectedFilters"
    />

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
        <div class="d-flex align-center justify-content-end">
          <slot name="table-field-setting" />
          <TableFields
            v-model="selectedFields"
            :entity-name="entityName"
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
      />

      <CTable
        v-model:sort-data="sortData"
        :is-loading-list="isLoadingList"
        :fields="selectedFields"
        :rows="items"
        :select-mode="config.selectMode"
        :selectable="config.selectable"
        :small="config.small"
        :draggable="canUpdate && config.draggable"
        :hover="config.hover"
        :selected-items="selectedItems"
        :items-per-page="perPage"
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
            :get-update-route="getUpdateRoute"
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
            :is-show-you="config.isShowYou"
          >
            <slot
              :name="`${field.key}-nameWithIdTitle`"
              :item="item.raw"
            />
          </NameWithIdField>

          <NameWithShortIdField
            v-else-if="field.type === ListFieldType.NameWithShortId"
            :key="`${index}_${field.type}`"
            :item="item.raw"
            :get-update-route="getUpdateRoute"
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
            :item="item"
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
          />

          <PositionField
            v-else-if="field.type === ListFieldType.Priority"
            :key="`${index}_${field.type}`"
            :position="cell"
            :size="field.size"
            :can-update="canUpdate"
            @edit-position="(val) => onEditPosition(item, val)"
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
          />

          <ImageDetailField
            v-else-if="field.type === ListFieldType.ImageFull"
            :id="item.raw.id"
            :key="`${index}_${field.type}`"
            :image-path="item.raw[field.key]?.imagePath"
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

          <ItemActions
            v-else-if="field.key === 'actions'"
            :item="item.raw"
            :create-page-name="CreatePageName"
            :can-update="canUpdate"
            :can-update-item="canUpdateItem(item.raw)"
            :can-remove-item="canRemoveItem(item.raw)"
            :config="config"
            :get-update-route="getUpdateRoute"
            @on-remove="onClickRemove"
            @on-toggle-status="onClickToggleStatus"
          >
            <template #action-items>
              <slot
                name="action-items"
                :item="item"
              />
            </template>
          </ItemActions>

          <template v-else>
            {{ cell }}
          </template>
        </template>

        <template #empty>
          {{ emptyListText }}
        </template>
      </CTable>
    </VCard>
    <div class="mx-2">
      <ListPagination
        v-if="items.length && config?.pagination"
        :model-value="currentPage"
        :link-gen="linkGenerator"
        :pagination-config="paginationConfig"
        :data-meta="dataMeta"
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

    .btn-icon {
      padding: 0;
    }
  }
}
</style>
