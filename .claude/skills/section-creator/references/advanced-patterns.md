# Advanced Configs and Hooks

Reference for less common patterns. Read the relevant section when design or backend requires it.

---

## `staticFilters` (BaseListConfig)

Filters **always** sent to the API — not visible to the user. Common for child lists under a card (`playerId`, `tournamentId`, `parentId`).

```ts
new BaseListConfig({
  filterList: [...],                                    // visible to user
  staticFilters: { playerId: props.playerId },          // always in payload
})
```

- Type: `Record<string, string | string[] | number | number[]>`.
- Supports dynamics: `computed(() => ({ projectId: route.params.projectId }))`.
- Merges with `filterList` into one flat `filter` API object. Regular filters can override.
- Pair with `listKey = computed(() => Object.values(staticFilters.value).join('-'))` to restart the list when the value changes.

---

## `selectable` + `withMultipleActions` (BaseListConfig)

Checkboxes in rows + bulk action toolbar.

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
- `BaseListSlots.PrependMultipleAction` (`#prepend-multiple-action`) — button BEFORE built-ins. Props: `{ canUpdate }`.

```vue
<template #[BaseListSlots.MultipleActions]="{ canUpdate, entityName }">
  <VBtn v-if="canUpdate" @click="onArchive(baseListSelectionStore.getAllSelectedIdsArr(entityName))">
    {{ $t('action.archive') }}
  </VBtn>
</template>
```

Get selected IDs: `useBaseListSelection().getAllSelectedIdsArr(entityName)`.  
After action: `clearSelectedIds(entityName)` + `listRef.reFetchList()`.  
Filter which rows can be selected: `canUpdateCb` / `canRemoveCb` in `useList`.

---

## `loadingEndpointArr` (BaseSectionConfig)

Tracks loading state of external endpoints to disable Save and show errors. Not an endpoint override.

```ts
new BaseSectionConfig({
  loadingEndpointArr: ['games/producers/games/list', 'valdemoro/dictionary'],
})
```

If any listed endpoint is loading or errored — Save is disabled. Use when a form depends on external dictionary/nested list loads.

---

## Non-Standard API via Custom `useStore`

Use when backend registers an endpoint non-standardly (`.Get` instead of `.Read`, `.Fetch` instead of `.List`) or when you need custom response transformation.

**Use cases:**
- Non-standard API type.
- Combining multiple requests into one response.
- In-memory filtering (like `useEnabledGamesStore`).
- Dependent/cascading requests.

**Minimal store template:**
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

    async readEntity({ id }) {
      const { data } = await ApiService.request({
        type: 'App.V2.VipService.Seasons.Get', // ← non-standard
        data: { id },
      })
      return data
    },

    async createEntity({ data: { form } }) {
      const { data } = await ApiService.request({
        type: 'App.V2.VipService.Seasons.Create',
        data: form,
      })
      return data
    },
    // updateEntity / deleteEntity analogously
  },
})
```

Wire it in `useSection.ts`:
```ts
export const useForm = (): UseEntityType<VipSeasonsForm> => ({
  entityName,
  pageName,
  EntityFormClass: VipSeasonsForm,
  useStore: useVipSeasonsStore,
})
```

`entityName` is still required — used for UI (breadcrumbs, i18n, permissions). API type is fully defined inside the store.

**Standard `baseStoreCore` method signatures** (`cardona-core-service/src/stores/baseStoreCore.ts`):
- `fetchEntityList({ type, data, options })` → `ListData`
- `readEntity({ type, id, customApiPrefix? })`
- `createEntity({ type, data: { form, formRef } })`
- `updateEntity({ type, data: { form, formRef } })`
- `deleteEntity({ type, id, comment })`
- `multipleUpdateEntity({ type, data: [{id, isActive}] })`
- `toggleStatusEntity(...)`

Custom store implements the same signatures — no inheritance needed.

---

## Form Lifecycle Hooks (UseEntityType)

Five optional hooks in `useForm`:

| Hook | When | Signature | Use case |
|---|---|---|---|
| `onReceiveEntity` | After Read, before form fill | `(entity, isForAnotherProject) => Promise<void>` | Normalize response, load related data |
| `onSerializeFormCb` | Before Create/Update request | `(transformed, rawForm) => Record` | Transform payload structure |
| `onBeforeSubmitCb` | Before API call | `(formData) => boolean` | Preflight validation or confirmation modal. `false` cancels submit |
| `onSubmitCallback` | After successful Create/Update | `(id: string) => Promise<void>` | Refresh other stores, side effects |
| `validationErrorCb` | On backend validation error | `(entity, { field, code, params, template }) => { localeKey, fieldKey?, toastOptions? }` | Map backend errors to form fields |

**`onBeforeSubmitCb` with modal:**
```ts
onBeforeSubmitCb: (formData) => {
  if (formData.gamesCount === 0) {
    modal.showModal(ModalsId.ConfirmModal, { title: '...' })
    return false
  }
  return true
}
```

**`validationErrorCb`:**
```ts
validationErrorCb: (entity, { field, code, params }) => ({
  localeKey: `${entity}_${field}_${code}`,
  fieldKey: field === 'shortCode' ? 'value' : undefined,
  toastOptions: { title: Object.values(params).join(' ') },
})
```

**`onSubmitCallback`:**
```ts
onSubmitCallback: async (id) => {
  if (userStore.userInfo.projects.some(p => p.id === id))
    await userStore.fetchCurrentUser()
}
```

**`transformFormData` nuance**: in `onSerializeFormCb` the first argument `transformed` already contains primitives — core-service called `.transformField()` on each BaseField before invoking the callback. Use `transformed.bonus`, not `transformed.bonus.value`. To access original BaseFields — use the second argument `rawForm: Ref<FormModel>`.

---

## `backToTheHistoryLast` (BaseSectionConfig)

Cancel button goes back in browser history instead of redirecting to list. Use when the form is opened from a deep navigation flow or modal context.

```ts
new BaseSectionConfig({ backToTheHistoryLast: true })
```

---

## `onePermissionKey` (BaseSectionConfig / BaseListConfig)

One key controls all operations (view/create/update/delete). Use for binary access sections.

```ts
new BaseListConfig({ onePermissionKey: PermissionType.X })
```

---

## `noPermissionPrefix` (BaseSectionConfig)

Disables automatic `backoffice-` prefix when building permission. Use when the key already has its own prefix or is outside the standard scheme.

---

## Color / Gradient Field

API returns one string: `#RRGGBB` (hex) or `linear-gradient(...)`.

Read before implementing:
- Model (colorField, gradientColorField, constructor, serialization): `src/@model/banners.ts`
- SectionForm.vue (watch + template): `src/pages/promo/banners/_components/BannerForm.vue`

---

## Date Range Validation (startDate ≤ endDate)

For forms with a date pair where start must not exceed end.

Reference: `src/@model/tournaments/tournamentsStatic.ts` — private `startDateValidatorCb` / `endDateValidatorCb`, `custom_cb` on fields.

---

## `BaseSectionSlots.Actions` — Custom Form Footer

Use only when Save must be hidden by a business condition (not permission), e.g. by entity status.

References: `src/pages/valdemoro/update/index.vue`, `src/pages/settings/pushNotifications/index.vue`.