# Research: Comprehensive Unit Test Module for BaseList

> Generated from a full codebase audit of `tests/unit/components/templates/BaseList/`
> and the component layer `src/components/templates/BaseList/`.
>
> **Stack:** Vue 3 (Composition API / `<script setup>`) + Vitest + `@vue/test-utils` (jsdom) + Pinia + Vue Router + Vuetify 3

---

## 1. Component Architecture (3 layers)

```
BaseList/index.vue                     ← WRAPPER (primary target of comprehensive test)
├── types/default.vue                  ← DefaultBaseList (full-featured)
│   ├── _components/ListSearch
│   ├── _components/ProjectsFilter
│   ├── _components/FiltersBlock
│   ├── _components/TableFields
│   ├── _components/ListPagination
│   ├── _components/MultipleActions
│   ├── _components/SideBar
│   ├── _components/RemoveModal
│   ├── _components/ImageDetailModal
│   └── _components/fields/* (20 field types)
└── types/compact.vue                   ← CompactBaseList (streamlined — no sidebar, no ImageDetailModal)
    ├── _components/ListSearch
    ├── _components/TableFields
    ├── _components/ListPagination
    └── _components/RemoveModal
```

### 1.1 BaseList/index.vue (the wrapper)

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `config` | `IBaseListConfig` | — | Table/list configuration object |
| `useList` | `unknown` (factory `() => UseListType`) | — | Provides `entityName`, `fields`, `ListFilterModel`, `useStore`, etc. |
| `type` | `ListTypes` | `ListTypes.Default` | Switches between Default and Compact layouts |

**Template behavior:**
- Renders `<component :is="dynamicComponent">` where `dynamicComponent` is selected from `componentsMap = { default: DefaultBaseList, compact: CompactBaseList }`
- Forwards `config` and `useList` props to the child
- Re-emits `rowClicked`, `end`, `mounted` from the child
- Spreads `$attrs` onto the child via `v-on` (forwards all DOM/listener attributes)
- Forwards all `$slots` to the child with `v-bind="slotProps"`

**`defineExpose` (delegated to child):**
| Method | Delegates to child | Notes |
|--------|-------------------|-------|
| `reFetchList` | `listByTypeRef.value?.reFetchList` (getter) | |
| `resetSelectedItem` | `listByTypeRef.value?.resetSelectedItem` (getter) | |
| `setSelectedItems(items)` | Sets `listByTypeRef.value.selectedItems` | Direct setter |
| `setDisableRowIds(ids)` | Sets `listByTypeRef.value.disableRowIds` | Direct setter |
| `sortData` | `listByTypeRef.value?.sortData` | |
| `items` | `listByTypeRef.value?.items` (getter) | |
| `isSidebarShown` | `listByTypeRef.value?.isSidebarShown` | |
| `searchQuery` | `listByTypeRef.value?.searchQuery` | |

### 1.2 DefaultBaseList (`types/default.vue`)

- **Root element:** `data-test-id="default-base-list"`
- **Props:** `config: IBaseListConfig`, `useList: unknown`
- **`useList()` is called as a factory** returning:
  ```ts
  {
    entityName: string
    fields: ComputedRef<TableField[]> | TableField[]
    ListFilterModel?: new (...args) => object
    SideBarModel?: new (...args) => object
    pageName?: string
    canUpdateCb?, canCopyCb?, canRemoveCb?  // per-item permission callbacks
    beforeRemoveCallback?
    ListItemModel?
    useStore?: () => BaseListStore   // ← custom store override
  }
  ```
- **Store selection logic:**
  ```ts
  const customStore = useStore ? useStore() : null
  const fetchAction = customStore?.fetchEntityList
    ? customStore.fetchEntityList
    : baseStoreCore.fetchEntityList
  const deleteAction = customStore?.deleteEntity
    ? customStore.deleteEntity
    : baseStoreCore.deleteEntity
  const multipleDeleteAction = customStore?.multipleDeleteEntity
    ? customStore.multipleDeleteEntity
    : baseStoreCore.multipleDeleteEntity
  ```
- **IMPORTANT:** `onClickToggleStatus` ALWAYS uses `baseStoreCore.updateEntity` or
  `baseStoreCore.toggleStatusEntity` (never the custom store), regardless of `useStore`.

- **Exposed:** `reFetchList`, `resetSelectedItem`, `selectedItems`, `disableRowIds`,
  `sortData`, `items`, `isSidebarShown`, `searchQuery`

### 1.3 CompactBaseList (`types/compact.vue`)

- **Root element:** `data-test-id="compact-base-list"`
- Same store selection logic as Default
- Simpler layout: no `SideBar` component, no `ImageDetailModal`
- Same exposed methods as Default

---

## 2. Existing Test Coverage Status

**All 288 tests across 32 files pass.** ✅

| File | Scope | # Tests | Assessment |
|------|-------|---------|------------|
| `BaseList.spec.ts` | **Wrapper** (defineAsyncComponent mocked → returns DefaultBaseList) | **7** | ⚠️ Very thin |
| `types/default.spec.ts` | DefaultBaseList child directly | ~40 | ✅ Comprehensive |
| `types/compact.spec.ts` | CompactBaseList child directly | 1 | ❌ Minimal |
| `_components/BaseListCell.spec.ts` | Cell + field rendering (20 stubs) | ~40 | ✅ Comprehensive |
| `_components/fields/*.spec.ts` | 20 individual field types | ~60 | ✅ Per-field |
| `_components/ListPagination.spec.ts` | Pagination | ~10 | ✅ |
| `_components/ItemActions.spec.ts` | Action dropdown | ~9 | ✅ |
| `_components/TableFIelds.spec.ts` | Table fields container | 4 | ✅ |
| `_components/ListSearch.spec.ts` | Search bar | ? | ? |
| `_components/ExportFormatSelector.spec.ts` | Export format | ? | ? |
| `_components/BtnTooltip.spec.ts` | Tooltip button | ? | ? |
| `_components/MultipleActions.spec.ts` | Multiple actions | ? | ? |

### 2.1 What `BaseList.spec.ts` currently tests (7 tests)

```
describe('BaseList.vue (with mocked dynamic import)')
  └─ 'Should run set valid component and call fetch'  ← checks DefaultBaseList renders + fetchEntityList called

describe('DefaultBaseList.vue - useStore vs baseStoreCore')
  fetchEntityList/
    ├─ 'calls baseStoreCore.fetchEntityList on mount when useStore is not provided'
    ├─ 'calls customStore.fetchEntityList and not baseStoreCore when useStore is provided'
    ├─ 'passes correct pagination params to fetchEntityList'
    └─ 'passes entityName as type to fetchEntityList'
  deleteEntity/
    ├─ 'calls baseStoreCore.deleteEntity when useStore is not provided'
    ├─ 'calls customStore.deleteEntity and not baseStoreCore when useStore is provided'
    └─ 'refetches list after successful delete'
  updateEntity (toggle status)/
    ├─ 'calls baseStoreCore.updateEntity for toggle status when useStore is not provided'
    └─ 'calls baseStoreCore.updateEntity for toggle status even when useStore is provided'
```

**Critical observation:** The `defineAsyncComponent` mock in `BaseList.spec.ts` is a **no-op** —
BaseList/index.vue imports `DefaultBaseList` via a direct `import`, not `defineAsyncComponent`.
The mock exists but has zero effect on the test outcome.

### 2.2 Key gaps in existing wrapper-level tests

| Gap | Status | Impact |
|-----|--------|--------|
| Type switching (compact vs default) | ❌ Untested | Wrapper's core responsibility |
| Event forwarding (rowClicked, end, mounted) | ❌ Untested | Wrapper re-emits child events |
| `$attrs` forwarding | ❌ Untested | Wrapper has `v-on` spread for attrs |
| Exposed methods delegation | ❌ Untested | `setSelectedItems`, `setDisableRowIds`, `reFetchList`, etc. |
| Slot forwarding to child | ❌ Untested | Wrapper forwards all `$slots` |
| Props forwarding (config, useList) | ⚠️ Only implicit | Verified via fetch params, not via `.props()` |
| Compact type through wrapper | ❌ Untested | Only 1 direct-child test exists |
| Config × useList combinations | ⚠️ Partial | Only 3 useList variants × few configs |

---

## 3. The Mock System Problem

### 3.1 Two parallel mock directories

| | `tests/unit/mocks/base-list/` (with hyphen) | `tests/unit/mocks/baselist/` (no hyphen) |
|---|---|---|
| **Used by** | `default.spec.ts`, `compact.spec.ts` | `BaseList.spec.ts`, child `_components` specs |
| `useList` (default factory) | ✅ | ❌ |
| `defaultProps` | ✅ | ❌ |
| `global` (with modal provide + VueSelect stub) | ✅ | ❌ |
| `mockCustomStore` | ✅ | ❌ |
| `getMountComponent` (Default + Compact) | ✅ | ❌ |
| `permissionsMock` + `modalSpy` | ✅ | ❌ |
| `mockBaseStoreCore` | ✅ | ✅ (imported by BaseList.spec.ts from here) |
| `useListForToggleStatus` | ✅ | ✅ |
| `useListForCustomStore` | ✅ | ✅ |
| `exportDataMock` | ✅ | ✅ |
| `getUpdatePropsConfig` | ✅ | ✅ |
| `getSelectorCField` | ✅ | ✅ |
| `runActionToggleState` | ✅ | ✅ (slightly different signature) |
| `static-mock.ts` — appConfigCore, loader, user, users, base-permissions mocks | ✅ | ❌ |
| `static-mock.ts` — vue-router, users, baseStoreCore, toasts mocks | ✅ | ✅ (simpler, uses `@/` aliases) |
| `mock.ts` / `mock.ts` empty | — | ✅ (empty file) | — |

### 3.2 The inconsistency in `BaseList.spec.ts`

```ts
// Imports from BOTH mock systems:
import { mockBaseStoreCore } from '../../../mocks/baselist/utils'        // ← no hyphen
import { defaultProps, global, mockCustomStore, useListForCustomStore }
  from '../../../mocks/base-list/utils'                                   // ← with hyphen
```

This works only because both files export `mockBaseStoreCore` with the same mock function identity
(the `baselist/utils.ts` one is used for the `useBaseStoreCore` mock, while `base-list/utils` provides
the props/config/mocks for mounting). But it's fragile and confusing.

### 3.3 Recommendation on mock consolidation

**Standardize on `tests/unit/mocks/base-list/`** (the richer system) because it has:
- `defaultProps` and `global` (needed for any mount)
- `mockCustomStore` (needed for custom-store tests)
- `permissionsMock` and `modalSpy` (needed for permission/modal tests)
- `useList` (the default factory, needed for `useList` variant tests)
- `getMountComponent` / `getMountCompactComponent`
- Complete `static-mock.ts` (appConfigCore, loader, user stores, permissions, vue-router, toasts)

The `baselist/` (no-hyphen) directory can be removed once all specs migrate imports.

---

## 4. useList Variants

Three factory patterns exercised by test mocks:

### Variant 1: Default
```ts
export const useList = (): UseListType => ({
  ListFilterModel: FilterID,
  entityName: 'Test',
  fields: [name, type, status],
})
```
→ Routes to `baseStoreCore` for all CRUD operations.

### Variant 2: ToggleStatus
```ts
export const useListForToggleStatus = () => ({
  ListFilterModel: FilterID,
  entityName: 'Test',
  fields: [...defaultFields, { key: 'isActive', type: ListFieldType.PillStatus }, { key: 'actions', title: '' }],
})
```
→ Adds a `PillStatus` column and an `actions` column enabling the toggle-status UI.

### Variant 3: CustomStore
```ts
export const useListForCustomStore = customStore => () => ({
  useStore: () => customStore,      // ← overrides baseStoreCore
  ListFilterModel: FilterID,
  entityName: 'Test',
  fields: [...defaultFields, { key: 'isActive', type: ListFieldType.PillStatus }, { key: 'actions' }],
})
```
→ Routes `fetchEntityList`, `deleteEntity`, `multipleDeleteEntity` to `customStore`,
but `updateEntity` (toggle status) **always** uses `baseStoreCore`.

---

## 5. IBaseListConfig — The Configuration Matrix

Full list of config flags from `src/@model/templates/baseList.ts`:

| Flag | Type | Default | Behavioral impact |
|------|------|---------|-------------------|
| `withSearch` | boolean | — | Show/hide search input |
| `withDeactivation` | boolean | — | Enable toggle-status action |
| `withDeactivationBySpecificAction` | boolean | — | Use `toggleStatusEntity` instead of `updateEntity` |
| `withSettings` | boolean | — | Show table settings dropdown (column visibility) |
| `emptyText` | string | `i18n.t('emptyState.list')` | Empty state text |
| `filterList` | FilterListItem[] | `[]` | Inline filter fields |
| `staticFilters` | Record | `{}` | Always-sent API filters |
| `withProjectsFilter` | boolean | — | Show project filter chips |
| `projectsFilterMode` | ProjectsFilterMode | `Current` | `Current` vs `All` projects |
| `staticSorts` | SortItem | — | Pre-applied sorting |
| `selectMode` | SelectMode | `Page` | Selection mode |
| `selectable` | boolean | — | Show checkboxes (requires canUpdate or canRemove) |
| `small` | boolean | — | Compact row height + small pagination |
| `draggable` | boolean | — | Enable drag-and-drop reordering |
| `defaultPerPage` | number | — | Initial page size |
| `withIndependentPagination` | boolean | — | Use internal pagination instead of router |
| `searchPlaceholder` | string | — | Placeholder text |
| `withExport` | boolean | — | Show export button |
| `formatOfExports` | ExportFormat[] | `[JSON, CSV]` | Available export formats |
| `maxExportItems` | number | — | Max items for export |
| `withMultipleActions` | boolean\|MultipleActions | — | Enable bulk actions |
| `sidebar` | boolean | — | Show sidebar on row click |
| `cbShowSidebar` | Function | — | Custom sidebar show handler |
| `sidebarCollapseMode` | boolean | — | Collapsible sidebar |
| `isShowYou` | boolean | — | Highlight current user's rows |
| `isShowUpdatePassword` | boolean | — | Show password update field |
| `onePermissionKey` | string | — | Single permission for all actions |
| `withRemoveComment` | boolean | — | Show comment field in remove modal |
| `withRemoveModal` | boolean | — | Show confirmation modal before delete |
| `createFromCopy` | boolean | — | Enable copy action for items |
| `withCustomDrag` | boolean | — | Custom drag handling (emits `@end`) |
| `pagination` | boolean | `true` | Show pagination |
| `withCreateBtn` | boolean | `true` | Show "Create" button |
| `withCustomFetchList` | boolean | — | Use custom store's fetchEntityList |
| `withCustomDelete` | boolean | — | Use custom store's deleteEntity |
| `noPermissionPrefix` | boolean | — | Skip project prefix in permission keys |
| `permissionKey` | string | — | Custom permission key |
| `customApiPrefix` | string | — | Override API path prefix |
| `customPermissionPrefix` | string | — | Override permission prefix |
| `hover` | boolean | `true` | Row hover highlight |
| `skeletonRows` | number | — | Skeleton loader row count |
| `skeletonCols` | number | — | Skeleton loader col count |
| `loadingOnlyByList` | boolean | — | Only show skeleton during list fetch |
| `loadingEndpointArr` | string[] | `[]` | Extra endpoints to watch for loading |
| `hideSearchBlock` | boolean | — | Hide entire top search/filter bar |
| `closeFilterOnPagination` | boolean | — | Close filters on page change |
| `withTopPagination` | boolean | — | Show pagination above table |
| `withGoToPage` | boolean | — | Show "go to page" input |
| `saveSort` | boolean | `true` | Persist sort in localStorage |
| `disableLoading` | boolean | — | Disable loading state |
| `cancelPreviousRequest` | boolean | — | Cancel previous list requests |
| `cellCbClass` | CallableFunction | — | Custom class callback for cells |
| `noPermissions` | NoPermissions | `false` | Disable permission checks |
| `inlineFilters` | FilterListItem[] | `[]` | Inline filter definitions |
| `copyForAllProjects` | boolean | `false` | Copy to all projects |

---

## 6. Key Test Infrastructure

### 6.1 `setMountComponent` (from `tests/unit/utils.ts`)
```ts
export const setMountComponent = component =>
  (props, global = {}, slots) => mount(component, getConfig(props, global, slots))
```

### 6.2 `testOn` helpers (from `test-case-generator.ts`)
| Helper | Usage |
|--------|-------|
| `testOn.existElement({ wrapper, testId })` | Assert element by `[data-test-id]` exists |
| `testOn.notExistElement({ wrapper, testId })` | Assert element does NOT exist |
| `testOn.equalTextValue({ wrapper, selector/testId }, value)` | Assert exact text |
| `testOn.existTextValue({ wrapper, ... }, partial)` | Assert text contains substring |
| `testOn.existClass({ wrapper, ... }, class)` | Assert class exists |
| `testOn.existClassList({ wrapper, ... }, [classes])` | Assert multiple classes |
| `testOn.checkLengthElements({ wrapper, ... }, n)` | Assert element count |
| `testOn.checkExistCalledMethodWithArguments({ wrapper, ... }, fn)` | Assert mock called with args |
| `testOn.checkNotExistCalledMethod({ wrapper, ... }, fn)` | Assert mock NOT called |
| `testOn.isCalledEmitEventValue({ wrapper }, { event, value, index })` | Assert emitted event value |
| `testOn.isCalledEmitEventValueToBe({ wrapper }, { event, value, index })` | Assert emitted === value |
| `testOn.isCalledEmitEvent({ wrapper }, event)` | Assert event was emitted |
| `testOn.inputAttributeValueToBe({ wrapper, selector }, value)` | Assert input value |
| `testOn.isDisabledElement({ wrapper, selector/testId })` | Assert disabled |
| `testOn.isEqualAttributeStyle({ wrapper, selector/testId }, style)` | Assert style |

### 6.3 Test data-test-ids (referenced in tests)
| test-id | Component | Used in |
|---------|-----------|---------|
| `default-base-list` | DefaultBaseList | `BaseList.spec.ts` |
| `compact-base-list` | CompactBaseList | `compact.vue` (not yet tested at wrapper level) |
| `search-input` | ListSearch | `default.spec.ts` |
| `list-pagination` | ListPagination | `default.vue`, `compact.vue` |
| `pagination-meta` | ListPagination | `compact.spec.ts` |
| `selectable-th` | TableFields | `default.spec.ts` |
| `selectable-checkbox` | TableFields | `default.spec.ts` |
| `activator` | ItemActions / ListSearch dropdown | `default.spec.ts`, `ItemActions.spec.ts` |
| `status-toggle` | ItemActions | `default.spec.ts` |
| `pill-status` | PillStatusField | `default.spec.ts` |
| `right-search-btn` | ListSearch create button | `default.spec.ts` |
| `remove` | ItemActions remove button | `default.spec.ts` |

---

## 6.5 ⚠️ Scope Restriction (user confirmed)

> **"compact list можна повністю ігнорувати"** — The Compact list type
> (`ListTypes.Compact`, `data-test-id="compact-base-list"`) is **out of scope**.

This means:
- `types/compact.vue` and `compact.spec.ts` are excluded from the comprehensive test module
- No `type: ListTypes.Compact` matrix entries
- All focus is on `DefaultBaseList` as the sole child rendering target
- Existing `compact.spec.ts` (1 test) is left as-is — not touched, not expanded

---

## 7. Proposed Approaches (compact excluded)

### Approach A: "Wrapper Contract" Test Module (leanest)

**New file:** `BaseList.contract.spec.ts`

Tests **only** what `BaseList/index.vue` is responsible for — the wrapper contract — using the **real** `DefaultBaseList` as the rendering target (no `defineAsyncComponent` stub):

1. **Type switching** (1 test) — *(compact excluded)*
   - Renders `default-base-list` when `type=ListTypes.Default`
   - Defaults to Default when `type` is omitted

2. **Props forwarding** (2 tests)
   - Child receives correct `config` (via `findComponent().props('config')`)
   - Child receives correct `useList` (via `findComponent().props('useList')`)

3. **Event forwarding** (4 tests)
   - Child `mounted` → wrapper emits `mounted`
   - Child `rowClicked` → wrapper emits `rowClicked` with correct payload
   - Child `end` → wrapper emits `end` with correct payload
   - `$attrs` listeners forwarded (e.g., custom event via attr spread)

4. **Exposed methods** (4 tests)
   - `vm.reFetchList()` delegates to child
   - `vm.resetSelectedItem()` delegates to child
   - `vm.setSelectedItems([...])` sets child's `selectedItems`
   - `vm.setDisableRowIds([...])` sets child's `disableRowIds`

5. **Slot forwarding** (2 tests)
   - Custom slot content renders inside child
   - Named slots forwarded with slot props

6. **Config × useList matrix** (8 scenarios, table-driven)
   - Each scenario: mount with specific `{ type, useList, config }` → assert child test-id + fetch params + store used

**Test count:** ~23

**Pros:** Clean, fast, tests only wrapper logic, no child-component duplication
**Cons:** Doesn't verify child rendering details (already covered by `default.spec.ts`/`compact.spec.ts`)

---

### Approach B: "Integration Through Wrapper" (comprehensive end-to-end)

**New file:** `BaseList.integration.spec.ts`

Same as A, but mounts **real** `DefaultBaseList` and asserts **visible behavior**:

- Everything in A
- Row click → wrapper emits `rowClicked` with item
- `config.sidebar` + row click → child `isSidebarShown` accessible via wrapper expose
- `config.withSearch` + typing → `fetchEntityList` called with search filter
- `config.staticFilters` → fetch called with merged filter
- `config.withProjectsFilter` → `ProjectsFilter` renders, project chips visible
- `config.selectable` + permission → checkboxes render
- `config.small` → compact row styling test-id
- `useListForCustomStore` → `mockCustomStore.fetchEntityList` called instead of `mockBaseStoreCore`
- `useListForToggleStatus` + `withDeactivation` → toggle status calls `updateEntity`

**Test count:** ~30–35

**Pros:** True end-to-end through wrapper, catches integration regressions
**Cons:** Heavier, slower, some overlap with existing `default.spec.ts`

---

### Approach C: "Consolidated + Extended BaseList.spec.ts"

Keep the existing `BaseList.spec.ts` but **expand it** and **merge mock systems**:

1. Unify on `tests/unit/mocks/base-list/` (the richer dir)
2. Expand `BaseList.spec.ts` to cover: props forwarding, events, expose, slots, attrs, config×useList matrix
3. Remove the no-op `defineAsyncComponent` mock

**Test count:** ~30 (replaces existing 7)

**Pros:** Minimal structural change — extends what exists
**Cons:** Touches many existing files (mock dirs), the no-op mock removal may reveal hidden deps

---

### Approach D: Data-Driven Matrix Test Suite (BDD-style)

Uses `it.each` with a config matrix:

```ts
const testMatrix = [
  { type: 'default', useList: 'default', config: { withSearch: true, withCreateBtn: true } },
  { type: 'default', useList: 'default', config: { withSearch: false } },
  { type: 'default', useList: 'customStore', config: { withCustomDelete: true } },
  { type: 'default', useList: 'toggleStatus', config: { withDeactivation: true } },
  // … (compact entries removed — out of scope)
]
```

Each entry: mount BaseList → assert child test-id, fetch params, store used.

**Pros:** Systematic, easy to extend
**Cons:** Doesn't test interactive behavior well, matrix can explode combinatorially

---

### Recommended Combination: **A + selected B scenarios** *(compact excluded)*

A new `BaseList.integration.spec.ts` with:
1. Wrapper contract tests (A) — ~15 test cases
2. Config×useList matrix (D-style, 8 scenarios)
3. A few end-to-end interaction tests (from B)

This covers the wrapper-layer gap without duplicating existing child-component tests.

---

## 8. Quick Reference: Files to Reference in New Tests

| Concern | Import from |
|---------|-------------|
| Mount helper | `tests/unit/utils.ts` → `setMountComponent` |
| Assertion helpers | `tests/unit/templates/shared-tests/test-case-generator.ts` → `testOn` |
| Test data + defaultProps + global | `tests/unit/mocks/base-list/utils.ts` |
| Mock store functions | `tests/unit/mocks/base-list/utils.ts` → `mockBaseStoreCore`, `mockCustomStore` |
| Permissions mock | `tests/unit/mocks/base-list/static-mock.ts` → `permissionsMock`, `modalSpy` |
| useList variants | `tests/unit/mocks/base-list/utils.ts` → `useList`, `useListForToggleStatus`, `useListForCustomStore` |
| Export mock (download) | `tests/unit/mocks/base-list/utils.ts` → `exportDataMock` |
| BaseList component | `src/components/templates/BaseList/index.vue` |
| Child components | `src/components/templates/BaseList/types/default.vue` |
| ListTypes enum | `src/@model/templates/baseList.ts` → `ListTypes` |
| Mock modules | `tests/unit/mocks/base-list/static-mock.ts` (import first line) |

---

## 9. Code Sketch: What the Test Would Look Like (Approach A + B)

Below is a **representative example** of what `BaseList.integration.spec.ts` would contain.
This is a sketch — not a complete implementation — to illustrate the structure and style.

### 9.1 Imports & Setup

```ts
// ── File: BaseList.integration.spec.ts ──
// vi.mock setup (must be first import)
import '../../../../mocks/base-list/static-mock'

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { cloneDeep } from 'lodash'
import { flushPromises } from '@vue/test-utils'
import { h } from 'vue'

import BaseList from '../../../../../src/components/templates/BaseList/index.vue'
import DefaultBaseList from '../../../../../src/components/templates/BaseList/types/default.vue'
import { ListTypes, BaseListSlots } from '../../../../../src/@model/templates/baseList'
import { setMountComponent, clickTrigger } from '../../../utils'
import { testOn } from '../../../templates/shared-tests/test-case-generator'
import {
  defaultProps,
  global,
  mockBaseStoreCore,
  mockCustomStore,
  exportDataMock,
  useList,
  useListForToggleStatus,
  useListForCustomStore,
} from '../../../mocks/base-list/utils'

const getMountComponent = setMountComponent(BaseList)
let props
```

### 9.2 Type Switching

```ts
it('renders DefaultBaseList with data-test-id="default-base-list"', async () => {
  const wrapper = getMountComponent({ ...props, type: ListTypes.Default }, global)
  await flushPromises()
  testOn.existElement({ wrapper, testId: 'default-base-list' })
})
```


### 9.3 Props Forwarding

```ts
it('passes config to child via dynamic component', async () => {
  props.config.withSearch = true
  const wrapper = getMountComponent(props, global)
  await flushPromises()
  const child = wrapper.findComponent(DefaultBaseList)
  expect(child.exists()).toBe(true)
  expect(child.props('config')).toMatchObject({ withSearch: true })
})

it('passes useList factory to child', async () => {
  const wrapper = getMountComponent(props, global)
  await flushPromises()
  const child = wrapper.findComponent(DefaultBaseList)
  expect(child.exists()).toBe(true)
  expect(typeof child.props('useList')).toBe('function')
})
```

### 9.4 Event Forwarding

```ts
it('forwards mounted from child', async () => {
  const wrapper = getMountComponent(props, global)
  await flushPromises()
  expect(wrapper.emitted('mounted')).toBeTruthy()
})

it('forwards rowClicked from child with payload', async () => {
  const wrapper = getMountComponent(props, global)
  await flushPromises()
  await wrapper.findComponent(DefaultBaseList).vm.$emit('rowClicked', { id: 1 })
  testOn.isCalledEmitEventValue({ wrapper }, { event: 'rowClicked', value: { id: 1 } })
})

it('forwards end event from child', async () => {
  const wrapper = getMountComponent(props, global)
  await flushPromises()
  await wrapper.findComponent(DefaultBaseList).vm.$emit('end', {
    itemId: 1, newIndex: 2, oldIndex: 1, page: 1, perPage: 10,
  })
  testOn.isCalledEmitEventValueToBe({ wrapper }, { event: 'end', value: { itemId: 1 } })
})

it('forwards $attrs listeners via v-on spread', async () => {
  const onCustom = vi.fn()
  const wrapper = getMountComponent(
    props,
    { ...global, listeners: { 'custom-event': onCustom } } as any,
  )
  await flushPromises()
  const child = wrapper.findComponent(DefaultBaseList)
  await child.vm.$emit('custom-event', 'payload')
  expect(onCustom).toHaveBeenCalledWith('payload')
})
```


### 9.5 Exposed Methods

```ts
it('reFetchList() delegates to child', async () => {
  const wrapper = getMountComponent(props, global)
  await flushPromises()
  mockBaseStoreCore.fetchEntityList.mockClear()
  await wrapper.vm.reFetchList()
  await flushPromises()
  expect(mockBaseStoreCore.fetchEntityList).toHaveBeenCalled()
})

it('setSelectedItems() sets child selectedItems', async () => {
  const wrapper = getMountComponent(props, global)
  await flushPromises()
  const items = [{ id: '1' }, { id: '2' }]
  wrapper.vm.setSelectedItems(items)
  expect(wrapper.findComponent(DefaultBaseList).vm.selectedItems).toEqual(items)
})

it('setDisableRowIds() sets child disableRowIds', async () => {
  const wrapper = getMountComponent(props, global)
  await flushPromises()
  wrapper.vm.setDisableRowIds(['1', '3'])
  expect(wrapper.findComponent(DefaultBaseList).vm.disableRowIds).toEqual(['1', '3'])
})

it('searchQuery is delegated from child', async () => {
  const wrapper = getMountComponent(props, global)
  await flushPromises()
  expect(wrapper.vm.searchQuery).toBeDefined()
  expect(typeof wrapper.vm.searchQuery.value).toBe('string')
})
```

### 9.6 Slot Forwarding

```ts
it('renders default slot content inside child', async () => {
  const wrapper = getMountComponent(
    props, global,
    { default: h('div', { 'data-test-id': 'slot-marker' }, 'content') },
  )
  await flushPromises()
  testOn.existElement({ wrapper, testId: 'slot-marker' })
})

it('forwards named slots (table-header) with slot props', async () => {
  const slots = {
    [BaseListSlots.TableHeader]: ({ selectedItems, total }) =>
      h('div', { 'data-test-id': 'header-slot' },
        `count:${selectedItems.length} total:${total}`),
  }
  const wrapper = getMountComponent(props, global, slots)
  await flushPromises()
  testOn.existElement({ wrapper, testId: 'header-slot' })
})
```


### 9.7 Config × useList Matrix (8 scenarios)

```ts
const scenarios = [
  { name: 'useList (default) + withSearch',
    useList: () => useList(),
    config: { withSearch: true },
    assert: w => { testOn.existElement({ wrapper: w, testId: 'search-input' }) } },
  { name: 'useListForToggleStatus + withDeactivation',
    useList: () => useListForToggleStatus(),
    config: { withDeactivation: true },
    assert: w => { testOn.existElement({ wrapper: w, testId: 'pill-status' }) } },
  { name: 'useListForCustomStore + withCustomDelete',
    useList: () => useListForCustomStore(mockCustomStore)(),
    config: { withCustomDelete: true },
    assert: w => {
      expect(mockCustomStore.fetchEntityList).toHaveBeenCalled()
      expect(mockBaseStoreCore.fetchEntityList).not.toHaveBeenCalled()
    } },
  { name: 'useList (default) + staticFilters',
    useList: () => useList(),
    config: { staticFilters: { playerId: 42 } },
    assert: () => {
      expect(mockBaseStoreCore.fetchEntityList).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({
          filter: expect.objectContaining({ playerId: 42 }),
        }) }))
    } },
  { name: 'useList (default) + withExport',
    useList: () => useList(),
    config: { withExport: true, formatOfExports: ['csv', 'json'] },
    assert: w => { testOn.existElement({ wrapper: w, testId: 'export-format-selector' }) } },
  { name: 'useList (default) + withProjectsFilter',
    useList: () => useList(),
    config: { withProjectsFilter: true },
    assert: w => { expect(w.text()).toContain('Project A') } },
  { name: 'useList (default) + selectable (canUpdate)',
    useList: () => useList(),
    config: { selectable: true },
    assert: w => {
      testOn.existElement({ wrapper: w, testId: 'selectable-th' })
      testOn.existElement({ wrapper: w, testId: 'selectable-checkbox' })
    } },
  { name: 'useList (default) + onePermissionKey',
    useList: () => useList(),
    config: { onePermissionKey: 'test-super' },
    assert: () => { expect(mockBaseStoreCore.fetchEntityList).toHaveBeenCalled() } },
]

scenarios.forEach(({ name, useList: listFn, config, assert }) => {
  it(name, async () => {
    const testProps = { ...props, useList: listFn, config: { ...props.config, ...config } }
    const wrapper = getMountComponent(testProps, global)
    await flushPromises()
    assert(wrapper)
  })
})
```

### 9.8 Integration: End-to-End Interactions

```ts
it('clicking a table row emits rowClicked from wrapper', async () => {
  const wrapper = getMountComponent(props, global)
  await flushPromises()
  await clickTrigger({ wrapper, selector: '.c-table tbody tr' })
  expect(wrapper.emitted('rowClicked')).toBeTruthy()
})

it('sidebar + row click → wrapper exposes isSidebarShown = true', async () => {
  props.config.sidebar = true
  props.useList = () => useListForToggleStatus()
  const wrapper = getMountComponent(props, global)
  await flushPromises()
  await clickTrigger({ wrapper, selector: '.c-table tbody tr' })
  await flushPromises()
  expect(wrapper.vm.isSidebarShown.value).toBe(true)
})

it('staticFilters passed through to fetchEntityList', async () => {
  props.config.staticFilters = { id: 2 }
  getMountComponent(props, global)
  await flushPromises()
  expect(mockBaseStoreCore.fetchEntityList).toHaveBeenCalledWith(
    expect.objectContaining({ data: expect.objectContaining({
      filter: expect.objectContaining({ id: 2 }),
    }) }))
})

it('customStore fetch+delete when useStore provided', async () => {
  props.useList = () => useListForCustomStore(mockCustomStore)()
  const wrapper = getMountComponent(props, global)
  await flushPromises()
  expect(mockCustomStore.fetchEntityList).toHaveBeenCalled()
  expect(mockBaseStoreCore.fetchEntityList).not.toHaveBeenCalled()
  wrapper.vm.selectedItem = { id: '1' }
  await wrapper.vm.onClickModalOk({ hide: vi.fn(), commentToRemove: '' })
  await flushPromises()
  expect(mockCustomStore.deleteEntity).toHaveBeenCalledWith(
    expect.objectContaining({ type: 'Test', id: '1' }))
})

it('toggleStatus always uses baseStoreCore even with customStore', async () => {
  props.useList = () => useListForCustomStore(mockCustomStore)()
  const wrapper = getMountComponent(props, global)
  await flushPromises()
  await wrapper.vm.onClickToggleStatus({ id: '1', isActive: false })
  await flushPromises()
  expect(mockBaseStoreCore.updateEntity).toHaveBeenCalledWith(
    expect.objectContaining({ type: 'Test', data: { form: { id: '1', isActive: true } } }))
  expect(mockCustomStore.updateEntity).not.toHaveBeenCalled()
})
```

---

## 10. Summary

| Approach | New file | ~Tests | Key benefit | Main risk |
|----------|----------|--------|-------------|-----------|
| **A** - Wrapper Contract | `BaseList.contract.spec.ts` | ~23 | Tests every wrapper responsibility | No visible-behavior checks |
| **B** - Full Integration | `BaseList.integration.spec.ts` | ~35 | End-to-end through wrapper, catches regressions | Overlap with existing `default.spec.ts` |
| **C** - Consolidated + Extended | Replace `BaseList.spec.ts` | ~30 | Minimal file churn | Mock-system consolidation touches existing files |
| **D** - Data-Driven Matrix | `BaseList.matrix.spec.ts` | variable | Systematic coverage of config×useList | Poor for interactive behavior |
| **A+B (recommended)** | one new file | ~30 | Best balance of wrapper + integration coverage | ~30% overlap with existing tests |
