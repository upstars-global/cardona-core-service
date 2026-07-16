# Advanced Form Patterns

Read the section you need. These attach to the form built in `section-form/SKILL.md`.

## Table of contents
- Optional tabs: Localization · SEO · GamesCard
- Configs: `loadingEndpointArr` · `backToTheHistoryLast` · `onePermissionKey` · `noPermissionPrefix`
- Non-standard API via custom `useStore` (full CRUD)
- Form lifecycle hooks · `transformFormData` nuance
- Color/gradient field · Date-range validation · `BaseSectionSlots.Actions`

---

## Localization Tab

Multilingual editing of selected fields. Reference: `src/pages/gamification/levels/`.

**Model (`<Name>Form`):**
- Each localizable field: `isLocalization: true` + `form: data`. Without `form: data`, `LocaleForm` can't init.
- Two extra fields:
  ```ts
  fieldTranslations: TranslationForm
  localisationParameters: Record<string, object>
  ```
- At the **end** of the constructor (after all BaseFields):
  ```ts
  this.fieldTranslations = getTranslationForm(this, data)
  this.localisationParameters = data?.localisationParameters || {}
  ```
- Imports: `TranslationForm`, `getTranslationForm` from `cardona-core-service/src/@model/translations`.
- Extend the Read interface: `fieldTranslations?`, `localisationParameters?`.

**`SectionForm.vue`:**
```vue
<VWindowItem eager :value="FormTabs.Localization">
  <LocaleForm v-model="formData.fieldTranslations" :form="formData" type="vipSeasons" :disabled="isDisabledField" />
</VWindowItem>
```
`eager` is required. `LocaleForm` is auto-imported.

**i18n:** `locale.<type>.<fieldKey>` = label (e.g. `locale.vipSeasons.name` = "Content"). Without it, raw keys appear in the UI. `fieldTranslations` / `localisationParameters` serialize automatically via `transformFormData` — no `onSerializeFormCb` needed.

## SEO Tab

Meta fields: metaTitle / metaDescription / description. Used rarely (Games, StaticPages, Tournaments).
- Fields grouped into a `seo` sub-object in the payload.
- All three have `isLocalization: true` — they go into `fieldTranslations` automatically.
- Permission key: `<entityNamePermission>-seo` — register on the backend separately.
- If not needed: `ignoreSeoPermission: true` in `BaseSectionConfig`.

References: `src/@model/staticPages.ts`, `src/pages/promo/staticPages/_components/SectionForm.vue`.

## GamesCard Tab (game selection)

Two-panel game picker with drag-n-drop and locked positions. Used rarely.

References: `src/pages/games/categories/_components/GamesCategoriesForm.vue`, `src/pages/gamification/achievements/_components/SectionForm.vue`.

---

## `loadingEndpointArr` (BaseSectionConfig)

Tracks the loading state of external endpoints to disable Save and surface errors. Not an endpoint override.

```ts
new BaseSectionConfig({
  loadingEndpointArr: ['games/producers/games/list', 'valdemoro/dictionary'],
})
```
If any listed endpoint is loading or errored, Save is disabled. Use when a form depends on external dictionary/nested-list loads.

## `backToTheHistoryLast` (BaseSectionConfig)

Cancel goes back in browser history instead of redirecting to the list. Use when the form is opened from a deep flow or modal context.
```ts
new BaseSectionConfig({ backToTheHistoryLast: true })
```

## `onePermissionKey` (BaseSectionConfig / BaseListConfig)

One key controls all operations (view/create/update/delete). Use for binary-access sections.
```ts
new BaseListConfig({ onePermissionKey: PermissionType.X })
```

## `noPermissionPrefix` (BaseSectionConfig)

Disables the automatic `backoffice-` prefix when building the permission. Use when the key already has its own prefix or is outside the standard scheme.

---

## Non-Standard API via Custom `useStore` (full CRUD)

Use when the backend registers endpoints non-standardly (`.Get` instead of `.Read`, `.Fetch` instead of `.List`), combines requests, does in-memory filtering, or needs cascading requests. `entityName` is still required (UI: breadcrumbs, i18n, permissions); the API type is defined inside the store.

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
        sort: data.sort, filter: data.filter,
      })
      return new ListData(payload)
    },
    async readEntity({ id }) {
      const { data } = await ApiService.request({ type: 'App.V2.VipService.Seasons.Get', data: { id } })
      return data
    },
    async createEntity({ data: { form } }) {
      const { data } = await ApiService.request({ type: 'App.V2.VipService.Seasons.Create', data: form })
      return data
    },
    // updateEntity / deleteEntity analogously
  },
})
```

Wire it in `useSection.ts`:
```ts
export const useForm = (): UseEntityType<VipSeasonsForm> => ({
  entityName, pageName, EntityFormClass: VipSeasonsForm, useStore: useVipSeasonsStore,
})
```

**Standard `baseStoreCore` signatures** (`cardona-core-service/src/stores/baseStoreCore.ts`): `fetchEntityList({ type, data, options })` → `ListData`; `readEntity({ type, id, customApiPrefix? })`; `createEntity({ type, data: { form, formRef } })`; `updateEntity({ type, data: { form, formRef } })`; `deleteEntity({ type, id, comment })`; `multipleUpdateEntity({ type, data: [{id, isActive}] })`; `toggleStatusEntity(...)`. A custom store implements the same signatures — no inheritance needed.

## Form Lifecycle Hooks (UseEntityType)

Five optional hooks in `useForm`:

| Hook | When | Signature | Use case |
|---|---|---|---|
| `onReceiveEntity` | After Read, before form fill | `(entity, isForAnotherProject) => Promise<void>` | Normalize response, load related data |
| `onSerializeFormCb` | Before Create/Update request | `(transformed, rawForm) => Record` | Transform payload structure |
| `onBeforeSubmitCb` | Before API call | `(formData) => boolean` | Preflight validation / confirm modal. `false` cancels submit |
| `onSubmitCallback` | After successful Create/Update | `(id: string) => Promise<void>` | Refresh other stores, side effects |
| `validationErrorCb` | On backend validation error | `(entity, { field, code, params, template }) => { localeKey, fieldKey?, toastOptions? }` | Map backend errors to fields |

```ts
onBeforeSubmitCb: (formData) => {
  if (formData.gamesCount === 0) { modal.showModal(ModalsId.ConfirmModal, { title: '...' }); return false }
  return true
}
validationErrorCb: (entity, { field, code, params }) => ({
  localeKey: `${entity}_${field}_${code}`,
  fieldKey: field === 'shortCode' ? 'value' : undefined,
  toastOptions: { title: Object.values(params).join(' ') },
})
onSubmitCallback: async (id) => {
  if (userStore.userInfo.projects.some(p => p.id === id)) await userStore.fetchCurrentUser()
}
```

**`transformFormData` nuance:** in `onSerializeFormCb` the first argument `transformed` already holds primitives — core-service called `.transformField()` on each BaseField before the callback. Use `transformed.bonus`, not `transformed.bonus.value`. For the original BaseFields, use the second argument `rawForm: Ref<FormModel>`.

## Color / Gradient Field

API returns one string: `#RRGGBB` or `linear-gradient(...)`. Read before implementing: model — `src/@model/banners.ts`; SectionForm (watch + template) — `src/pages/promo/banners/_components/BannerForm.vue`.

## Date-Range Validation (startDate ≤ endDate)

Reference: `src/@model/tournaments/tournamentsStatic.ts` — private `startDateValidatorCb` / `endDateValidatorCb`, `custom_cb` on fields.

## `BaseSectionSlots.Actions` — custom form footer

Use only when Save must be hidden by a business condition (not a permission), e.g. by entity status. References: `src/pages/valdemoro/update/index.vue`, `src/pages/settings/pushNotifications/index.vue`.
