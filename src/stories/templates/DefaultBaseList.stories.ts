import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DefaultBaseList from '../../components/templates/BaseList/types/default.vue'
import { TableField, ListFieldType, ListSize, AlignType } from '../../@model/templates/tableFields'
import { FilterID } from '../../@model/filter'
import { FilterType } from '../../@model/filter'
import type { IBaseListConfig } from '../../@model/templates/baseList'
import { ExportFormat, SortDirection } from '../../@model/templates/baseList'
import { SelectMode } from '../../@model/enums/selectMode'
import { MultipleActions } from '../../@model/enums/multipleActions'
import { useFiltersStore } from '../../stores/filtersCore'
import { VColors } from '../../@model/vuetify'

/**
 * DefaultBaseList — universal data table used across the entire project.
 * It fetches data via `useList().useStore` (or `baseStoreCore` when no custom store is provided),
 * renders typed columns via `ListFieldType`, and supports search, filters, pagination,
 * sorting, sidebar, permissions, export, and drag-and-drop.
 *
 * In Storybook a mock store is provided via `useList` so no API calls are made.
 * `noPermissions: true` grants full access so all action buttons are visible.
 * `disableLoading: true` skips the skeleton loading state on mount.
 */

// ---------------------------------------------------------------------------
// Static items used across stories (covers all ListFieldType data shapes)
// ---------------------------------------------------------------------------
const ITEMS = [
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    name: 'Summer Jackpot Tournament',
    email: 'jackpot@example.com',
    status: { status: 'active', variant: VColors.Success },
    isActive: true,
    createdAt: '2025-01-08T09:14:22.000Z',
    uuid: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    uuidShort: 'f47ac10b',
    tags: [{ id: 't1', name: 'VIP' }, { id: 't2', name: 'Slots' }],
    position: 1,
    percent: 75,
    amount: 1500.50,
    currency: 'USD',
    remainder: 0,
    comment: 'High-priority campaign for summer season',
    period: { dateFrom: '2025-06-01T00:00:00.000Z', dateTo: '2025-08-31T23:59:59.000Z' },
    statement: true,
    groups: [
      { id: 'g1', name: 'Round 1' },
      { id: 'g2', name: 'Round 2' },
    ],
  },
  {
    id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    name: 'Weekly Reload Bonus',
    email: 'reload@example.com',
    status: { status: 'pending review', variant: VColors.Warning },
    isActive: false,
    createdAt: '2025-02-14T15:03:47.000Z',
    uuid: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    uuidShort: '6ba7b810',
    tags: [{ id: 't3', name: 'Bonus' }],
    position: 2,
    percent: 40,
    amount: 250.00,
    currency: 'EUR',
    remainder: 50,
    comment: 'Weekly recurring offer',
    period: { dateFrom: '2025-02-10T00:00:00.000Z', dateTo: '2025-02-17T23:59:59.000Z' },
    statement: false,
    groups: [],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'High Roller Cashback',
    email: 'highroller@example.com',
    status: { status: 'completed', variant: VColors.Info },
    isActive: true,
    createdAt: '2025-03-01T11:30:00.000Z',
    uuid: '550e8400-e29b-41d4-a716-446655440000',
    uuidShort: '550e8400',
    tags: [{ id: 't4', name: 'VIP' }, { id: 't5', name: 'Cashback' }, { id: 't6', name: 'High Roller' }],
    position: 3,
    percent: 20,
    amount: 5000.00,
    currency: 'USD',
    remainder: 1000,
    comment: null,
    period: { dateFrom: '2025-01-01T00:00:00.000Z', dateTo: '2025-12-31T23:59:59.000Z' },
    statement: false,
    groups: [{ id: 'g3', name: 'Elite' }],
  },
  {
    id: '3f2504e0-4f89-11d3-9a0c-0305e82c3301',
    name: 'Free Spins Friday',
    email: 'freespins@example.com',
    status: { status: 'scheduled', variant: VColors.Primary },
    isActive: false,
    createdAt: '2025-03-21T07:00:00.000Z',
    uuid: '3f2504e0-4f89-11d3-9a0c-0305e82c3301',
    uuidShort: '3f2504e0',
    tags: [{ id: 't7', name: 'Free Spins' }, { id: 't8', name: 'Slots' }],
    position: 4,
    percent: 100,
    amount: 0,
    currency: 'USD',
    remainder: 0,
    comment: 'Every Friday, limited to 50 free spins',
    period: { dateFrom: '2025-03-21T00:00:00.000Z', dateTo: '2025-03-21T23:59:59.000Z' },
    statement: false,
    groups: [],
  },
  {
    id: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
    name: 'New Player Welcome Pack',
    email: 'welcome@example.com',
    status: { status: 'active', variant: VColors.Success },
    isActive: true,
    createdAt: '2025-04-05T13:22:10.000Z',
    uuid: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
    uuidShort: 'a3bb189e',
    tags: [{ id: 't9', name: 'Welcome' }],
    position: 5,
    percent: 200,
    amount: 100.00,
    currency: 'GBP',
    remainder: 0,
    comment: 'First deposit bonus',
    period: { dateFrom: null, dateTo: null },
    statement: true,
    groups: [{ id: 'g4', name: 'Week 1' }, { id: 'g5', name: 'Week 2' }],
  },
  {
    id: 'c9bf9e57-1685-4c89-bafb-ff5af830be8a',
    name: 'Loyalty Points Exchange',
    email: 'loyalty@example.com',
    status: { status: 'suspended', variant: VColors.Error },
    isActive: false,
    createdAt: '2025-04-18T08:45:33.000Z',
    uuid: 'c9bf9e57-1685-4c89-bafb-ff5af830be8a',
    uuidShort: 'c9bf9e57',
    tags: [],
    position: 6,
    percent: 10,
    amount: 750.25,
    currency: 'EUR',
    remainder: 200,
    comment: 'Exchange loyalty points for real money',
    period: { dateFrom: '2025-04-01T00:00:00.000Z', dateTo: '2025-06-30T23:59:59.000Z' },
    statement: false,
    groups: [],
  },
  {
    id: 'e3d70483-d946-4168-be21-4b2cf3a66a5b',
    name: 'Live Casino Daily Drop',
    email: 'livecasino@example.com',
    status: { status: 'active', variant: VColors.Success },
    isActive: true,
    createdAt: '2025-05-10T16:55:00.000Z',
    uuid: 'e3d70483-d946-4168-be21-4b2cf3a66a5b',
    uuidShort: 'e3d70483',
    tags: [{ id: 't10', name: 'Live Casino' }, { id: 't11', name: 'Daily' }],
    position: 7,
    percent: 50,
    amount: 300.00,
    currency: 'USD',
    remainder: 0,
    comment: null,
    period: { dateFrom: '2025-05-10T00:00:00.000Z', dateTo: '2025-05-10T23:59:59.000Z' },
    statement: true,
    groups: [{ id: 'g6', name: 'Day 1' }],
  },
]

// ---------------------------------------------------------------------------
// Mock store factory — returns a store-like object without any API calls.
// ---------------------------------------------------------------------------
function makeMockStore(list: unknown[] = ITEMS, total: number = ITEMS.length) {
  let _list = [...list]
  return {
    fetchEntityList: async () => ({ list: _list, total }),
    deleteEntity: async ({ id }: { id: string }) => {
      _list = _list.filter((item: any) => item.id !== id)
    },
    multipleDeleteEntity: async () => {},
    updateEntity: async () => {},
    multipleUpdateEntity: async () => {},
    toggleStatusEntity: async () => {},
    fetchReport: async () => {},
  }
}

// ---------------------------------------------------------------------------
// useList factory
// ---------------------------------------------------------------------------
function makeUseList(
  store: ReturnType<typeof makeMockStore>,
  overrides: Partial<{
    entityName: string
    fields: TableField[]
    SideBarModel: new (...args: any[]) => any
    canUpdateCb: (item: any) => boolean
    canRemoveCb: (item: any) => boolean
  }> = {},
) {
  const baseFields = [
    new TableField({ key: 'name', title: 'Name', alwaysVisible: true }),
    new TableField({ key: 'status', title: 'Status', type: ListFieldType.Status }),
    new TableField({ key: 'isActive', title: 'Active', type: ListFieldType.PillStatus }),
    new TableField({ key: 'createdAt', title: 'Created At', type: ListFieldType.Date, sortable: true }),
    new TableField({ key: 'uuid', title: 'UUID', type: ListFieldType.Copy }),
    new TableField({ key: 'tags', title: 'Tags', type: ListFieldType.Badges }),
  ]
  return () => ({
    entityName: overrides.entityName ?? 'Demo',
    fields: overrides.fields ?? baseFields,
    ListFilterModel: FilterID,
    SideBarModel: overrides.SideBarModel,
    canUpdateCb: overrides.canUpdateCb,
    canRemoveCb: overrides.canRemoveCb,
    useStore: () => store as any,
  })
}

// ---------------------------------------------------------------------------
// Shared base config — the minimal working set for every story
// ---------------------------------------------------------------------------
const baseConfig: IBaseListConfig = {
  filterList: [],
  loadingEndpointArr: [],
  noPermissions: true,
  disableLoading: true,
  pagination: true,
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------
const meta = {
  title: 'Templates/DefaultBaseList',
  component: DefaultBaseList,
  tags: ['autodocs'],
  argTypes: {
    config: { control: false },
    useList: { control: false },
  },
} satisfies Meta<typeof DefaultBaseList>

export default meta
type Story = StoryObj<typeof meta>

// ============================================================
// 1. Basic data
// ============================================================

/**
 * Table populated with rows, covering Name, Status, PillStatus,
 * Date, Copy, and Badges column types.
 */
export const WithData: Story = {
  name: 'With Data',
  args: {
    config: baseConfig,
    useList: makeUseList(makeMockStore()),
  },
}

// ============================================================
// 2. Empty state
// ============================================================

/**
 * Table with no rows — shows the configured empty-state message.
 */
export const Empty: Story = {
  name: 'Empty State',
  args: {
    config: {
      ...baseConfig,
      emptyText: 'No campaigns found',
    },
    useList: makeUseList(makeMockStore([], 0)),
  },
}

// ============================================================
// 3. Search
// ============================================================

/**
 * Search bar enabled with a custom placeholder.
 * The mock store ignores the query and always returns the same rows,
 * but debounce, clear, and keyboard interactions all work.
 */
export const WithSearch: Story = {
  name: 'With Search',
  args: {
    config: {
      ...baseConfig,
      withSearch: true,
      searchPlaceholder: 'Search by name…',
    },
    useList: makeUseList(makeMockStore()),
  },
}

// ============================================================
// 4. All field types
// ============================================================

/**
 * One column per `ListFieldType` variant so you can verify rendering
 * of every cell renderer in a single story.
 */
export const AllFieldTypes: Story = {
  name: 'All Field Types',
  args: {
    config: {
      ...baseConfig,
      withSearch: false,
      withSettings: true,
    },
    useList: makeUseList(makeMockStore(), {
      fields: [
        new TableField({ key: 'name', title: 'Default text', alwaysVisible: true }),
        new TableField({ key: 'status', title: 'Status', type: ListFieldType.Status }),
        new TableField({ key: 'isActive', title: 'Pill Status', type: ListFieldType.PillStatus }),
        new TableField({ key: 'createdAt', title: 'Date', type: ListFieldType.Date }),
        new TableField({ key: 'createdAt', title: 'Date+Sec', type: ListFieldType.DateWithSeconds }),
        new TableField({ key: 'period', title: 'Period', type: ListFieldType.Period }),
        new TableField({ key: 'uuid', title: 'Copy', type: ListFieldType.Copy }),
        new TableField({ key: 'uuidShort', title: 'Copy Short', type: ListFieldType.CopyShort }),
        new TableField({ key: 'tags', title: 'Badges', type: ListFieldType.Badges }),
        new TableField({ key: 'comment', title: 'Comment', type: ListFieldType.Comment }),
        new TableField({ key: 'statement', title: 'Statement', type: ListFieldType.Statement }),
        new TableField({ key: 'percent', title: 'Percent', type: ListFieldType.Percent }),
        new TableField({ key: 'amount', title: 'Sum & Currency', type: ListFieldType.SumAndCurrency }),
        new TableField({ key: 'name', title: 'Button', type: ListFieldType.Button }),
      ],
    }),
  },
}

// ============================================================
// 5. Small / compact table
// ============================================================

/**
 * `small: true` reduces cell padding and font size — used in nested
 * pages or sidebars where vertical space is limited.
 */
export const Small: Story = {
  name: 'Small (Compact)',
  args: {
    config: {
      ...baseConfig,
      small: true,
    },
    useList: makeUseList(makeMockStore()),
  },
}

// ============================================================
// 6. Table settings (column visibility)
// ============================================================

/**
 * `withSettings: true` enables the column-picker dropdown (top-right corner).
 * Columns without `alwaysVisible` can be hidden/shown interactively.
 */
export const WithSettings: Story = {
  name: 'With Column Settings',
  args: {
    config: {
      ...baseConfig,
      withSettings: true,
    },
    useList: makeUseList(makeMockStore(), {
      fields: [
        new TableField({ key: 'name', title: 'Name', alwaysVisible: true }),
        new TableField({ key: 'status', title: 'Status', type: ListFieldType.Status }),
        new TableField({ key: 'isActive', title: 'Active', type: ListFieldType.PillStatus }),
        new TableField({ key: 'createdAt', title: 'Created At', type: ListFieldType.Date, sortable: true }),
        new TableField({ key: 'uuid', title: 'UUID', type: ListFieldType.Copy }),
        new TableField({ key: 'tags', title: 'Tags', type: ListFieldType.Badges }),
        new TableField({ key: 'email', title: 'Email', type: ListFieldType.Email }),
        new TableField({ key: 'comment', title: 'Comment', type: ListFieldType.Comment }),
      ],
    }),
  },
}

// ============================================================
// 7. Pagination — per-page controls
// ============================================================

/**
 * `pagination: true` + `withSettings: true` surfaces the per-page selector
 * and page links. `defaultPerPage: 3` means only 3 rows show initially.
 */
export const WithPagination: Story = {
  name: 'With Pagination',
  args: {
    config: {
      ...baseConfig,
      pagination: true,
      defaultPerPage: 3,
      withSettings: true,
      withIndependentPagination: true,
    },
    useList: makeUseList(makeMockStore()),
  },
}

// ============================================================
// 8. Top + bottom pagination
// ============================================================

/**
 * `withTopPagination: true` renders pagination controls both above and
 * below the table — handy for long lists where scrolling to the bottom is
 * inconvenient.
 */
export const WithTopPagination: Story = {
  name: 'Top + Bottom Pagination',
  args: {
    config: {
      ...baseConfig,
      pagination: true,
      defaultPerPage: 3,
      withTopPagination: true,
      withIndependentPagination: true,
    },
    useList: makeUseList(makeMockStore()),
  },
}

// ============================================================
// 9. Sortable columns
// ============================================================

/**
 * Columns marked `sortable: true` show sort indicators.
 * `staticSorts` pre-selects the initial sort (`createdAt desc`).
 * `saveSort: true` would persist the selection in localStorage across reloads.
 */
export const WithSorting: Story = {
  name: 'With Sorting',
  args: {
    config: {
      ...baseConfig,
      saveSort: false,
      staticSorts: { key: 'createdAt', order: SortDirection.desc },
    },
    useList: makeUseList(makeMockStore(), {
      fields: [
        new TableField({ key: 'name', title: 'Name', sortable: true, alwaysVisible: true }),
        new TableField({ key: 'status', title: 'Status', type: ListFieldType.Status, sortable: true }),
        new TableField({ key: 'isActive', title: 'Active', type: ListFieldType.PillStatus }),
        new TableField({ key: 'createdAt', title: 'Created At', type: ListFieldType.Date, sortable: true }),
        new TableField({ key: 'position', title: 'Position', sortable: true }),
      ],
    }),
  },
}

// ============================================================
// 10. Row selection — single
// ============================================================

/**
 * `selectable: true` + `selectMode: Single` adds a radio button per row.
 * Only one row can be selected at a time.
 */
export const SelectableSingle: Story = {
  name: 'Selectable — Single',
  args: {
    config: {
      ...baseConfig,
      selectable: true,
      selectMode: SelectMode.Single,
    },
    useList: makeUseList(makeMockStore()),
  },
}

// ============================================================
// 11. Row selection — multi + multiple actions
// ============================================================

/**
 * `selectable: true` + `selectMode: Page` adds checkboxes.
 * `withMultipleActions: true` shows the bulk-action bar (activate /
 * deactivate / delete) once at least one row is checked.
 */
export const WithMultipleActions: Story = {
  name: 'With Multiple Actions',
  args: {
    config: {
      ...baseConfig,
      selectable: true,
      selectMode: SelectMode.Page,
      withMultipleActions: true,
      withDeactivation: true,
    },
    useList: makeUseList(makeMockStore()),
  },
}

// ============================================================
// 12. Multiple actions — remove only
// ============================================================

/**
 * Passing a `MultipleActions` enum value instead of `true` restricts bulk
 * actions to "remove" only — no activate/deactivate toggles are shown.
 */
export const WithMultipleActionsRemoveOnly: Story = {
  name: 'Multiple Actions — Remove Only',
  args: {
    config: {
      ...baseConfig,
      selectable: true,
      selectMode: SelectMode.Page,
      withMultipleActions: MultipleActions.Remove,
    },
    useList: makeUseList(makeMockStore()),
  },
}

// ============================================================
// 13. Draggable rows
// ============================================================

/**
 * `draggable: true` adds drag handles. Reordering calls `updateEntity`
 * (mocked here to a no-op). Items need a numeric `position` field for
 * the order to make sense in a real app.
 */
export const Draggable: Story = {
  name: 'Draggable Rows',
  args: {
    config: {
      ...baseConfig,
      draggable: true,
      withSearch: false,
      withCustomDrag: true,
    },
    useList: makeUseList(makeMockStore(), {
      fields: [
        new TableField({ key: 'position', title: '#', type: ListFieldType.Priority, size: ListSize.SM }),
        new TableField({ key: 'name', title: 'Name', alwaysVisible: true }),
        new TableField({ key: 'status', title: 'Status', type: ListFieldType.Status }),
        new TableField({ key: 'isActive', title: 'Active', type: ListFieldType.PillStatus }),
      ],
    }),
  },
}

// ============================================================
// 14. Export
// ============================================================

/**
 * `withExport: true` shows the export-format selector button in the toolbar.
 * `formatOfExports` limits available formats to JSON and CSV.
 * The mock store's `fetchReport` is a no-op so nothing actually downloads.
 */
export const WithExport: Story = {
  name: 'With Export',
  args: {
    config: {
      ...baseConfig,
      withExport: true,
      formatOfExports: [ExportFormat.JSON, ExportFormat.CSV, ExportFormat.XLSX],
    },
    useList: makeUseList(makeMockStore()),
  },
}

// ============================================================
// 15. Inline filters (embedded in the toolbar)
// ============================================================

/**
 * `inlineFilters` embeds filter fields directly in the toolbar row instead
 * of an expandable filter panel. The mock store ignores the filter payload.
 */
export const WithInlineFilters: Story = {
  name: 'With Inline Filters',
  args: {
    config: {
      ...baseConfig,
      inlineFilters: [
        { type: FilterType.Status, key: 'status' },
      ],
    },
    useList: makeUseList(makeMockStore()),
  },
}

// ============================================================
// 16. Filter panel (sidebar toggle)
// ============================================================

/**
 * `filterList` populates the collapsible filter panel revealed by the
 * "Filters" button in the toolbar. Filter state is stored in Pinia's
 * `filtersCore` store. The mock store ignores applied filters.
 */
const withFiltersStoreDecorator = () => {
  useFiltersStore().$patch({ defaultFilters: [{ type: '__storybook__', fields: [] }] })
  return { template: '<story />' }
}

export const WithFilterPanel: Story = {
  name: 'With Filter Panel',
  decorators: [withFiltersStoreDecorator],
  args: {
    config: {
      ...baseConfig,
      filterList: [
        { type: FilterType.Status, key: 'status' },
        { type: FilterType.Date, key: 'createdAt' },
      ],
      withSearch: true,
    },
    useList: makeUseList(makeMockStore()),
  },
}

// ============================================================
// 17. Actions column (item-level edit / delete / copy)
// ============================================================

/**
 * Adding a `TableField` with `key: 'actions'` activates per-row action
 * buttons (edit, remove, copy-from). Visibility of each button is driven
 * by `canUpdate` / `canRemove` permissions from `noPermissions: true`.
 *
 * Note: "Edit" and "Card" links require matching named routes in the router.
 * In Storybook only the "Delete" confirmation is functional.
 */
export const WithActionsColumn: Story = {
  name: 'With Actions Column',
  args: {
    config: {
      ...baseConfig,
      withDeactivation: true,
      withRemoveModal: true,
    },
    useList: makeUseList(makeMockStore(), {
      fields: [
        new TableField({ key: 'name', title: 'Name', alwaysVisible: true }),
        new TableField({ key: 'status', title: 'Status', type: ListFieldType.Status }),
        new TableField({ key: 'isActive', title: 'Active', type: ListFieldType.PillStatus }),
        new TableField({ key: 'createdAt', title: 'Created At', type: ListFieldType.Date }),
        new TableField({ key: 'actions', title: '', alwaysVisible: true }),
      ],
    }),
  },
}

// ============================================================
// 18. Remove with comment
// ============================================================

/**
 * `withRemoveComment: true` adds a free-text "reason" field inside the
 * remove-confirmation modal. The comment is forwarded to `deleteEntity`
 * as the `comment` parameter.
 */
export const WithRemoveComment: Story = {
  name: 'Remove with Comment',
  args: {
    config: {
      ...baseConfig,
      withRemoveModal: true,
      withRemoveComment: true,
    },
    useList: makeUseList(makeMockStore(), {
      fields: [
        new TableField({ key: 'name', title: 'Name', alwaysVisible: true }),
        new TableField({ key: 'status', title: 'Status', type: ListFieldType.Status }),
        new TableField({ key: 'actions', title: '', alwaysVisible: true }),
      ],
    }),
  },
}

// ============================================================
// 19. Row hover disabled
// ============================================================

/**
 * `hover: false` removes the highlight applied to a row on mouse-over.
 * Useful when rows are styled via `cellCbClass` and the default hover
 * colour would clash.
 */
export const NoHover: Story = {
  name: 'No Row Hover',
  args: {
    config: {
      ...baseConfig,
      hover: false,
    },
    useList: makeUseList(makeMockStore()),
  },
}

// ============================================================
// 20. Expandable rows (showExpand)
// ============================================================

/**
 * `showExpand: true` adds an expand chevron on each row.
 * The expanded content is projected via the `#empty` / cell-expand slots;
 * here no slot is provided so the expanded area is empty by default.
 * In production you fill it with a nested table or a summary component.
 */
export const ShowExpand: Story = {
  name: 'Expandable Rows',
  args: {
    config: {
      ...baseConfig,
      showExpand: true,
    },
    useList: makeUseList(makeMockStore(), {
      fields: [
        new TableField({ key: 'name', title: 'Name', alwaysVisible: true }),
        new TableField({ key: 'status', title: 'Status', type: ListFieldType.Status }),
        new TableField({ key: 'tags', title: 'Tags', type: ListFieldType.Badges }),
      ],
    }),
  },
}

// ============================================================
// 21. Hide search block
// ============================================================

/**
 * `hideSearchBlock: true` collapses the entire top bar (search input,
 * filter toggle, export button, create button). Useful when the list is
 * embedded inside a parent component that provides its own controls.
 */
export const HideSearchBlock: Story = {
  name: 'Hide Search Block',
  args: {
    config: {
      ...baseConfig,
      hideSearchBlock: true,
      pagination: true,
      defaultPerPage: 4,
      withIndependentPagination: true,
    },
    useList: makeUseList(makeMockStore()),
  },
}

// ============================================================
// 22. Skeleton loading state
// ============================================================

/**
 * Without `disableLoading: true` the table shows a skeleton while the
 * mock fetch resolves. The fetch is deliberately slowed to 1.5 s so the
 * skeleton is visible before the rows appear.
 *
 * `skeletonRows / skeletonCols` control skeleton dimensions.
 */
export const LoadingSkeleton: Story = {
  name: 'Loading Skeleton',
  args: {
    config: {
      ...baseConfig,
      disableLoading: false,
      skeletonRows: 5,
      skeletonCols: 4,
    },
    useList: (() => {
      const slowStore = {
        fetchEntityList: () =>
          new Promise(resolve =>
            setTimeout(() => resolve({ list: ITEMS, total: ITEMS.length }), 1500),
          ),
        deleteEntity: async () => {},
        multipleDeleteEntity: async () => {},
        updateEntity: async () => {},
        multipleUpdateEntity: async () => {},
        toggleStatusEntity: async () => {},
        fetchReport: async () => {},
      }
      return () => ({
        entityName: 'Demo',
        fields: [
          new TableField({ key: 'name', title: 'Name', alwaysVisible: true }),
          new TableField({ key: 'status', title: 'Status', type: ListFieldType.Status }),
          new TableField({ key: 'isActive', title: 'Active', type: ListFieldType.PillStatus }),
          new TableField({ key: 'createdAt', title: 'Created At', type: ListFieldType.Date }),
        ],
        ListFilterModel: FilterID,
        useStore: () => slowStore as any,
      })
    })(),
  },
}

// ============================================================
// 23. Custom cell class callback
// ============================================================

/**
 * `cellCbClass` receives `(field, item)` and returns a CSS class string.
 * Here inactive rows are highlighted in amber and `pending_review` rows
 * in red so problem items are immediately visible.
 */
export const WithCellClass: Story = {
  name: 'Custom Cell Class (cellCbClass)',
  args: {
    config: {
      ...baseConfig,
      cellCbClass: (_field: any, item: any) => {
        if (!item.isActive) return 'text-warning'
        if (item.status?.status?.includes('pending')) return 'text-error'
        return ''
      },
    },
    useList: makeUseList(makeMockStore()),
  },
}

// ============================================================
// 24. Aligned & sized columns
// ============================================================

/**
 * `align` controls horizontal text alignment per column.
 * `size` (`sm` / `md` / `full`) controls column width.
 */
export const ColumnAlignAndSize: Story = {
  name: 'Column Align & Size',
  args: {
    config: {
      ...baseConfig,
      withSettings: true,
    },
    useList: makeUseList(makeMockStore(), {
      fields: [
        new TableField({ key: 'name', title: 'Name (left)', align: AlignType.Left, size: ListSize.FULL, alwaysVisible: true }),
        new TableField({ key: 'percent', title: 'Percent (center)', type: ListFieldType.Percent, align: AlignType.Center, size: ListSize.SM }),
        new TableField({ key: 'amount', title: 'Amount (right)', type: ListFieldType.SumAndCurrency, align: AlignType.Right, size: ListSize.MD }),
        new TableField({ key: 'createdAt', title: 'Created', type: ListFieldType.Date, align: AlignType.Center }),
        new TableField({ key: 'isActive', title: 'Active', type: ListFieldType.PillStatus, align: AlignType.Center, size: ListSize.SM }),
      ],
    }),
  },
}

// ============================================================
// 25. Static filters (always-on server-side filter)
// ============================================================

/**
 * `staticFilters` are merged into every API request — the user never sees
 * them in the UI. Here `type: 'tournament'` is always sent, simulating a
 * page that is pre-filtered to a single entity category.
 */
export const WithStaticFilters: Story = {
  name: 'With Static Filters',
  args: {
    config: {
      ...baseConfig,
      staticFilters: { type: 'tournament', isActive: true },
    },
    useList: makeUseList(makeMockStore(ITEMS.filter(i => i.isActive))),
  },
}

// ============================================================
// 26. Kitchen Sink — everything enabled
// ============================================================

/**
 * All major features active at once: search, filter panel, inline filter,
 * column settings, pagination, sorting, row selection, multiple actions,
 * export, hover, and the actions column.
 *
 * Use this story to spot visual regressions across layout changes.
 */
export const KitchenSink: Story = {
  name: 'Kitchen Sink (All Features)',
  decorators: [withFiltersStoreDecorator],
  args: {
    config: {
      ...baseConfig,
      withSearch: true,
      searchPlaceholder: 'Search…',
      withSettings: true,
      pagination: true,
      defaultPerPage: 5,
      withIndependentPagination: true,
      withTopPagination: true,
      selectable: true,
      selectMode: SelectMode.Page,
      withMultipleActions: true,
      withDeactivation: true,
      withExport: true,
      formatOfExports: [ExportFormat.JSON, ExportFormat.CSV, ExportFormat.XLSX],
      filterList: [
        { type: FilterType.Status, key: 'status' },
        { type: FilterType.Date, key: 'createdAt' },
      ],
      withRemoveModal: true,
      withRemoveComment: true,
      saveSort: false,
      hover: true,
    },
    useList: makeUseList(makeMockStore(), {
      fields: [
        new TableField({ key: 'name', title: 'Name', alwaysVisible: true, sortable: true }),
        new TableField({ key: 'status', title: 'Status', type: ListFieldType.Status }),
        new TableField({ key: 'isActive', title: 'Active', type: ListFieldType.PillStatus }),
        new TableField({ key: 'createdAt', title: 'Created', type: ListFieldType.Date, sortable: true }),
        new TableField({ key: 'tags', title: 'Tags', type: ListFieldType.Badges }),
        new TableField({ key: 'percent', title: '%', type: ListFieldType.Percent, size: ListSize.SM, align: AlignType.Center }),
        new TableField({ key: 'uuid', title: 'ID', type: ListFieldType.Copy }),
        new TableField({ key: 'comment', title: 'Comment', type: ListFieldType.Comment }),
        new TableField({ key: 'actions', title: '', alwaysVisible: true }),
      ],
    }),
  },
}
