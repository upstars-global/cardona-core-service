import { computed } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DefaultBaseList from '../../components/templates/BaseList/types/default.vue'
import { TableField, ListFieldType, ListSize, AlignType } from '../../@model/templates/tableFields'
import { FilterID } from '../../@model/filter'
import { FilterType } from '../../@model/filter'
import type { IBaseListConfig } from '../../@model/templates/baseList'
import { ExportFormat, ProjectsFilterMode, SortDirection } from '../../@model/templates/baseList'
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
 *
 * All `IBaseListConfig` fields are exposed as individual controls in the Controls panel.
 * Switch to any story and adjust values live — the table re-renders immediately.
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
// Decorator: pre-patch filtersCore store so fetchDefaultFilters skips the API
// ---------------------------------------------------------------------------
const withFiltersStoreDecorator = () => {
  useFiltersStore().$patch({ defaultFilters: [{ type: '__storybook__', fields: [] }] })
  return { template: '<story />' }
}

// ---------------------------------------------------------------------------
// Meta — all IBaseListConfig fields exposed as individual Storybook controls
// ---------------------------------------------------------------------------
const meta = {
  title: 'Templates/DefaultBaseList',
  component: DefaultBaseList,
  tags: ['autodocs'],

  /**
   * The render function extracts `useList` from args and passes the remaining
   * fields directly as the `config` prop. Every IBaseListConfig field is a
   * top-level arg, so controls update the table live without reloading the story.
   */
  render: (args: any) => ({
    components: { DefaultBaseList },
    setup() {
      const config = computed<IBaseListConfig>(() => ({
        withSearch: args.withSearch,
        withDeactivation: args.withDeactivation,
        withDeactivationBySpecificAction: args.withDeactivationBySpecificAction,
        withSettings: args.withSettings,
        emptyText: args.emptyText,
        filterList: args.filterList,
        staticFilters: args.staticFilters,
        withProjectsFilter: args.withProjectsFilter,
        projectsFilterMode: args.projectsFilterMode,
        staticSorts: args.staticSorts,
        selectMode: args.selectMode,
        selectable: args.selectable,
        small: args.small,
        draggable: args.draggable,
        defaultPerPage: args.defaultPerPage,
        withIndependentPagination: args.withIndependentPagination,
        searchPlaceholder: args.searchPlaceholder,
        withExport: args.withExport,
        formatOfExports: args.formatOfExports,
        maxExportItems: args.maxExportItems,
        withMultipleActions: args.withMultipleActions,
        sidebar: args.sidebar,
        cbShowSidebar: args.cbShowSidebar,
        sidebarCollapseMode: args.sidebarCollapseMode,
        isShowYou: args.isShowYou,
        isShowUpdatePassword: args.isShowUpdatePassword,
        onePermissionKey: args.onePermissionKey,
        withRemoveComment: args.withRemoveComment,
        withRemoveModal: args.withRemoveModal,
        createFromCopy: args.createFromCopy,
        withCustomDrag: args.withCustomDrag,
        pagination: args.pagination,
        withCreateBtn: args.withCreateBtn,
        withCustomFetchList: args.withCustomFetchList,
        withCustomDelete: args.withCustomDelete,
        noPermissionPrefix: args.noPermissionPrefix,
        permissionKey: args.permissionKey,
        customApiPrefix: args.customApiPrefix,
        customPermissionPrefix: args.customPermissionPrefix,
        hover: args.hover,
        skeletonRows: args.skeletonRows,
        skeletonCols: args.skeletonCols,
        loadingOnlyByList: args.loadingOnlyByList,
        loadingEndpointArr: args.loadingEndpointArr,
        hideSearchBlock: args.hideSearchBlock,
        closeFilterOnPagination: args.closeFilterOnPagination,
        showExpand: args.showExpand,
        withTopPagination: args.withTopPagination,
        saveSort: args.saveSort,
        disableLoading: args.disableLoading,
        cancelPreviousRequest: args.cancelPreviousRequest,
        cellCbClass: args.cellCbClass,
        noPermissions: args.noPermissions,
        inlineFilters: args.inlineFilters,
        copyForAllProjects: args.copyForAllProjects,
      }))
      return { config, useList: args.useList }
    },
    template: '<DefaultBaseList :config="config" :use-list="useList" />',
  }),

  argTypes: {
    // ── Toolbar ─────────────────────────────────────────────────────────────
    withSearch: {
      control: 'boolean',
      description: 'Show the search input in the toolbar',
      table: { category: 'Toolbar', defaultValue: { summary: 'false' } },
    },
    searchPlaceholder: {
      control: 'text',
      description: 'Placeholder text for the search input',
      table: { category: 'Toolbar' },
    },
    withSettings: {
      control: 'boolean',
      description: 'Show the column-picker dropdown (column visibility toggles)',
      table: { category: 'Toolbar', defaultValue: { summary: 'false' } },
    },
    hideSearchBlock: {
      control: 'boolean',
      description: 'Hide the entire top bar — search input, filter toggle, and create button',
      table: { category: 'Toolbar', defaultValue: { summary: 'false' } },
    },
    withCreateBtn: {
      control: 'boolean',
      description: 'Show the "Create" button in the toolbar (requires a matching named route)',
      table: { category: 'Toolbar', defaultValue: { summary: 'true' } },
    },
    withExport: {
      control: 'boolean',
      description: 'Show the export-format selector button',
      table: { category: 'Toolbar', defaultValue: { summary: 'false' } },
    },
    formatOfExports: {
      control: 'object',
      description: `Available export formats — array of ExportFormat values: "${Object.values(ExportFormat).join('", "')}"`,
      table: { category: 'Toolbar', defaultValue: { summary: '[json, csv]' } },
    },
    maxExportItems: {
      control: 'number',
      description: 'Maximum number of rows included in each export',
      table: { category: 'Toolbar' },
    },

    // ── Filters ─────────────────────────────────────────────────────────────
    filterList: {
      control: 'object',
      description: 'Array of FilterListItem — populates the collapsible filter panel (requires withFiltersStoreDecorator in Storybook)',
      table: { category: 'Filters', defaultValue: { summary: '[]' } },
    },
    inlineFilters: {
      control: 'object',
      description: 'Filter fields embedded directly in the toolbar row instead of the panel',
      table: { category: 'Filters', defaultValue: { summary: '[]' } },
    },
    staticFilters: {
      control: 'object',
      description: 'Filters always merged into every API request — invisible to the user',
      table: { category: 'Filters', defaultValue: { summary: '{}' } },
    },
    withProjectsFilter: {
      control: 'boolean',
      description: 'Show the project filter dropdown',
      table: { category: 'Filters', defaultValue: { summary: 'false' } },
    },
    projectsFilterMode: {
      control: 'select',
      options: Object.values(ProjectsFilterMode),
      description: `Pre-selected project scope: "${ProjectsFilterMode.Current}" = current project only, "${ProjectsFilterMode.All}" = all projects`,
      table: { category: 'Filters', defaultValue: { summary: ProjectsFilterMode.Current } },
    },

    // ── Layout ──────────────────────────────────────────────────────────────
    small: {
      control: 'boolean',
      description: 'Compact table variant with reduced cell padding and font size',
      table: { category: 'Layout', defaultValue: { summary: 'false' } },
    },
    hover: {
      control: 'boolean',
      description: 'Highlight the hovered row',
      table: { category: 'Layout', defaultValue: { summary: 'true' } },
    },
    showExpand: {
      control: 'boolean',
      description: 'Show an expand chevron per row — expanded content comes from the `groups` data field',
      table: { category: 'Layout', defaultValue: { summary: 'false' } },
    },
    emptyText: {
      control: 'text',
      description: 'Message displayed in the empty-state area when the list has no rows',
      table: { category: 'Layout' },
    },
    cellCbClass: {
      control: false,
      description: 'Callback `(field, item) => string` — returns a CSS class applied to every matching cell',
      table: { category: 'Layout' },
    },

    // ── Pagination ───────────────────────────────────────────────────────────
    pagination: {
      control: 'boolean',
      description: 'Show pagination controls below (and optionally above) the table',
      table: { category: 'Pagination', defaultValue: { summary: 'true' } },
    },
    defaultPerPage: {
      control: 'number',
      description: 'Initial number of rows per page',
      table: { category: 'Pagination' },
    },
    withIndependentPagination: {
      control: 'boolean',
      description: 'Allow the per-page selector to be changed independently per list',
      table: { category: 'Pagination', defaultValue: { summary: 'false' } },
    },
    withTopPagination: {
      control: 'boolean',
      description: 'Render pagination controls above the table in addition to the standard bottom controls',
      table: { category: 'Pagination', defaultValue: { summary: 'false' } },
    },
    closeFilterOnPagination: {
      control: 'boolean',
      description: 'Close the filter panel automatically when the user changes the page',
      table: { category: 'Pagination', defaultValue: { summary: 'false' } },
    },

    // ── Sorting ──────────────────────────────────────────────────────────────
    saveSort: {
      control: 'boolean',
      description: 'Persist the active sort column and direction in localStorage',
      table: { category: 'Sorting', defaultValue: { summary: 'true' } },
    },
    staticSorts: {
      control: 'object',
      description: 'Pre-selected sort: `{ key: string, order: "asc" | "desc" }` — applied on initial load',
      table: { category: 'Sorting' },
    },

    // ── Selection ────────────────────────────────────────────────────────────
    selectable: {
      control: 'boolean',
      description: 'Enable row selection (radio buttons for Single, checkboxes for Page/All)',
      table: { category: 'Selection', defaultValue: { summary: 'false' } },
    },
    selectMode: {
      control: 'select',
      options: Object.values(SelectMode),
      description: `Row selection mode: "${SelectMode.Single}" = one row, "${SelectMode.Page}" = current page, "${SelectMode.All}" = all pages`,
      table: { category: 'Selection', defaultValue: { summary: SelectMode.Page } },
    },

    // ── Actions ──────────────────────────────────────────────────────────────
    withMultipleActions: {
      control: 'select',
      options: [undefined, true, false, MultipleActions.Remove, MultipleActions.ToggleStatus],
      description: `Bulk-action bar: true = all actions, "${MultipleActions.Remove}" = remove only, "${MultipleActions.ToggleStatus}" = toggle status only, false = disabled`,
      table: { category: 'Actions', defaultValue: { summary: 'false' } },
    },
    withDeactivation: {
      control: 'boolean',
      description: 'Show activate/deactivate toggle in the per-row actions column',
      table: { category: 'Actions', defaultValue: { summary: 'false' } },
    },
    withDeactivationBySpecificAction: {
      control: 'boolean',
      description: 'Route the activate/deactivate call through a dedicated store action',
      table: { category: 'Actions', defaultValue: { summary: 'false' } },
    },
    withRemoveModal: {
      control: 'boolean',
      description: 'Show a confirmation dialog before deleting a row',
      table: { category: 'Actions', defaultValue: { summary: 'false' } },
    },
    withRemoveComment: {
      control: 'boolean',
      description: 'Add a "reason" textarea inside the remove confirmation dialog',
      table: { category: 'Actions', defaultValue: { summary: 'false' } },
    },
    createFromCopy: {
      control: 'boolean',
      description: 'Show a "Duplicate" action button per row',
      table: { category: 'Actions', defaultValue: { summary: 'false' } },
    },
    copyForAllProjects: {
      control: 'boolean',
      description: 'Duplicate action replicates the entity across all projects',
      table: { category: 'Actions', defaultValue: { summary: 'false' } },
    },

    // ── Drag & Drop ──────────────────────────────────────────────────────────
    draggable: {
      control: 'boolean',
      description: 'Enable drag-and-drop row reordering via drag handles',
      table: { category: 'Drag & Drop', defaultValue: { summary: 'false' } },
    },
    withCustomDrag: {
      control: 'boolean',
      description: 'Skip the default `updateEntity` API call on drag end — emits `@end` instead so the parent can handle reordering',
      table: { category: 'Drag & Drop', defaultValue: { summary: 'false' } },
    },

    // ── Sidebar ──────────────────────────────────────────────────────────────
    sidebar: {
      control: 'boolean',
      description: 'Enable the detail sidebar panel (requires `SideBarModel` in useList)',
      table: { category: 'Sidebar', defaultValue: { summary: 'false' } },
    },
    sidebarCollapseMode: {
      control: 'boolean',
      description: 'Render sidebar sections as collapsible accordion panels',
      table: { category: 'Sidebar', defaultValue: { summary: 'false' } },
    },
    cbShowSidebar: {
      control: false,
      description: 'Callback fired before the sidebar opens — can cancel the open by returning false',
      table: { category: 'Sidebar' },
    },

    // ── Loading ──────────────────────────────────────────────────────────────
    disableLoading: {
      control: 'boolean',
      description: 'Skip the skeleton loading state entirely — data appears immediately',
      table: { category: 'Loading', defaultValue: { summary: 'false' } },
    },
    skeletonRows: {
      control: 'number',
      description: 'Number of skeleton placeholder rows shown while loading',
      table: { category: 'Loading' },
    },
    skeletonCols: {
      control: 'number',
      description: 'Number of skeleton placeholder columns shown while loading',
      table: { category: 'Loading' },
    },
    loadingOnlyByList: {
      control: 'boolean',
      description: 'Show skeleton only while the list-fetch request is in-flight (not other endpoints)',
      table: { category: 'Loading', defaultValue: { summary: 'false' } },
    },
    loadingEndpointArr: {
      control: 'object',
      description: 'Additional API endpoint URLs to watch — skeleton shows while any of them is pending',
      table: { category: 'Loading', defaultValue: { summary: '[]' } },
    },
    cancelPreviousRequest: {
      control: 'boolean',
      description: 'Cancel the previous in-flight list request when a new one starts (⚠ do not enable if two lists with the same entityName can be mounted simultaneously)',
      table: { category: 'Loading', defaultValue: { summary: 'false' } },
    },

    // ── Permissions ──────────────────────────────────────────────────────────
    noPermissions: {
      control: 'boolean',
      description: 'Bypass all permission checks — all action buttons are shown regardless of user role',
      table: { category: 'Permissions', defaultValue: { summary: 'false' } },
    },
    permissionKey: {
      control: 'text',
      description: 'Custom permission key that overrides the auto-derived key for this list',
      table: { category: 'Permissions' },
    },
    onePermissionKey: {
      control: 'text',
      description: 'Single permission key applied to create, update, and delete operations',
      table: { category: 'Permissions' },
    },
    noPermissionPrefix: {
      control: 'boolean',
      description: 'Omit the project-level prefix from permission key lookup',
      table: { category: 'Permissions', defaultValue: { summary: 'false' } },
    },
    customPermissionPrefix: {
      control: 'text',
      description: 'Custom prefix prepended to all permission keys for this list',
      table: { category: 'Permissions' },
    },

    // ── API ──────────────────────────────────────────────────────────────────
    customApiPrefix: {
      control: 'text',
      description: 'Custom API namespace prefix, e.g. "App.V2." — overrides the default entity prefix',
      table: { category: 'API' },
    },
    withCustomFetchList: {
      control: 'boolean',
      description: 'Delegate the list fetch to a custom fetchList action in the store module',
      table: { category: 'API', defaultValue: { summary: 'false' } },
    },
    withCustomDelete: {
      control: 'boolean',
      description: 'Delegate deletion to a custom delete action in the store module',
      table: { category: 'API', defaultValue: { summary: 'false' } },
    },

    // ── Users ─────────────────────────────────────────────────────────────────
    isShowYou: {
      control: 'boolean',
      description: 'Highlight the currently logged-in admin in the user list with a "You" badge',
      table: { category: 'Users', defaultValue: { summary: 'false' } },
    },
    isShowUpdatePassword: {
      control: 'boolean',
      description: 'Show the "Change password" field inside the user row',
      table: { category: 'Users', defaultValue: { summary: 'false' } },
    },

    // ── Data (not a config field) ─────────────────────────────────────────────
    useList: {
      control: false,
      description: 'Factory `() => UseListType` — provides entityName, fields, and the mock store. Not editable via controls.',
      table: { disable: true },
    },
  },

  args: {
    // Storybook-safe defaults (override component constructor defaults where needed)
    noPermissions: true,        // show all action buttons
    disableLoading: true,       // skip skeleton — show data immediately
    pagination: true,
    hover: true,
    saveSort: false,            // don't pollute localStorage during development
    filterList: [],
    loadingEndpointArr: [],
    formatOfExports: [ExportFormat.JSON, ExportFormat.CSV],
    selectMode: SelectMode.Page,
    useList: makeUseList(makeMockStore()),
  },
} satisfies Meta<any>

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
    emptyText: 'No campaigns found',
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
    withSearch: true,
    searchPlaceholder: 'Search by name…',
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
    withSearch: false,
    withSettings: true,
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
    small: true,
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
    withSettings: true,
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
    defaultPerPage: 3,
    withSettings: true,
    withIndependentPagination: true,
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
    defaultPerPage: 3,
    withTopPagination: true,
    withIndependentPagination: true,
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
    staticSorts: { key: 'createdAt', order: SortDirection.desc },
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
    selectable: true,
    selectMode: SelectMode.Single,
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
    selectable: true,
    selectMode: SelectMode.Page,
    withMultipleActions: true,
    withDeactivation: true,
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
    selectable: true,
    selectMode: SelectMode.Page,
    withMultipleActions: MultipleActions.Remove,
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
    draggable: true,
    withSearch: false,
    withCustomDrag: true,
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
    withExport: true,
    formatOfExports: [ExportFormat.JSON, ExportFormat.CSV, ExportFormat.XLSX],
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
    inlineFilters: [
      { type: FilterType.Status, key: 'status' },
    ],
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
export const WithFilterPanel: Story = {
  name: 'With Filter Panel',
  decorators: [withFiltersStoreDecorator],
  args: {
    filterList: [
      { type: FilterType.Status, key: 'status' },
      { type: FilterType.Date, key: 'createdAt' },
    ],
    withSearch: true,
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
    withDeactivation: true,
    withRemoveModal: true,
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
    withRemoveModal: true,
    withRemoveComment: true,
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
    hover: false,
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
    showExpand: true,
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
    hideSearchBlock: true,
    defaultPerPage: 4,
    withIndependentPagination: true,
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
    disableLoading: false,
    skeletonRows: 5,
    skeletonCols: 4,
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
    cellCbClass: (_field: any, item: any) => {
      if (!item.isActive) return 'text-warning'
      if (item.status?.status?.includes('pending')) return 'text-error'
      return ''
    },
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
    withSettings: true,
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
    staticFilters: { type: 'tournament', isActive: true },
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
    withSearch: true,
    searchPlaceholder: 'Search…',
    withSettings: true,
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
    hover: true,
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
