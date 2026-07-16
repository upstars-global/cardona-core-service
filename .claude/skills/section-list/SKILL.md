---
name: section-list
description: Create a list page (BaseList) for a section in a cardona-core-service backoffice — the route (list-only), the menu item, the list model, `useSection.ts` with `useList`, and `list/index.vue`. Use whenever the user wants a list/table view without a create/edit form: "make a list-only section", "add a list page for X", "show a table of Y", "раздел только со списком", "список без формы". Also Stage 4 (+ its route & menu) when building a full section. Produces a working, navigable list with real API data; the create/update form is a separate step (`section-form`).
---

# Create a List Section

The target is a Vue 3 + TS + Pinia + Vuetify backoffice built on `cardona-core-service`. This skill builds a **list-only** section: it registers a route for just the list, adds the menu item, and implements the list model + `BaseList` page. Many sections in such an app are list-only (e.g. `malaga/notifications`, `players/transactions`, `logs/logging`, `payouts/rules`, `cashbox/clearBalance`), so this is a common, complete deliverable on its own.

If a create/edit form will be added later, do **not** create create/update files here — that belongs to the `section-form` skill, which extends the files this skill produces.

## Execution model — delegate to the worker subagent

This skill can run in a dedicated subagent so the main window stays clean and the build runs on a cheaper model (Sonnet). Route by who you are:

- **You are the main assistant**: gather the inputs first — section name, permission key (`PermissionType` member), menu group + neighbor, pages folder, i18n prefix, `entityName`; plus the real List JSON + a Figma/column spec **if you already have them**. Launch the Agent tool with `subagent_type: 'section-list'`, passing everything in the prompt. Then:
  - If you had **no** real List JSON, the subagent builds the 4.1 skeleton and returns asking for the `App.V2.<...>.List` JSON — relay that to the user, get the JSON, then launch the subagent **again** with the JSON (and note the skeleton already exists) to build the full list.
  - Relay the subagent's final summary to the user after each run.
  Gather inputs BEFORE launching — the subagent can't stop to ask.
- **You are the `section-list` subagent** (your system prompt says so): execute the steps below and return only the summary, per your system prompt.

If the subagent is unavailable, run the steps inline.

**Prerequisite:** the permission key must already exist in `src/configs/permissions.ts`. If it doesn't, run the `backoffice-permissions` skill first (or ask the user for the `backoffice-*` key).

## Pre-flight — collect before starting

1. **Section name** (camelCase) — e.g. `vipSeasons`. Drives route name (`VipSeasonsList`), menu `to`, folder.
2. **Permission key** — the `PermissionType` member (from `backoffice-permissions`).
3. **Menu group** + neighbor to place next to (`Gamification`, `Players`, `Promo`, `Settings`, …).
4. **Pages folder** — `src/pages/<folder>/`, usually matches the menu group.
5. **i18n key prefix** — `title.<key>` / `page.<key>`. Suggest from the section name and confirm (established keys sometimes differ from camelCase).
6. **`entityName`** — backend hyphen format (e.g. `'Vip-ServiceSeason-Vip-Status'`). Do not guess — the exact string determines the API type. Find it in Swagger or ask backend.

---

## Stage A — Route (list-only, via a manual module file)

The route generator `sectionRouterGenerator` (`src/helper/router.ts`) **cannot** emit a list-only route: for any non-`isSingleRoute` entry it always registers list **+ create + update**. So a list-only section registers its route with a **hand-written module file**, exactly like existing sections do (`modules/logging.ts`, `modules/payouts.ts`, `modules/malagaChannels.ts`).

Create `src/plugins/2.router/modules/<section>.ts` with a **single list route**:

```ts
import { PermissionType } from '@permissions'

const permission = PermissionType.BackofficeVipSeasons
const listPageName = 'VipSeasonsList'
const path = '/:project/gamification/vip-seasons'

const vipSeasons = [
  {
    path,
    name: listPageName,
    component: () => import(`@/pages/gamification/vipSeasons/list/index.vue`),
    meta: {
      title: `vipSeasons.list`,
      permission,
      breadcrumb: [{ title: `vipSeasons.list`, active: true }],
    },
  },
]

export default vipSeasons
```

Then wire it into `src/plugins/2.router/additional-routes.ts`: add `import vipSeasons from './modules/vipSeasons'` at the top and spread `...vipSeasons` into the `routes` array (after the `sectionRouterGenerator([...])` block, alongside the other module spreads).

**Naming rules** (keep them identical to what the generator would produce, so `section-form` can later upgrade this to a generator entry seamlessly):
- Route name: `<PascalName>List` (`prefixName` prepended if the section uses one).
- URL: kebab-case path, prefixed `/:project/…` — unless the section is not project-scoped, then no `/:project`. Keep `:project` literal.
- `meta.title` and breadcrumb use `<key>.list` (the i18n prefix).

**Single-page alternative:** if the design is a single standalone list page (no `list/` subfolder, `BaseList` right in `index.vue` — like `players/players`, `cashbox/clearBalance`), use a generator entry with `isSingleRoute: true` in `additional-routes.ts` instead of a module file. Note this shape is harder to grow into a form later; prefer the module-file + `list/` folder when a form might follow.

**IRouterConfig flags** (for reference / the generator path): `sectionName`, `withoutSectionNameInUrl`, `isProject`, `isPermissionGroup`, `isConvertName`, `withCard`, `isSingleRoute`, `prefixName`.

---

## Stage B — Menu

In `src/navigation/vertical/apps-and-pages/buildMenu.ts`, add to the group's `children` (e.g. under `title: 'title.gamification'`), placed next to the neighbor from pre-flight:

```ts
{
  title: 'title.vipSeasons.list',
  to: 'VipSeasonsList',
  permission: PermissionType.BackofficeVipSeasons,
},
```

In `en.json` add the `title` key (only the `list` key is needed now; `create`/`edit` are added by `section-form`):

```json
"vipSeasons": { "list": "VIP Seasons" }
```

`list` serves both the menu label and the list breadcrumb.

---

## Stage C — List implementation

Two sub-stages: build a minimal skeleton, capture the real API response, then implement fully. Swagger/Postman schemas are often incomplete, so the real Network response is the source of truth.

### C.1 — Minimal skeleton (to capture the real JSON)

> ⚠️ **`pageName`** — always pass `pageName` in `useList()` when `entityName` (backend hyphen format, e.g. `'Vip-ServiceSeasons'`) doesn't match the PascalCase route prefix (`'VipSeasons'`). Without it, BaseList derives the route name from `entityName` → `checkExistsPage` returns false → Create/Edit/Make-a-copy buttons never appear even with correct permissions. (Matters once a form is added, but set it now.)

1. Minimal model `src/@model/<name>.ts` (or `src/@model/<group>/<name>.ts`) with `I<Name>ListItemData` (just `id` + one field). Project pattern: `IBannerListData`, `IAchievementsListData`, `IVipSeasonListData`.
   ```ts
   interface IVipSeasonListData { id: string; name: string }
   ```
2. `useSection.ts` — export `useList` only (no `useForm` yet):
   ```ts
   const entityName = 'Vip-ServiceSeason-Vip-Status'
   const pageName = 'VipSeasons' // required — entityName ≠ route prefix

   export const useList = () => ({
     entityName,
     pageName,
     ListFilterModel: FilterSearch,
     tableFields: [new TableField({ value: 'id' })],
   })
   ```
3. Replace nothing else yet — `list/index.vue` with a minimal `BaseList`:
   ```vue
   <BaseList :list-config="listConfig" :use-list="useList" />
   ```
   `BaseListConfig`: minimal — `withSearch: false`, `sidebar: false`, and `withCreateBtn: false` (no form yet).

   > ⚠️ **`permissionKey`** — the fallback builds the key from `entityName` via `convertCamelCase` and almost never matches the real key. Always set `permissionKey: PermissionType.X` explicitly in `BaseListConfig`.

4. `yarn dev` → open the list → DevTools → Network → find `App.V2.<TransformedName>.List` → copy the **full** JSON response. **Stop and get from the user: (a) the JSON response, (b) the Figma link.**

### C.2 — Full list implementation

With the real JSON + Figma:
1. Extend the model with all fields from the JSON. Add a `SideBar` class if a preview sidebar is needed.
2. Extend `useList()` with all columns (`ListFieldType`), filters, and `SideBarModel`.
3. Extend `BaseListConfig` — `filterList`, `withSearch`, `emptyText`, `sidebar`, etc. Keep `withCreateBtn: false`.

   Before building a custom component for a non-standard column (period/progress/countdown, status badge, image+description) — **grep the project first**; they usually already exist and can be imported by absolute path.

4. Add i18n keys:
   - `page.<name>.*` — column headers / filter labels.
   - `emptyState.<name>` — empty-list text (take the exact wording from Figma).
   - Remove modal — only relevant once rows are deletable (a form/delete exists); the two mutually-exclusive approaches (`entities.<EntityName>` vs `modal.remove<EntityName>.{title,description}`) are covered by `section-form`.

5. `yarn typecheck && yarn lint && yarn dev` → verify columns, filters, search, and the Network request.

---

## How `entityName` becomes an API type

`transformNameToType` in `cardona-core-service/src/stores/baseStoreCore.ts`:

| Rule | Action |
|---|---|
| First character | UPPERCASE |
| Hyphen | remove |
| Character right after a hyphen | stays UPPERCASE, no dot added |
| Other UPPERCASE character | prefix with `.` |

Examples: `'Levels'` → `App.V2.Levels.List`; `'Vip-Manager'` → `App.V2.VipManager.List`; `'Vip-ServiceSeason-Vip-Status'` → `App.V2.VipService.SeasonVipStatus.List`; `'Neo-core-Users'` → `App.V2.NeoCore.Users.List`; `'Players-BonusHistory'` → `App.V2.Players.BonusHistory.List`. `ApiTypePrefix` = `App.V2.` (`src/configs/productConfig.ts`). Override via `customApiPrefix` in `BaseListConfig`.

## File structure (list part)

```
src/pages/<group>/<section>/
├── list/index.vue
└── useSection.ts          # useList (+ entityName, pageName)
src/@model/<group>/<name>.ts  # or src/@model/<name>.ts — I<Name>ListItemData, SideBar
src/plugins/2.router/modules/<section>.ts   # list route
```

## Naming conventions

- camelCase section: `vipSeasons` · PascalCase route: `VipSeasonsList` · kebab URL: `/vip-seasons` · permission enum: `BackofficeSeasonVipStatus` · `entityName` backend hyphen: `'Vip-ServiceSeason-Vip-Status'` (ask, don't guess).

## Advanced list patterns

For less common needs, read `references/advanced-list.md`: `staticFilters` (hidden filters always sent, e.g. `playerId` in a child list), `selectable` + `withMultipleActions` (checkboxes + bulk actions), Sidebar Preview (right-side preview on row click), and a custom Pinia store for non-standard list endpoints.

## Next step

To make entities creatable/editable, use the `section-form` skill — it adds the create/update routes and pages and **extends** the `useSection.ts` and `@model/<name>.ts` this skill created.

## Commands

`yarn dev` · `yarn typecheck` · `yarn lint` · `yarn test:unit`
