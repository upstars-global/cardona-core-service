<template>
  <div :class="{ 'base-list-small': config.small }">
    <!-- Sidebar -->
    <side-bar
      v-if="config.sidebar"
      :sidebar-active.sync="isSidebarShown"
      :item="selectedItem"
      :can-remove="canRemove"
      :can-update="canUpdate"
      :entity-name="entityName"
      :side-bar-model="SideBarModel"
      :sidebar-collapse-mode="config.sidebarCollapseMode"
      @update="routerToUpdatePageId(selectedItem)"
      @remove="onClickRemove(selectedItem)"
    >
      <template #sidebar-actions="{ form }">
        <slot name="sidebar-actions" :form="form" :item="selectedItem" />
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
    <b-row class="filters-row">
      <b-col>
        <div class="d-flex align-items-center justify-content-end">
          <slot name="left-search-btn" />

          <search-input
            v-if="config.withSearch"
            v-model="searchQuery"
            class="search"
            :size="size"
            :placeholder="config.searchPlaceholder"
          />

          <b-button
            v-if="config.filterList.isNotEmpty"
            variant="outline-secondary"
            :class="{ 'btn-icon': config.small }"
            class="d-flex align-items-center ml-1"
            :size="size"
            @click="isFiltersShown = !isFiltersShown"
          >
            <feather-icon icon="FilterIcon" />

            <span v-if="!config.small" class="align-middle ml-50">
              {{ $t('common.filter._') }}
            </span>

            <span v-if="selectedFilters.isNotEmpty" class="align-middle ml-50">
              {{ selectedFilters.length }}
            </span>
          </b-button>

          <export-format-selector
            v-if="config.withExport && canExport"
            :disabled="!total"
            class="ml-1"
            @export-format-selected="onExportFormatSelected"
          />

          <slot
            name="right-search-btn"
            :can-create="isShownCreateBtn"
            :create-page-name="CreatePageName"
          >
            <b-button
              v-if="isShownCreateBtn"
              variant="primary"
              :to="{ name: CreatePageName }"
              class="ml-1"
            >
              <feather-icon icon="PlusIcon" class="mr-50" />

              <span class="text-nowrap">
                {{ $t('action.create') }}
              </span>
            </b-button>
          </slot>
        </div>
      </b-col>
    </b-row>

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

      <div
        v-else-if="config.withMultipleActions && selectedItems.isNotEmpty"
        class="table-settings"
      >
        <span class="py-25">
          {{ $t('common.numberOfSelected', { number: selectedItems.length }) }}
        </span>

        <div>
          <b-button
            variant="outline-secondary"
            size="sm"
            @click="onClickToggleStatusMultiple(true)"
          >
            {{ $t('action.activate') }}
          </b-button>

          <b-button
            class="ml-1"
            variant="outline-secondary"
            size="sm"
            @click="onClickToggleStatusMultiple(false)"
          >
            {{ $t('action.deactivate') }}
          </b-button>

          <b-button
            v-if="canRemove"
            class="ml-1"
            variant="outline-danger"
            size="sm"
            @click="onClickDeleteMultiple"
          >
            {{ $t('action.remove') }}
          </b-button>
        </div>
      </div>

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
        hover
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
            :set-selected-item="setSelectedItem"
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

          <date-period-field
            v-else-if="field.type === ListFieldType.Period"
            :key="index"
            :period="value"
          />

          <copy-field v-else-if="field.type === ListFieldType.Copy" :key="index" :value="value" />

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

        <template v-if="canUpdate || canUpdateSeo" #cell(actions)="{ item }">
          <b-dropdown class="d-flex" variant="link" no-caret toggle-class="p-0" right :data="item">
            <template #button-content>
              <b-button variant="flat-dark" class="btn-icon">
                <feather-icon icon="MoreVerticalIcon" />
              </b-button>
            </template>

            <b-dropdown-item
              v-if="canUpdate && config.withDeactivation"
              @click="onClickToggleStatus(item)"
            >
              <feather-icon
                :icon="item.isActive ? 'ToggleLeftIcon' : 'ToggleRightIcon'"
                size="16"
              />

              <span class="align-middle ml-50">
                {{ item.isActive ? $t('action.deactivate') : $t('action.activate') }}
              </span>
            </b-dropdown-item>

            <b-dropdown-item :to="{ name: UpdatePageName, params: { id: item.id } }">
              <feather-icon icon="EditIcon" size="16" />

              <span class="align-middle ml-50">
                {{ $t('action.edit') }}
              </span>
            </b-dropdown-item>

            <b-dropdown-item
              v-if="config.createFromCopy"
              :to="{ name: CreatePageName, params: { id: item.id } }"
            >
              <feather-icon icon="CopyIcon" size="16" />

              <span class="align-middle ml-50">
                {{ $t('action.makeCopy') }}
              </span>
            </b-dropdown-item>

            <b-dropdown-item v-if="canRemove" @click="onClickRemove(item)">
              <feather-icon icon="Trash2Icon" size="16" class="text-danger" />

              <span class="text-danger align-middle ml-50">
                {{ $t('action.remove') }}
              </span>
            </b-dropdown-item>
          </b-dropdown>
        </template>

        <template #empty>
          <div class="d-flex flex-column justify-content-center align-items-center p-1">
            <div>
              {{ config.emptyText }}
            </div>

            <b-button
              v-if="isShownCreateBtn"
              variant="primary"
              :to="{ name: CreatePageName }"
              class="mt-2"
            >
              <feather-icon icon="PlusIcon" />

              <span class="text-nowrap">
                {{ $t('action.create') }}
              </span>
            </b-button>
          </div>
        </template>
      </c-table>
    </b-card>

    <!-- Footer pagination -->
    <div v-if="config?.pagination" class="mx-2">
      <b-row>
        <b-col
          cols="12"
          sm="6"
          class="d-flex align-items-center justify-content-center justify-content-sm-start p-0"
        >
          <span class="text-muted">
            {{ $t('pagination.showing', dataMeta) }}
          </span>
        </b-col>

        <b-col
          cols="12"
          sm="6"
          class="d-flex align-items-center justify-content-center justify-content-sm-end p-0"
        >
          <b-pagination-nav
            v-if="numberOfPages"
            v-model="currentPage"
            first-number
            last-number
            class="pagination-nav mb-0 mt-1 mt-sm-0"
            prev-class="prev-item"
            next-class="next-item"
            :link-gen="linkGenerator"
            :number-of-pages="numberOfPages"
            use-router
          >
            <template #prev-text>
              <feather-icon icon="ChevronLeftIcon" size="18" />
            </template>

            <template #next-text>
              <feather-icon icon="ChevronRightIcon" size="18" />
            </template>
          </b-pagination-nav>
        </b-col>
      </b-row>
    </div>

    <!-- Remove modal -->

    <!-- TODO: config.withRemoveModal - Delete and permission -->
    <c-modal
      v-if="canRemove || config.withRemoveModal"
      :id="removeModalId"
      :title="$t(`modal.remove${entityName}.title`)"
      ok-variant="danger"
      :ok-title="$t('action.remove')"
      @ok="onClickModalOk"
      @hidden="onCloseModal"
    >
      <span>
        {{ $t(`modal.remove${entityName}.description`) }}
      </span>

      <b-form-group
        v-if="config.withRemoveComment"
        class="mt-1 mb-0"
        label-for="removeComment"
        :label="$t('common.comment._')"
      >
        <b-form-textarea
          id="removeComment"
          v-model.trim="commentToRemove"
          no-resize
          rows="3"
          :placeholder="$t('common.comment._')"
        />
      </b-form-group>
    </c-modal>
  </div>
</template>

<script lang="ts">
import { computed, onMounted, PropType, reactive, ref, watch } from 'vue'
import store from '../../../store'
import { useBvModal } from '../../../helpers/bvModal'
import { getStorage, setStorage, removeStorageItem } from '../../../helpers/storage'
import { useRouter } from '../../../@core/utils/utils'
import usePagination from '../../../use/pagination'
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
  getPermissionKeys,
  isNotEmptyNumber,
  isEmptyString,
} from '../../../helpers'
import { parseDateRange } from '../../../helpers/filters'
import SearchInput from './_components/SearchInput.vue'
import StatusField from './_components/StatusField.vue'
import PillStatusField from './_components/PillStatusField.vue'
import NameWithIdField from './_components/NameWithIdField.vue'
import EmailField from './_components/EmailField.vue'
import DateField from './_components/DateField.vue'
import DateWithSecondsField from './_components/DateWithSecondsField.vue'
import StatementField from './_components/StatementField.vue'
import PositionField from './_components/PositionField.vue'
import ExportFormatSelector from './_components/ExportFormatSelector.vue'
import BadgesField from './_components/BadgesField.vue'
import ButtonField from './_components/ButtonField.vue'
import CommentField from './_components/CommentField.vue'
import ImageField from './_components/ImageField.vue'
import DatePeriodField from './_components/DatePeriodField.vue'
import CopyField from './_components/CopyField.vue'
import SideBar from '../../../components/templates/BaseList/_components/SideBar.vue'
import CModal from '../../../components/CModal.vue'
import SumAndCurrency from '../../../components/SumAndCurrency.vue'
import { IListSortData, ListSort } from '../../../@model'
import CTable from '../../CTable/index.vue'
import { useFilters } from '../../FiltersBlock/useFilters'
import FiltersBlock from '../../FiltersBlock/index.vue'
import { permissionPrefix } from '@productConfig'
import { Filter, PayloadFilters } from '../../../@model/filter'
import { BaseField, SelectBaseField } from '../../../@model/baseField'
import { omit } from 'lodash'

export default {
  name: 'BaseList',
  components: {
    DatePeriodField,
    ImageField,
    CommentField,
    SumAndCurrency,
    CModal,
    SideBar,
    BadgesField,
    PositionField,
    ExportFormatSelector,
    SearchInput,
    FiltersBlock,
    TableFields,
    CTable,
    StatusField,
    PillStatusField,
    NameWithIdField,
    EmailField,
    DateField,
    DateWithSecondsField,
    StatementField,
    ButtonField,
    CopyField,
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
    const entityNamePermission = entityName.replace('-', '')
    const { permissionKey, permissionKeySeo, permissionKeyReport } = getPermissionKeys({
      permissionKey: props.config?.permissionKey,
      permissionPrefix: props.config?.noPermissionPrefix
        ? undefined
        : props.config?.customPermissionPrefix || permissionPrefix,
      entityNamePermission,
    })

    const onePermission: boolean = store.getters.abilityCan(props.config?.onePermissionKey, 'view')

    const canCreate: boolean = props.config?.onePermissionKey
      ? onePermission
      : store.getters.abilityCan(permissionKey, 'create')

    const canUpdate: boolean = props.config?.onePermissionKey
      ? onePermission
      : store.getters.abilityCan(permissionKey, 'update')
    const canUpdateSeo: boolean = props.config?.onePermissionKey
      ? onePermission
      : store.getters.abilityCan(permissionKeySeo, 'update')
    const canRemove: boolean = props.config?.onePermissionKey
      ? onePermission
      : store.getters.abilityCan(permissionKey, 'delete')
    const canExport: boolean = props.config?.onePermissionKey
      ? onePermission
      : store.getters.abilityCan(permissionKeyReport, 'view')

    const isShownCreateBtn = !!props.config?.withCreateBtn && isExistsCreatePage && canCreate

    // Sidebar
    const isSidebarShown = ref(false)
    const selectedItem: any = ref(null)
    const setSelectedItem = (item: any) => {
      selectedItem.value = item
    }

    const sidebarSlots = computed(() =>
      Object.keys(slots).filter(
        (key) => key.includes('sidebar-row') || key.includes('sidebar-value')
      )
    )

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
          } else if (filter instanceof BaseField) {
            acc[key] = filter.transformField()
          } else if (filter.type === FieldType.Select) {
            acc[key] = filter.value?.[trackBy]
          } else if (filter.type === FieldType.MultiSelect) {
            acc[key] = filter.value.map((item: object) => item[trackBy])
          } else if (filter.type === FieldType.DateRange) {
            if (!filter.value || typeof filter.value !== 'string') return acc

            const [dateFrom, dateTo]: Array<string> = parseDateRange(filter.value)

            acc[`${key}From`] = dateFrom
            acc[`${key}To`] = dateTo
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
    } = usePagination({
      defaultPerPage: props.config.defaultPerPage,
      withIndependentPagination: props.config.withIndependentPagination,
      isUseRouter: !props.config.withIndependentPagination,
      storageKey: perPageStorageKey,
    })

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
    const commentToRemove = ref()

    const onClickRemove = (item) => {
      selectedItem.value = item
      if (beforeRemoveCallback) {
        const isAllowedRemove = beforeRemoveCallback(item)
        if (!isAllowedRemove) return
      }
      bvModal.show(removeModalId)
    }

    const onClickModalOk = async (hide: Function) => {
      await store.dispatch(deleteActionName, {
        type: entityName,
        id: selectedItem.value.id,
        comment: commentToRemove.value,
        customApiPrefix: props.config?.customApiPrefix,
      })

      hide()
      reFetchList()
    }

    const onCloseModal = () => {
      commentToRemove.value = undefined
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

      // Sidebar
      isSidebarShown,
      selectedItem,
      setSelectedItem,
      routerToUpdatePageId,
      sidebarSlots,

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
      commentToRemove,
      onClickRemove,
      onClickModalOk,
      onCloseModal,

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

      // Draggable
      onDragChanged,

      // Handlers
      onClickRow,
      onClickToggleStatus,
      onEditPosition,
    }
  },
}
</script>

<style lang="scss" scoped>
.table-responsive {
  min-height: 198px;
}

.filters-row {
  margin-bottom: 2rem;

  .search {
    flex-basis: 0;
    flex-grow: 1;
  }
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