import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DefaultBaseList from '../../components/templates/BaseList/types/default.vue'
import { TableField, ListFieldType } from '../../@model/templates/tableFields'
import { FilterID } from '../../@model/filter'
import type { IBaseListConfig } from '../../@model/templates/baseList'

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
// Static items used across stories
// ---------------------------------------------------------------------------
const ITEMS = [
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    name: 'Summer Jackpot Tournament',
    status: 'active',
    isActive: true,
    createdAt: '2025-01-08T09:14:22.000Z',
    uuid: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    tags: [
      { id: 't1', name: 'VIP' },
      { id: 't2', name: 'Slots' },
    ],
  },
  {
    id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    name: 'Weekly Reload Bonus',
    status: 'pending_review',
    isActive: false,
    createdAt: '2025-02-14T15:03:47.000Z',
    uuid: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    tags: [{ id: 't3', name: 'Bonus' }],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'High Roller Cashback',
    status: 'completed',
    isActive: true,
    createdAt: '2025-03-01T11:30:00.000Z',
    uuid: '550e8400-e29b-41d4-a716-446655440000',
    tags: [
      { id: 't4', name: 'VIP' },
      { id: 't5', name: 'Cashback' },
      { id: 't6', name: 'High Roller' },
    ],
  },
  {
    id: '3f2504e0-4f89-11d3-9a0c-0305e82c3301',
    name: 'Free Spins Friday',
    status: 'scheduled',
    isActive: false,
    createdAt: '2025-03-21T07:00:00.000Z',
    uuid: '3f2504e0-4f89-11d3-9a0c-0305e82c3301',
    tags: [{ id: 't7', name: 'Free Spins' }, { id: 't8', name: 'Slots' }],
  },
  {
    id: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
    name: 'New Player Welcome Pack',
    status: 'active',
    isActive: true,
    createdAt: '2025-04-05T13:22:10.000Z',
    uuid: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
    tags: [{ id: 't9', name: 'Welcome' }],
  },
  {
    id: 'c9bf9e57-1685-4c89-bafb-ff5af830be8a',
    name: 'Loyalty Points Exchange',
    status: 'suspended',
    isActive: false,
    createdAt: '2025-04-18T08:45:33.000Z',
    uuid: 'c9bf9e57-1685-4c89-bafb-ff5af830be8a',
    tags: [],
  },
  {
    id: 'e3d70483-d946-4168-be21-4b2cf3a66a5b',
    name: 'Live Casino Daily Drop',
    status: 'active',
    isActive: true,
    createdAt: '2025-05-10T16:55:00.000Z',
    uuid: 'e3d70483-d946-4168-be21-4b2cf3a66a5b',
    tags: [{ id: 't10', name: 'Live Casino' }, { id: 't11', name: 'Daily' }, { id: 't12', name: 'Drop' }],
  },
]

// ---------------------------------------------------------------------------
// Mock store factory — returns a store-like object without any API calls.
// fetchEntityList resolves with the items/total passed at creation time.
// ---------------------------------------------------------------------------
function makeMockStore(list: unknown[], total: number) {
  return {
    fetchEntityList: async () => ({ list, total }),
    deleteEntity: async () => {},
    multipleDeleteEntity: async () => {},
    updateEntity: async () => {},
    toggleStatusEntity: async () => {},
    fetchReport: async () => {},
  }
}

// ---------------------------------------------------------------------------
// Table columns covering the most common ListFieldType variants
// ---------------------------------------------------------------------------
const fields = [
  new TableField({ key: 'name', title: 'Name' }),
  new TableField({ key: 'status', title: 'Status', type: ListFieldType.Status }),
  new TableField({ key: 'isActive', title: 'Active', type: ListFieldType.PillStatus }),
  new TableField({ key: 'createdAt', title: 'Created At', type: ListFieldType.Date }),
  new TableField({ key: 'uuid', title: 'UUID', type: ListFieldType.Copy }),
  new TableField({ key: 'tags', title: 'Tags', type: ListFieldType.Badges }),
]

// ---------------------------------------------------------------------------
// useList factory — returns the UseListType shape DefaultBaseList expects
// ---------------------------------------------------------------------------
function makeUseList(store: ReturnType<typeof makeMockStore>) {
  return () => ({
    entityName: 'Demo',
    fields,
    ListFilterModel: FilterID,
    useStore: () => store as any,
  })
}

// ---------------------------------------------------------------------------
// Shared base config
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

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/**
 * Table populated with three rows, covering Name, Status, PillStatus,
 * Date, Copy, and Badges column types.
 */
export const WithData: Story = {
  name: 'With Data',
  args: {
    config: baseConfig,
    useList: makeUseList(makeMockStore(ITEMS, ITEMS.length)),
  },
}

/**
 * Table with no rows — shows the empty state message.
 */
export const Empty: Story = {
  name: 'Empty State',
  args: {
    config: {
      ...baseConfig,
      emptyText: 'No items found',
    },
    useList: makeUseList(makeMockStore([], 0)),
  },
}

/**
 * Table with search bar enabled.
 * Type a query in the search box — the mock store ignores the query and
 * always returns the same rows, but the UI interaction is fully functional.
 */
export const WithSearch: Story = {
  name: 'With Search',
  args: {
    config: {
      ...baseConfig,
      withSearch: true,
      searchPlaceholder: 'Search by name…',
    },
    useList: makeUseList(makeMockStore(ITEMS, ITEMS.length)),
  },
}
