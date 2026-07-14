<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import { VDataTable } from 'vuetify/labs/VDataTable'
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'
import type { TableField } from '../../@model/templates/tableFields'
import type { SortItem } from '../../@core/types'
import type { SelectMode } from '../../@model/enums/selectMode'
import { AlignType } from '../../@model/templates/tableFields'
import { IconsList } from '../../@model/enums/icons'
import { SortDirection } from '../../@model/templates/baseList'

const props = withDefaults(defineProps<{
  fields: TableField[]
  rows: Array<Record<string, unknown>>
  class?: string
  hover?: boolean
  showEmpty?: boolean
  selectMode?: SelectMode
  selectable?: boolean
  small?: boolean
  draggable?: boolean
  sortData?: SortItem[]
  itemsPerPage: number
  selectedItems: Array<Record<string, unknown>>
  isLoadingList: boolean
  showExpand?: boolean
  disabledRowIds?: string[]
  skeletonRows?: number
  skeletonCols?: number
  cellCbClass?: (item: Record<string, unknown>, cell: string) => string
  // Optional: declare extra reactive deps from slot content so v-memo can skip unchanged rows.
  // Return a tuple of values that bust the cache when any slot dep changes.
  // When omitted, no memoization is applied (safe default for generic consumers).
  memoKeyFn?: (item: Record<string, unknown>) => unknown[]
  // Optional: row height in px. Enables window-based virtual scroll when set.
  // Use 52 for comfortable density (default Vuetify), 36 for compact (small=true).
  // Leave unset for paginated lists (25-50 rows) — no benefit, zero overhead.
  itemHeight?: number
}>(), {
  cellCbClass: () => () => '',
  disabledRowIds: () => [],
})

const emits = defineEmits<{
  (e: 'rowSelected', items: Array<Record<string, unknown>>): void
  (e: 'rowClicked', item: Record<string, unknown>): void
  (e: 'end', data: Record<string, unknown>): void
  (e: 'update:sortData', event: SortItem[]): void
}>()

const cTable = ref({})
const tableWrapperComponent = computed(() => props.draggable ? VueDraggableNext : 'tbody')

// #3: O(1) disabled row lookup — replaces Array.includes O(n) per row
const disabledSet = computed(() => new Set(props.disabledRowIds))

const compareClasses = (item: Record<string, unknown>, isSelected: boolean): Record<string, boolean> => {
  return {
    [`table-light-${item.rowVariant}`]: !!item.rowVariant,
    'c-table__row--selected': isSelected,
    'is-hover-row': props.hover,
    'row-disabled': disabledSet.value.has(item.id as string),
  }
}

const onSelectRow = (items: Array<Record<string, unknown>>) => {
  emits('rowSelected', items)
}

const onRowClicked = (item: Record<string, unknown>) => {
  emits('rowClicked', item)
}

const onDragEnd = (event: { moved: object }) => {
  emits('end', event.moved)
}

const cellClasses = computed(() => props.small ? 'c-table-sm-cell-padding' : 'c-table-cell-padding')
const maxSkeletonRows = 25

const skeletonRows = computed(() =>
  props.skeletonRows
    ? props.skeletonRows
    : !props.itemsPerPage || props.itemsPerPage > maxSkeletonRows
      ? +maxSkeletonRows
      : +props.itemsPerPage)

const emptyColspan = computed(() => props.selectable ? props.fields.length + 1 : props.fields.length)

// #5: O(1) sortable column lookup — replaces fields.find() O(n) per header render
const sortableKeySet = computed(() => new Set(props.fields.filter(f => f.sortable).map(f => f.key)))
const isSortableColumn = (column: TableField): boolean => sortableKeySet.value.has(column.key)

const sortParams = ref(props.sortData?.map(item => ({
  ...item,
  order: item?.order,
  isActive: true,
})))

// #4: O(1) sort state lookup — replaces lodash find() O(n) called 2× per sortable column
const sortParamsMap = computed(() => new Map(sortParams.value.map(item => [item.key, item])))

const handleSorByField = ({ key }: { key: string }) => {
  const itemIndex = sortParams.value.findIndex(item => item?.key === key)

  if (itemIndex !== -1) {
    if (sortParams.value[itemIndex].order === 'DESC') {
      emits('update:sortData', [])
      sortParams.value[itemIndex].order = ''

      return
    }
    sortParams.value[itemIndex].order = sortParams.value[itemIndex].order === 'ASC' ? 'DESC' : 'ASC'
  }
  else {
    sortParams.value = [{ key, order: 'ASC', isActive: true }]
  }
  emits('update:sortData', sortParams.value.filter(item => item?.isActive))
}

// #4: uses Map.get instead of lodash find
const isActiveSort = (key: string, direction: string): boolean => {
  const currentItem = sortParamsMap.value.get(key)

  return !!currentItem?.isActive && currentItem?.order?.toLowerCase() === direction
}

const actualHeadersTable = computed(() => {
  if (!props.skeletonCols)
    return props.fields

  return props.isLoadingList ? props.fields.slice(0, props.skeletonCols) : props.fields
})

const getActualField = (fields: Array<unknown>) => {
  if (!props.skeletonCols)
    return fields

  return props.isLoadingList ? fields.slice(0, props.skeletonCols) : fields
}

// reactive object gives Vue per-key dependency tracking:
// changing expandedMap['rowA'] only re-renders rows that accessed expandedMap['rowA'],
// not all rows — this eliminates the full-table re-render on every expand/collapse
const expandedMap = reactive<Record<string, boolean>>({})

const toggleExpand = (id: string) => {
  if (expandedMap[id]) {
    // Collapse is instant — just removing DOM, no heavy work
    delete expandedMap[id]
  }
  else {
    // Defer expand to next animation frame so the browser can paint the click feedback
    // (button ripple/focus state) before the blocking component-mount work begins
    requestAnimationFrame(() => {
      expandedMap[id] = true
    })
  }
}

// #7: rowKey avoids ?? in the compiled :key expression — Vue compiler mixes ?? with && when v-memo
// is present on the same element, producing invalid JS ("logical and coalesce cannot be mixed").
const rowKey = (item: { raw?: Record<string, unknown> | null }, index: number): string | number =>
  item.raw?.id != null ? (item.raw.id as string | number) : index

// #8: per-row memo key for v-memo — only re-renders rows whose displayed state actually changed.
// When memoKeyFn is NOT provided by the consumer, returns [Symbol()] which is always unique,
// so v-memo always misses and the row re-renders normally (zero regression for other consumers).
// When memoKeyFn IS provided, the row only patches DOM when item.raw ref, expand, selection,
// visible fields, or a consumer-declared dep changes — skipping 700×N slot calls for unchanged rows.

// Stable string identity for the current field set — busts memo when columns are toggled.
const fieldsVersionKey = computed(() => props.fields.map(f => f.key).join(','))

const getMemoKey = (
  item: { raw?: Record<string, unknown> | null },
  isItemSelected: boolean,
): unknown[] => {
  if (!props.memoKeyFn)
    return [Symbol()] // sentinel: always unique → memo always misses → normal render
  const id = item.raw?.id as string | undefined
  return [
    item.raw, // new ref on list refresh → busts memo for all rows
    id !== undefined ? !!expandedMap[id] : false,
    isItemSelected,
    fieldsVersionKey.value, // column toggle → all memos bust → rows re-render with new columns
    ...props.memoKeyFn(item.raw ?? {}),
  ]
}

// #9: Window-based virtual scroll — only render visible rows + a buffer.
// Opt-in via :item-height (px per row). When unset, all rows render normally (zero regression).
// Works with page-level scroll (not a fixed-height container) via getBoundingClientRect on tbody.
const tbodyRef = ref<{ $el?: HTMLElement } | HTMLElement | null>(null)
const _winScrollY = ref(typeof window !== 'undefined' ? window.scrollY : 0)
const _viewport = ref(typeof window !== 'undefined' ? window.innerHeight : 800)
const _VBUF = 5 // extra rows rendered above/below the visible window

const _onWinScroll = () => { _winScrollY.value = window.scrollY }
const _onResize = () => { _viewport.value = window.innerHeight }
onMounted(() => {
  if (props.itemHeight) {
    window.addEventListener('scroll', _onWinScroll, { passive: true })
    window.addEventListener('resize', _onResize, { passive: true })
  }
})
onUnmounted(() => {
  window.removeEventListener('scroll', _onWinScroll)
  window.removeEventListener('resize', _onResize)
})

// Returns { start, end, total } for the visible row slice, or null when virtual scroll is off.
// Pre-mount (tbodyRef not yet set): limits first-render DOM creation to ~viewport rows from 0
// instead of mounting all N rows at once — this is the primary fix for initial-render lag.
const _vRange = computed(() => {
  if (!props.itemHeight || props.rows.length === 0) return null
  const total = props.rows.length
  const h = props.itemHeight
  const viewport = _viewport.value // reactive dep — recomputes on resize

  _winScrollY.value // reactive dep — recomputes on every scroll event

  if (!tbodyRef.value) {
    // Pre-mount: render first ceil(viewport/h) + buffer rows so the visible area is filled
    return { start: 0, end: Math.min(total, Math.ceil(viewport / h) + _VBUF * 2), total }
  }

  const el = ((tbodyRef.value as any).$el ?? tbodyRef.value) as HTMLElement
  if (!el?.getBoundingClientRect) return null

  // Pixels of the table that have scrolled above the viewport top
  const scrolledPast = Math.max(0, -el.getBoundingClientRect().top)
  const start = Math.max(0, Math.floor(scrolledPast / h) - _VBUF)
  const end = Math.min(total, start + Math.ceil(viewport / h) + _VBUF * 2)
  return { start, end, total }
})

// Heights of invisible rows above/below the rendered window — maintain correct scrollbar size
const _topSpacer = computed(() => (_vRange.value?.start ?? 0) * (props.itemHeight ?? 0))
const _bottomSpacer = computed(() =>
  ((_vRange.value?.total ?? 0) - (_vRange.value?.end ?? _vRange.value?.total ?? 0)) * (props.itemHeight ?? 0),
)

// Total column count for spacer <td> colspan
const _spacerColspan = computed(() =>
  props.fields.length + (props.draggable ? 1 : 0) + (props.selectable ? 1 : 0),
)

// #6: memoized cellCbClass — cache invalidates automatically when rows or the cb function change
const cachedCellCbClass = computed(() => {
  props.rows // reactive dependency: invalidates cache on row changes

  const cellCbClassFn = props.cellCbClass // reactive dependency: invalidates cache if cb changes
  const cache = new Map<string, string>()

  return (item: Record<string, unknown>, fieldKey: string): string => {
    const raw = (item as unknown as { raw?: Record<string, unknown> }).raw
    const id = (raw?.id as string | undefined) ?? JSON.stringify(raw)
    const cacheKey = `${id}::${fieldKey}`
    if (!cache.has(cacheKey))
      cache.set(cacheKey, cellCbClassFn(item, fieldKey))

    return cache.get(cacheKey)!
  }
})
</script>

<template>
  <VDataTable
    ref="cTable"
    :model-value="selectedItems"
    :show-select="selectable"
    :select-strategy="selectMode"
    :headers="actualHeadersTable"
    :items="rows"
    return-object
    class="c-table"
    :items-per-page="itemsPerPage"
    :density="small ? 'compact' : 'comfortable'"
    @update:model-value="onSelectRow"
  >
    <template #headers="{ columns, toggleSort, sortBy, someSelected, allSelected, selectAll }">
      <th
        v-if="draggable"
        class="pl-1 pr-0 c-table__header-cell"
        data-c-field="draggable"
        data-test-id="draggable-th"
      />
      <th
        v-if="props.selectable"
        class="c-table__header-cell pa-0"
        data-c-field="selectable"
        data-test-id="selectable-th"
      >
        <VSkeletonLoader
          v-if="isLoadingList"
          class="col-table-skeleton py-0 pr-0"
          :class="cellClasses"
          type="text"
        />
        <VCheckbox
          v-else
          :model-value="allSelected || someSelected"
          :indeterminate="allSelected ? false : someSelected"
          :disabled="isLoadingList"
          class="selectable-checkbox"
          data-test-id="select-all-checkbox"
          @update:model-value="selectAll"
        />
      </th>
      <template
        v-for="(column, index) in columns"
        :key="`c-table-cell_${index}_${column.key}`"
      >
        <th
          v-if="column.key !== 'data-table-select'"
          class="c-table__header-cell whitespace-no-wrap text-left cursor-pointer"
          :class="cellClasses"
          :data-test-id="`table-th-${column.key}`"
          :data-c-field="column.key"
          @click="isSortableColumn(column) && handleSorByField(column)"
        >
          <VSkeletonLoader
            v-show="isLoadingList"
            type="text"
            class="col-table-skeleton"
            data-test-id="skeleton-loader"
          />
          <div
            class="d-flex align-center c-table__header-title column-title"
            data-test-id="column-title"
            :class="{
              'justify-end': column.align === AlignType.Right,
              'justify-center': column.align === AlignType.Center,
              'gap-2': column.align,
              'justify-space-between': !column.align,
              'd-none': !isLoadingList,
            }"
            :style=" isLoadingList && `display: none !important`"
          >
            {{ column.title }}

            <div
              v-if="isSortableColumn(column)"
              class="c-table__header-cell-icon-wrapper"
              :class="{ small: props.small }"
              :data-test-id="`sort-col-${column.key}`"
            >
              <VIcon
                :icon="IconsList.ChevronUpIcon"
                class="d-block c-table__header-cell-icon"
                :data-test-id="`sort-icon-${SortDirection.desc}`"
                :class="{ 'c-table__header-cell-icon--active': isActiveSort(column.key, SortDirection.desc) }"
              />
              <VIcon
                :icon="IconsList.ChevronDownIcon"
                class="d-block c-table__header-cell-icon"
                :data-test-id="`sort-icon-${SortDirection.asc}`"
                :class="{ 'c-table__header-cell-icon--active': isActiveSort(column.key, SortDirection.asc) }"
              />
            </div>
          </div>
        </th>
      </template>
    </template>
    <template #tbody="{ items, select, toggleSelect, isSelected }">
      <tbody
        v-if="isLoadingList"
        data-test-id="tbody-skeleton"
      >
        <slot name="skeleton">
          <tr
            v-for="index in skeletonRows"
            :key="`skeleton-row_${index}`"
            data-test-id="skeleton-row"
          >
            <td
              v-if="props.selectable"
              class="c-table__cell"
              :class="cellClasses"
              data-c-field="selectable"
            >
              <VSkeletonLoader type="text" />
            </td>
            <td
              v-for="(field, cellIndex) in getActualField(fields)"
              :key="`skeleton-cell_${index}_${cellIndex}`"
              class="c-table__cell"
              data-test-id="skeleton-coll"
              :class="cellClasses"
              :data-c-field="field.key"
            >
              <VSkeletonLoader type="text" />
            </td>
          </tr>
        </slot>
      </tbody>
      <Component
        :is="tableWrapperComponent"
        v-else
        ref="tbodyRef"
        class="dragArea list-group w-full"
        :list="items"
        data-test-id="drag-area"
        tag="tbody"
        @change="onDragEnd"
      >
        <!-- #9: top spacer — represents rows above the virtual window -->
        <tr
          v-if="_topSpacer > 0"
          aria-hidden="true"
          style="pointer-events: none"
        >
          <td
            :colspan="_spacerColspan"
            :style="{ height: `${_topSpacer}px`, padding: '0', border: '0' }"
          />
        </tr>
        <!-- #8: v-memo skips VNode patching for rows whose memo deps haven't changed.
             eslint-disable is required because vue/no-useless-template-attributes does not
             list v-memo as a valid <template> attribute, even though Vue docs explicitly
             recommend combining v-memo with v-for on the same element. -->
        <!-- eslint-disable vue/no-useless-template-attributes -->
        <template
          v-for="(item, index) in (_vRange ? items.slice(_vRange.start, _vRange.end) : items)"
          :key="rowKey(item, (_vRange?.start ?? 0) + index)"
          v-memo="getMemoKey(item, isSelected([item]))"
        >
          <!-- Main row -->
          <tr
            class="c-table__row"
            data-test-id="table-row"
            :class="compareClasses(item.raw, isSelected([item]))"
            @click="onRowClicked(item.raw)"
          >
            <td
              v-if="draggable"
              class="pl-1 pr-0 c-table__cell"
              data-c-field="draggable"
              data-test-id="draggable-trigger"
            >
              <VIcon
                v-if="!isLoadingList"
                :icon="IconsList.DragVerticalIcon"
                class="dragging-icon"
              />
            </td>

            <td
              v-if="props.selectable"
              class="c-table__cell pa-0"
              data-c-field="selectable"
              data-test-id="selectable"
            >
              <VCheckbox
                :model-value="isSelected([item])"
                data-test-id="selectable-checkbox"
                :disabled="disabledSet.has(item.raw.id as string)"
                class="selectable-checkbox"
                @update:model-value="select([item], $event)"
                @click.stop
              />
            </td>

            <td
              v-for="field in fields"
              :key="`c-table-cell_${index}_${field.key}`"
              class="c-table__cell text-body-1 whitespace-no-wrap"
              :class="[cellClasses, cachedCellCbClass(item, field.key)]"
              :data-c-field="field.key"
            >
              <slot
                :name="`cell(${field.key})`"
                :field="field"
                :item="item"
                :cell="item.raw[field.key]"
                :toggle-expand="toggleExpand"
                :is-expanded="!!expandedMap[item.raw.id as string]"
              >
                {{ item.raw[field.key] }}
              </slot>
            </td>
          </tr>

          <!-- #2: v-if guards v-for — collapsed rows no longer iterate groups at all -->
          <template v-if="showExpand && expandedMap[item.raw.id as string]">
            <tr
              v-for="(raw, rawIndex) in item.raw?.groups"
              :key="`${item.raw.id}-expand-${(raw as Record<string, unknown>).id ?? rawIndex}`"
            >
              <!-- [START] Add for similar col and cell in table  -->
              <td v-if="props.selectable" />
              <td
                v-if="props.selectable"
                class="c-table-expand__cell"
                :class="{ 'c-table-cell-padding': !props.small, 'px-0': props.small }"
                data-c-expand-field="selectable"
              />
              <!-- [END] Add for similar col and cell in table -->
              <td
                v-for="field in fields"
                :key="`c-table-expand-cell_${index}_${field.key}`"
                class="c-table-expand__cell text-body-1 whitespace-no-wrap"
                :class="cellClasses"
                :data-c-expand-field="field.key"
              >
                <slot
                  :name="`cellExpand(${field.key})`"
                  :field="field"
                  :item="{ ...item, raw, value: raw }"
                  :cell="(raw as Record<string, unknown>)[field.key]"
                  :toggle-expand="toggleExpand"
                  :is-expanded="!!expandedMap[item.raw.id as string]"
                >
                  {{ (raw as Record<string, unknown>)[field.key] }}
                </slot>
              </td>
            </tr>
          </template>
        </template>
        <!-- eslint-enable vue/no-useless-template-attributes -->
        <!-- #9: bottom spacer — represents rows below the virtual window -->
        <tr
          v-if="_bottomSpacer > 0"
          aria-hidden="true"
          style="pointer-events: none"
        >
          <td
            :colspan="_spacerColspan"
            :style="{ height: `${_bottomSpacer}px`, padding: '0', border: '0' }"
          />
        </tr>
      </Component>

      <tr v-if="items.isEmpty && !isLoadingList">
        <td
          :colspan="emptyColspan"
          class="text-center text-body-1"
        >
          <slot name="empty" />
        </td>
      </tr>
    </template>
    <template #body />
    <template #bottom />
  </VDataTable>
</template>

<style scoped lang="scss">
.v-data-table.c-table {
  .c-table__header-cell {
    background: rgba(var(--v-theme-grey-800), 0.08);
    .column-title {
      color: rgb(var(--v-theme-grey-900), 0.62);
    }
  }

  .c-table__header-cell-icon-wrapper {
    position: relative;
    width: 1rem;
    height: 1.4rem;

    &.small {
      height: 1rem;

      .c-table__header-cell-icon {
        height: 0.5rem;
      }
    }
  }
  .c-table__header-cell-icon {
    opacity: 0.5;
    width: 0.7rem;
    height: 0.7rem;

    &--active {
      opacity: 1;
    }
  }
  .is-hover-row {
    &:hover {
      background: rgb(var(--v-theme-grey-100));
    }
  }
  .c-table__row {
    cursor: pointer;
    &--selected {
      background: rgb(var(--v-theme-grey-100));
    }
  }
  .c-table__header-cell,
  .c-table__cell {
    &[data-c-field='selectable'] {
      min-width: 3rem;
      width: 4.25rem;
    }
    &[data-c-field='draggable'] {
      width: 1.25rem;
      max-width: 1.25rem;
      .v-icon {
        font-size: 1rem;
      }
    }
  }

  .c-table-cell-padding {
    padding: 0.75rem 1rem;
  }

  .c-table-sm-cell-padding {
    padding: 0.5rem 0.75rem;
  }

  .c-table__cell{
    background-color: transparent;
    cursor: pointer;
  }
  :deep(.v-skeleton-loader__text) {
    margin-left: 0;
    margin-right: 0;
    border-radius: 0.25rem;
  }

  :deep(.v-data-table-header__content) {
    white-space: nowrap;
  }

  .c-table__row {
    &:hover {
      .dragging-icon {
        opacity: 1;
      }
    }
  }
  .dragging-icon {
    opacity: 0;
    transition: opacity 0.3s;
  }

  :deep(tbody) {
    td {
      height: var(--compact__c-table-td-height);

      .v-skeleton-loader {
        width: 90%;
      }
    }
  }

  th {
    height: var(--c-table-th-height);
  }

  :deep(.v-checkbox) {
    display: flex;
    justify-content: center;
  }
}

.col-table-skeleton {
  height: 1rem;
  background-color: initial !important;

  :deep(.v-skeleton-loader) {
    padding: 0;
    margin: 0;
  }
  :deep(.v-skeleton-loader__bone) {
    height: 12px !important;
    margin: 0;
    margin-inline: auto;
  }
}
</style>
