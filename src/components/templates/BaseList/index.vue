<template>
  <div :class="{ 'base-list-small': config.small }">
    <!-- Sidebar -->
    <side-bar
      v-if="config.sidebar"
      :sidebar-active.sync="isSidebarShown"
      :item="selectedItem"
      :can-update="canUpdate"
      :can-update-item="canUpdateItem(selectedItem)"
      :can-remove-item="canRemoveItem(selectedItem)"
      :entity-name="entityName"
      :side-bar-model="SideBarModel"
      :sidebar-collapse-mode="config.sidebarCollapseMode"
      @update="routerToUpdatePageId(selectedItem)"
      @remove="onClickRemove(selectedItem)"
      @hide="resetSelectedItem"
    >
      <template #sidebar-actions="{ form }">
        <slot name="sidebar-actions" :form="form" :item="selectedItem" />
      </template>

      <template #sidebar-action-items="{ form }">
        <slot name="sidebar-action-items" :form="form" :item="selectedItem" />
      </template>

      <template v-for="key in sidebarSlots" :slot="key" slot-scope="{ item }">
        <slot :name="key" :item="item" />
      </template>
    </side-bar>

    <slot
      name="table-header"
      :selected-items="selectedItems"
      :total="total"
      :search="searchQuery"
    />

    <!-- Search -->
    <list-search
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
    </list-search>

    <!-- Filters -->
    <filters-block
      v-if="config.filterList.isNotEmpty"
      :is-open="config.filterList.isNotEmpty && isFiltersShown"
      :entity-name="entityName"
      :filters="filters"
      :size="size"
      @apply="reFetchList"
      @changeSelectedFilters="onChangeSelectedFilters"
    />

    <slot name="table-info" :selected-items="selectedItems" :total="total" />

    <!-- Table card -->
    <b-card no-body class="table-card-settings">
      <!-- Table actions -->
      <div
        v-if="config.withSettings && (!canUpdate || selectedItems.isEmpty)"
        class="table-settings"
        :class="config?.pagination ? 'justify-content-between' : 'justify-content-end'"
      >
        <!-- Table per page select -->
        <div v-if="config?.pagination" class="d-flex align-items-center justify-content-start">
          <span class="mr-1">
            {{ $t('common.show') }}
          </span>

          <v-select
            v-model="perPage"
            :options="perPageOptions"
            class="per-page-selector d-inline-block"
            :dir="$store.getters['appConfigCore/dirOption']"
            :searchable="false"
            :clearable="false"
            @input="setPerPage"
          />
        </div>

        <!-- Table field settings -->
        <div class="d-flex align-items-center justify-content-end">
          <slot name="table-field-setting" />
          <table-fields v-model="selectedFields" :entity-name="entityName" :list="fields" />
        </div>
      </div>
      <multiple-actions
        v-else-if="config.withMultipleActions && selectedItems.isNotEmpty"
        :number-selected-items="selectedItems.length"
        :can-remove="canRemove"
        @on-activate="onClickToggleStatusMultiple(true)"
        @on-deactivate="onClickToggleStatusMultiple(false)"
        @on-remove="onClickDeleteMultiple"
      />

      <!-- Table skeleton -->
      <b-skeleton-table
        v-if="isLoadingList"
        :rows="config.skeletonRows"
        :columns="config.skeletonColumns"
      />
      <!-- Table -->
      <c-table
        v-show="!isLoadingList"
        ref="refListTable"
        :hover="config.hover"
        show-empty
        :responsive="config.responsive"
        :select-mode="config.selectMode"
        :selectable="config.selectable"
        :small="config.small"
        :fields="selectedFields"
        :items="getList"
        class="our-table"
        :draggable="config.draggable"
        :sort-by.sync="sortData.sortBy"
        :sort-desc.sync="sortData.sortDesc"
        :tbody-tr-class="selectedRowClass"
        @end="onDragChanged"
        @row-selected="onRowSelected"
        @row-clicked="onClickRow"
      >
        <template v-if="config.selectable" #head(selected)>
          <b-form-checkbox
            v-model="allSelected"
            :indeterminate="indeterminate"
            @change="toggleAll"
          />
        </template>

        <template
          v-for="({ key }, index) in selectedFields"
          :slot="`cell(${key})`"
          slot-scope="{ field, item, value }"
        >
          <slot
            v-if="checkSlotExistence(`cell(${key})`)"
            :name="`cell(${key})`"
            :field="field"
            :item="item"
            :value="value"
          />

          <status-field
            v-else-if="field.type === ListFieldType.Status"
            :key="index"
            :value="item[key]"
          />

          <sum-and-currency
            v-else-if="field.type === ListFieldType.SumAndCurrency"
            :key="index"
            :data="{
              amount: item[key],
              currency: item.currency,
              remainder: item.remainder,
            }"
          />

          <pill-status-field
            v-else-if="field.type === ListFieldType.PillStatus"
            :key="index"
            :is-active="value"
          />

          <name-with-id-field
            v-else-if="field.type === ListFieldType.NameWithId"
            :key="index"
            :item="item"
            :get-update-route="getUpdateRoute"
            :is-show-you="config.isShowYou"
          >
            <template>
              <slot :name="`${field.key}-nameWithIdTitle`" :item="item" />
            </template>
          </name-with-id-field>

          <name-with-short-id-field
            v-else-if="field.type === ListFieldType.NameWithShortId"
            :key="index"
            :item="item"
            :get-update-route="getUpdateRoute"
            :is-show-you="config.isShowYou"
          >
            <template>
              <slot :name="`${field.key}-nameWithIdTitle`" :item="item" />
            </template>
          </name-with-short-id-field>

          <email-field
            v-else-if="field.type === ListFieldType.Email"
            :key="index"
            :item="item"
            :get-update-route="getUpdateRoute"
          />

          <date-field v-else-if="field.type === ListFieldType.Date" :key="index" :date="value" />
          <date-with-seconds-field
            v-else-if="field.type === ListFieldType.DateWithSeconds"
            :key="index"
            :date="value"
          />
          <statement-field
            v-else-if="field.type === ListFieldType.Statement"
            :key="index"
            :state="value"
          />

          <badges-field
            v-else-if="field.type === ListFieldType.Badges"
            :key="index"
            :list-badges="value"
          />

          <position-field
            v-else-if="field.type === ListFieldType.Priority"
            :key="index"
            :position="value"
            :size="field.size"
            :can-update="canUpdate || config.draggable"
            @edit-position="(val) => onEditPosition(item, val)"
          />

          <button-field
            v-else-if="field.type === ListFieldType.Button"
            :key="index"
            :btn-name="value"
          />

          <comment-field
            v-else-if="field.type === ListFieldType.Comment"
            :key="index"
            :value="value"
          />

          <image-field
            v-else-if="field.type === ListFieldType.Image"
            :key="index"
            :image-path="value"
          />
          <image-detail-field
            v-else-if="field.type === ListFieldType.ImageFull"
            :id="value.id"
            :key="index"
            :image-path="value.imagePath"
            :compression-for-preview="value.compressionForPreview || 0"
          />

          <date-period-field
            v-else-if="field.type === ListFieldType.Period"
            :key="index"
            :period="value"
          />

          <copy-field v-else-if="field.type === ListFieldType.Copy" :key="index" :value="value" />

          <copy-short-field
            v-else-if="field.type === ListFieldType.CopyShort"
            :key="index"
            :value="value"
          />

          <template v-else-if="field.type === ListFieldType.Percent"> {{ value }} % </template>

          <template v-else>
            {{ value }}
          </template>
        </template>

        <template v-if="config.selectable" #cell(selected)="{ index, rowSelected, item }">
          <div :id="`c-${item.id}`" :data-index="index" class="table-checkbox">
            <b-form-checkbox :checked="rowSelected" @change="onChangeSelected($event, index)" />
          </div>
        </template>

        <template v-if="showActions" #cell(actions)="{ item }">
          <item-actions
            :item="item"
            :create-page-name="CreatePageName"
            :can-update="canUpdate"
            :can-update-item="canUpdateItem(item)"
            :can-remove-item="canRemoveItem(item)"
            :config="config"
            :get-update-route="getUpdateRoute"
            @on-remove="onClickRemove"
            @on-toggle-status="onClickToggleStatus"
          >
            <template #action-items>
              <slot name="action-items" :item="item" />
            </template>
          </item-actions>
        </template>

        <template #empty>
          <div class="d-flex flex-column justify-content-center align-items-center p-1">
            <slot name="empty">
              <div>
                {{ config.emptyText }}
              </div>
            </slot>
            <b-button
              v-if="isShownCreateBtn"
              variant="primary"
              :to="{ name: CreatePageName }"
              class="mt-2"
            >
              <feather-icon :icon="IconsList.PlusIcon" />

              <span class="text-nowrap">
                {{ $t('action.create') }}
              </span>
            </b-button>
          </div>
        </template>
      </c-table>
    </b-card>

    <!-- Footer pagination -->
    <div class="mx-2">
      <list-pagination
        v-if="config?.pagination"
        v-model="currentPage"
        :link-gen="linkGenerator"
        :pagination-config="paginationConfig"
        :data-meta="dataMeta"
      />
    </div>

    <!-- Remove modal -->
    <remove-modal
      v-if="canRemove"
      :config="config"
      :entity-name="entityName"
      :remove-modal-id="removeModalId"
      @on-click-modal-ok="onClickModalOk"
    />
  </div>
</template>

<script lang="ts">
import { computed, onMounted, PropType, reactive, ref, watch } from 'vue'
import store from '../../../store'
import { useBvModal } from '../../../helpers/bvModal'
import { getStorage, setStorage, removeStorageItem } from '../../../helpers/storage'
import { useRouter } from '../../../@core/utils/utils'
import usePagination, { PaginationResult } from '../../../use/pagination'
import {
  BaseListConfig,
  DownloadFormat,
  FilterListItem,
  IBaseListConfig,
  SortDirection,
  UseListType,
} from './model'
import { Location } from 'vue-router'
import { TableField, ListFieldType } from '../../../@core/components/table-fields/model'
import { FieldType } from '../../../@model/field'
import TableFields from '../../../@core/components/table-fields/TableFields.vue'
import {
  checkExistsPage,
  convertCamelCase,
  convertLowerCaseFirstSymbol,
  isNotEmptyNumber,
  isEmptyString,
} from '../../../helpers'
import { parseDateRange } from '../../../helpers/filters'
import StatusField from './_components/StatusField.vue'
import PillStatusField from './_components/PillStatusField.vue'
import NameWithIdField from './_components/NameWithIdField.vue'
import NameWithShortIdField from './_components/NameWithShortIdField.vue'
import EmailField from './_components/EmailField.vue'
import DateField from './_components/DateField.vue'
import DateWithSecondsField from './_components/DateWithSecondsField.vue'
import StatementField from './_components/StatementField.vue'
import PositionField from './_components/PositionField.vue'
import BadgesField from './_components/BadgesField.vue'
import ButtonField from './_components/ButtonField.vue'
import CommentField from './_components/CommentField.vue'
import ImageField from './_components/ImageField.vue'
import ImageDetailField from './_components/ImageDetailField.vue'
import DatePeriodField from './_components/DatePeriodField.vue'
import CopyField from './_components/CopyField.vue'
import CopyShortField from './_components/CopyShortField.vue'
import SideBar from '../../../components/templates/BaseList/_components/SideBar.vue'
import SumAndCurrency from '../../../components/SumAndCurrency.vue'
import { IListSortData, ListSort } from '../../../@model'
import CTable from '../../CTable/index.vue'
import { useFilters } from '../../FiltersBlock/useFilters'
import FiltersBlock from '../../FiltersBlock/index.vue'
import { Filter, PayloadFilters } from '../../../@model/filter'
import {
  BaseField,
  SelectBaseField,
  MultiSelectBaseField,
  DateBaseField,
} from '../../../@model/baseField'
import { findIndex, omit } from 'lodash'
import { IconsList } from '../../../@model/enums/icons'
import RemoveModal from './_components/RemoveModal.vue'
import ListSearch from './_components/ListSearch.vue'
import MultipleActions from './_components/MultipleActions.vue'
import ItemActions from './_components/ItemActions.vue'
import { basePermissions } from '../../../helpers/base-permissions'
import ListPagination from './_components/ListPagination.vue'

export default {
  name: 'BaseList',
  components: {
    ListPagination,
    ItemActions,
    MultipleActions,
    DatePeriodField,
    ImageField,
    ImageDetailField,
    CommentField,
    SumAndCurrency,
    SideBar,
    BadgesField,
    PositionField,
    FiltersBlock,
    TableFields,
    CTable,
    StatusField,
    PillStatusField,
    NameWithIdField,
    NameWithShortIdField,
    EmailField,
    DateField,
    DateWithSecondsField,
    StatementField,
    ButtonField,
    CopyField,
    CopyShortField,
    RemoveModal,
    ListSearch,
  },

  props: {
    config: {
      type: Object as PropType<IBaseListConfig>,
      default: () => new BaseListConfig({}),
    },

    useList: {
      type: Function as PropType<() => UseListType>,
      required: true,
    },
  },

  emits: ['end', 'row-clicked'],

  setup(props, { slots, emit }) {
    const bvModal = useBvModal()
    const { router, route } = useRouter()
    const { name: currentPageName } = route.value

    const searchQuery = ref('')

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
    const { canCreate, canUpdate, canUpdateSeo, canRemove, canExport } =
      basePermissions<IBaseListConfig>({ entityName, config: props.config })

    const isShownCreateBtn = !!props.config?.withCreateBtn && isExistsCreatePage && canCreate

    const canUpdateItem = (item): boolean => {
      if (!canUpdate) return false
      return canUpdate && canUpdateCb && item
        ? isExistsUpdatePage && canUpdateCb(item)
        : isExistsUpdatePage
    }

    const showActions = computed(() =>
      [(props.config.createFromCopy && canUpdate) || canUpdateSeo].every(Boolean)
    )
    const canRemoveItem = (item): boolean =>
      canRemoveCb && item ? canRemove && canRemoveCb(item) : canRemove
    // Sidebar
    const isSidebarShown = ref(false)
    const selectedItem: any = ref(null)

    const sidebarSlots = computed(() =>
      Object.keys(slots).filter(
        (key) => key.includes('sidebar-row') || key.includes('sidebar-value')
      )
    )

    const resetSelectedItem = () => {
      selectedItem.value = null
    }

    const onClickRow = (data) => {
      if (props.config?.selectable) return

      if (props.config?.sidebar) {
        isSidebarShown.value = true
        selectedItem.value = data
      }
      emit('row-clicked', data)
    }

    const routerToUpdatePageId = (item) => {
      router.push(getUpdateRoute(item))
    }

    // Table
    const refListTable: any = ref(null)
    const items = ref([])

    watch(
      () => items.value,
      () => {
        selectedItem.value = items.value.find((item: any) => item?.id === selectedItem.value?.id)
      },
      { deep: true }
    )

    const selectedFields = ref<TableField[]>([...fields])

    const isLoadingList = computed(() => {
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

    const size = props.config?.small ? 'sm' : 'md'

    // Sort
    const sortStorageKey = `${currentPageName}-${entityName}-sort`
    const sortFromStorage = getStorage(sortStorageKey, ListSort) as ListSort

    const sortBy = sortFromStorage?.field || props.config.staticSorts?.field
    const sortDir = sortFromStorage?.dir || props.config.staticSorts?.dir
    const sortDesc = !!sortDir && sortDir === SortDirection.asc

    const sortData = reactive<IListSortData>({ sortBy, sortDesc })

    watch(sortData, (newSortData) => {
      newSortData.sortBy
        ? setStorage(sortStorageKey, newSortData)
        : removeStorageItem(sortStorageKey)
    })

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

    const reFetchList = () => refListTable.value?.refresh()

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
    }

    // Search
    watch(searchQuery, reFetchList)

    // Export
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
        `data:${DownloadFormat[format]};charset=utf-8,${encodeURIComponent(report)}`
      )
      fakeLink.setAttribute('target', '_blank')
      fakeLink.setAttribute('download', `${entityName}Report`)
      fakeLink.click()
    }

    // Filters
    const isFiltersShown = ref(false)
    const appliedFilters = computed<Filter[]>(() => {
      const isSameEntity: boolean = entityName === store.getters['filtersCore/listEntityName']

      return isSameEntity ? store.getters['filtersCore/appliedListFilters'] : []
    })

    onMounted(() => {
      isFiltersShown.value = selectedFilters && selectedFilters.value.isNotEmpty
    })
    const { filters, selectedFilters, onChangeSelectedFilters } = useFilters(
      props.config.filterList
    )

    const setRequestFilters = (): PayloadFilters => {
      if (!ListFilterModel) return {}

      let filters = new ListFilterModel(props.config?.staticFilters)

      if (searchQuery.value) {
        filters = new ListFilterModel({ ...props.config?.staticFilters, search: searchQuery.value })
      }

      filters = appliedFilters.value.reduce(
        (acc, filter) => {
          const { key, trackBy = 'name' }: FilterListItem = props.config?.filterList.find(
            ({ type }: FilterListItem) => type === filter.key
          )

          if (filter instanceof SelectBaseField) {
            acc[key] = filter.transformField({ trackBy, isStringDefaultValue: false })
          } else if (filter instanceof MultiSelectBaseField) {
            acc[key] = filter.transformField({ trackBy })
          } else if (filter instanceof DateBaseField) {
            if (!filter.value || typeof filter.value !== 'string') return acc

            const [dateFrom, dateTo]: Array<string> = parseDateRange(filter.value)

            acc[`${key}From`] = dateFrom
            acc[`${key}To`] = dateTo
          } else if (filter instanceof BaseField) {
            acc[key] = filter.transformField()
          } else if (filter.type === FieldType.SumRange) {
            if (filter.value?.some((value) => isNotEmptyNumber(value) && !isEmptyString(value))) {
              const [sumFrom, sumTo]: Array<number> = filter.value
              acc[`${key}From`] = sumFrom
              acc[`${key}To`] = sumTo
              const invalidKeys = [`${key}From`, `${key}To`].filter(
                (key) => !isNotEmptyNumber(acc[key])
              )
              acc = omit(acc, invalidKeys)
            }
          } else {
            acc[key] = filter.value
          }

          return acc
        },
        new ListFilterModel({
          ...props.config?.staticFilters,
          ...filters,
        })
      )

      return filters
    }

    // Selectable
    const selectedItems = ref([])
    const allSelected = ref(false)
    const indeterminate = ref(false)

    watch(selectedItems, (newItems) => {
      if (newItems.isEmpty) {
        indeterminate.value = false
        allSelected.value = false
      } else if (newItems.length === items.value.length) {
        indeterminate.value = false
        allSelected.value = true
      } else {
        indeterminate.value = true
        allSelected.value = false
      }
    })

    const onRowSelected = (items) => (selectedItems.value = items)

    const onChangeSelected = (state: boolean, index: number) =>
      state ? refListTable.value.selectRow(index) : refListTable.value.unselectRow(index)

    const toggleAll = (state: boolean) =>
      state ? refListTable.value.selectAllRows() : refListTable.value.clearSelected()

    // Multiple actions
    const onClickToggleStatusMultiple = async (isActive: boolean) => {
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
    }

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
      numberOfPages,
      total,
      setPerPage,
      setupDataMeta,
      linkGen,
      updateTotal,
      onChangePagination,
    } = paginationConfig

    const dataMeta = setupDataMeta(refListTable)

    const linkGenerator = (page: number) => {
      if (props.config?.withIndependentPagination) return

      return linkGen(page)
    }

    onChangePagination(reFetchList)

    // Draggable
    const onDragChanged = async (e) => {
      if (!e) return

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

    const onClickRemove = (item) => {
      selectedItem.value = item
      if (beforeRemoveCallback) {
        const isAllowedRemove = beforeRemoveCallback(item)
        if (!isAllowedRemove) return
      }
      bvModal.show(removeModalId)
    }

    const onClickModalOk = async ({ hide, commentToRemove }) => {
      await store.dispatch(deleteActionName, {
        type: entityName,
        id: selectedItem.value.id,
        comment: commentToRemove,
        customApiPrefix: props.config?.customApiPrefix,
      })
      hide()
      isSidebarShown.value = false
      reFetchList()
    }

    const getIndexByItemFromList = (item) => findIndex(items.value || [], item)

    const selectedItemIndex = computed(() => {
      if (!selectedItem.value) return NaN
      const itemIndex = getIndexByItemFromList(selectedItem.value)
      return itemIndex > -1 ? itemIndex : NaN
    })

    const selectedRowClass = (rowItem) => {
      const itemIndex = getIndexByItemFromList(rowItem)
      if (![selectedItemIndex.value, itemIndex].some(isNotEmptyNumber)) return ''
      return selectedItemIndex.value === itemIndex
        ? `table-${rowItem?.rowVariant || 'default'}-bg`
        : ''
    }

    return {
      //SideBar
      SideBarModel,

      // Pages
      entityName,
      CreatePageName,
      UpdatePageName,

      // Permissions
      canUpdate,
      canUpdateSeo,
      canRemove,
      canExport,
      canUpdateItem,
      canRemoveItem,
      showActions,

      // Sidebar
      isSidebarShown,
      selectedItem,
      routerToUpdatePageId,
      sidebarSlots,
      resetSelectedItem,

      // Search
      searchQuery,
      isShownCreateBtn,

      // Export
      onExportFormatSelected,

      // Filters
      isFiltersShown,
      filters,
      selectedFilters,
      onChangeSelectedFilters,

      //Sort
      sortData,

      // Table
      refListTable,
      isLoadingList,
      isExistsUpdatePage,
      size,
      fields,
      ListFieldType,
      selectedFields,
      items,
      getList,
      checkSlotExistence,
      getUpdateRoute,
      reFetchList,

      // Update
      onUpdateItem,

      // Remove
      removeModalId,
      onClickRemove,
      onClickModalOk,

      // Selectable
      indeterminate,
      allSelected,
      selectedItems,
      toggleAll,
      onRowSelected,
      onChangeSelected,

      // Multiple actions
      onClickToggleStatusMultiple,
      onClickDeleteMultiple,

      // Pagination
      total,
      dataMeta,
      numberOfPages,
      currentPage,
      linkGenerator,
      perPage,
      perPageOptions,
      setPerPage,
      paginationConfig,

      // Draggable
      onDragChanged,

      // Handlers
      onClickRow,
      onClickToggleStatus,
      onEditPosition,

      IconsList,

      selectedRowClass,
      selectedItemIndex,
    }
  },
}
</script>

<style lang="scss" scoped>
.table-responsive {
  min-height: 198px;
}

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

.our-table {
  &:deep(.b-table-selectable) {
    border-radius: 5px;
    display: block;
    th {
      &:first-child {
        width: 5%;
      }
    }
  }

  .custom-control-input,
  .custom-control-label {
    cursor: pointer;
  }
}

.pagination-nav {
  :deep(ul) {
    margin: 0;
  }
}

.base-list-small {
  :deep(.filters-row) {
    margin-bottom: 1rem;
  }

  .card {
    margin-bottom: 1rem;
  }
}
</style>
