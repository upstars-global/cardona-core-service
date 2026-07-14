# Advanced List Patterns

Read the section you need. These attach to the list built in `section-list/SKILL.md`.

## `staticFilters` (BaseListConfig)

Filters **always** sent to the API, invisible to the user. Common for child lists under a card (`playerId`, `tournamentId`, `parentId`).

```ts
new BaseListConfig({
  filterList: [...],                            // visible to user
  staticFilters: { playerId: props.playerId },  // always in payload
})
```

- Type: `Record<string, string | string[] | number | number[]>`.
- Supports dynamics: `computed(() => ({ projectId: route.params.projectId }))`.
- Merges with `filterList` into one flat `filter` API object; regular filters can override.
- Pair with `listKey = computed(() => Object.values(staticFilters.value).join('-'))` to restart the list when the value changes.

## `selectable` + `withMultipleActions` (BaseListConfig)

Row checkboxes + a bulk-action toolbar.

```ts
import { MultipleActions } from 'cardona-core-service/src/@model/...'

new BaseListConfig({
  selectable: true,
  withMultipleActions: MultipleActions.Remove, // or true (all), or ToggleStatus
})
```

When rows are selected the toolbar replaces the search/filter bar. Built-in actions use `modal.remove<EntityName>.titleMultiple`.

**Custom action slots:**
- `BaseListSlots.MultipleActions` (`#multiple-actions`) — replace/extend built-in buttons. Props: `{ selectedItems, canUpdate, entityName }`.
- `BaseListSlots.PrependMultipleAction` (`#prepend-multiple-action`) — button before the built-ins. Props: `{ canUpdate }`.

```vue
<template #[BaseListSlots.MultipleActions]="{ canUpdate, entityName }">
  <VBtn v-if="canUpdate" @click="onArchive(baseListSelectionStore.getAllSelectedIdsArr(entityName))">
    {{ $t('action.archive') }}
  </VBtn>
</template>
```

Selected IDs: `useBaseListSelection().getAllSelectedIdsArr(entityName)`. After an action: `clearSelectedIds(entityName)` + `listRef.reFetchList()`. Filter selectable rows via `canUpdateCb` / `canRemoveCb` in `useList`.

## Sidebar Preview (List)

Right-hand sidebar showing an item preview on row click.

- `SideBar` class in the model with `ViewInfo` fields (`ViewType`: Text, Badge, Date, Status, Link, …).
- `useList()` returns `SideBarModel: SideBar`.
- `BaseListConfig`: `sidebar: true`. For an accordion: `sidebarCollapseMode: true` + `SideBarCollapseItem`.
- Imports: `ViewInfo`, `ViewType` from `cardona-core-service/src/@model/view`.
- i18n title: `title.<entityName>.sidebarTitle`.

References: `src/pages/gamification/levels/`, `src/pages/adminSection/users/useSection.ts`.

## Custom Pinia store for a non-standard list endpoint

When the backend registers the list non-standardly (`.Fetch` instead of `.List`, combined requests, in-memory filtering, cascading requests), define a custom store and wire it via `useStore` in `useList`. `entityName` is still required (UI: breadcrumbs, i18n, permissions).

```ts
import { defineStore } from 'pinia'
import ApiService from 'cardona-core-service/src/services/api'
import { ListData } from 'cardona-core-service/src/@model'

export const useVipSeasonsStore = defineStore('vipSeasons', {
  actions: {
    async fetchEntityList({ data }) {
      const { data: payload } = await ApiService.request({
        type: 'App.V2.VipService.Seasons.List',
        pagination: { pageNumber: data.page ?? 1, perPage: data.perPage ?? 10 },
        sort: data.sort,
        filter: data.filter,
      })
      return new ListData(payload)
    },
  },
})
```

Standard `baseStoreCore` list signature: `fetchEntityList({ type, data, options })` → `ListData`. When the same section later gets a form, the create/update/delete methods are added to this store (see `section-form` references).
