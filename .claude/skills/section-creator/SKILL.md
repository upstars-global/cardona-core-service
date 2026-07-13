---
name: section-creator
description: Step-by-step creation of a new CRUD section in Cardona backoffice. Use for requests like "add a new section", "create section X", "make a list page with create/edit for Y". The skill guides through 5 stages — permissions → routes → menu → list → create/update — and EACH stage requires user confirmation before moving to the next.
---

# Adding a New Section to Cardona

Cardona — Vue 3 + TS + Pinia + Vuetify backoffice. All sections follow the same pattern. This skill walks through 5 stages of creating a new CRUD section.

## General Flow

**CRITICAL**: work strictly stage by stage. After each stage — stop, report to the user, wait for confirmation before the next stage. Do not "do everything at once".

1. **Permissions** — add access key + localization
2. **Routes** — via generator + stub pages (always)
3. **Menu** — item in the side navigation
4. **List** — model (list part), `useSection.ts` (useList + listConfig), fill `list/index.vue`
5. **Create / Update** — form model, `SectionForm.vue`, fill `create/index.vue` and `update/index.vue`

## Pre-flight Checklist — Collect from User Before Any Stage

Ask for all of these upfront; don't proceed without them:

1. **Section name** (camelCase) — e.g. `vipSeasons`. Drives route names (`VipSeasonsList/Create/Update`) and menu `to`.
2. **Permission key** (`backoffice-<...>` format) — comes from backend. **Do not guess.**
3. **Menu group** — existing group name (`Gamification`, `Players`, `Promo`, `Settings`, …) + neighboring item to place next to.
4. **Pages folder** — `src/pages/<folder>/`. Usually matches menu group (`gamification`, `players`, …).
5. **Page set** — usually CRUD (List + Create + Update). Sometimes `isSingleRoute`, `withCard`.

---

## Stage 1: Permissions

### Files
- `src/configs/permissions.ts` — `PermissionType` enum + groups (default object).
- `src/plugins/i18n/locales/en.json` — localized name for the roles screen.

### What to Ask

| What | Behavior |
|---|---|
| **Permission key** (`backoffice-<...>`) | **Must ask** — comes from backend, not derived from section name. |
| **Localized name** (en.json value) | Suggest based on section name (`vipSeasons` → `"VIP Seasons"`) and confirm. |
| Enum name (PascalCase) | Derive from key: `backoffice-season-vip-status` → `BackofficeSeasonVipStatus`. |
| Group + placement | Derive from menu group. Confirm which neighbor to place after. |

### What to Do

1. Add to `enum PermissionType` near thematically related keys:
   ```ts
   BackofficeSeasonVipStatus = 'backoffice-season-vip-status',
   ```

2. Add to the group's `default` array. **Order must match future menu order** — roles screen uses the same order:
   ```ts
   {
     target: PermissionType.BackofficeSeasonVipStatus,
     type: PermissionFormType.Table,
   },
   ```
   - `type`: `Table` (levels 0–4) or `Switch` (binary).
   - `notAccessLevel: [2, 4]` — forbidden levels if backend doesn't support create/delete. Ask the user only if similar nearby sections already use it — otherwise default to `Table` with no restrictions.

3. Add to `en.json` among other `backoffice-*` keys:
   ```json
   "backoffice-season-vip-status": "VIP Seasons",
   ```

### Stage 1 Check

Confirm: added `<key>` to group `<group>` after `<sibling>`. Run `yarn typecheck && yarn lint`. **Stop. Waiting for "do stage 2".**

---

## Stage 2: Routes

### Principle

Use **only the generator** `sectionRouterGenerator` from `src/helper/router.ts`. No manual routes.

### Files
- `src/plugins/2.router/additional-routes.ts` — generator config.
- `src/pages/<folder>/<sectionName>/{list,create,update}/index.vue` — pages.

### What to Ask

| What | Behavior |
|---|---|
| **i18n key prefix** (`title.<key>`) | Suggest based on section name (`vipSeasons` → `title.vipSeasons`) and confirm. Established keys sometimes differ from camelCase. |
| Permission for route | Take from Stage 1. Always pass explicitly — don't rely on generator default. |
| Stub pages | **Always create at this stage.** Menu at Stage 3 will 404 without them. |

### What to Do

1. Add to the appropriate block in `additional-routes.ts`:
   ```ts
   { name: 'vipSeasons', sectionName: 'gamification', permission: PermissionType.BackofficeSeasonVipStatus },
   ```
   **IMPORTANT**: the generator fallback builds permission as `${permissionPrefix}-${convertCamelCase(name, '-')}` — almost never matches the real key. Always pass it explicitly.

   Other options: `isSingleRoute`, `withCard`, `isPermissionGroup`, `withoutSectionNameInUrl`, `isProject: false`, `prefixName`, `isConvertName`.

2. Generated routes for `{ name: 'vipSeasons', sectionName: 'gamification' }`:

   | Route name | URL | Component |
   |---|---|---|
   | `VipSeasonsList` | `/:project/gamification/vip-seasons` | `pages/gamification/vipSeasons/list/index.vue` |
   | `VipSeasonsCreate` | `/:project/gamification/vip-seasons/create/:type?/:id?` | `pages/gamification/vipSeasons/create/index.vue` |
   | `VipSeasonsUpdate` | `/:project/gamification/vip-seasons/update/:id` | `pages/gamification/vipSeasons/update/index.vue` |

3. Create stub pages for each route (list/create/update):
   ```vue
   <script lang="ts" setup>
   defineOptions({ name: 'VipSeasonsList' })
   </script>
   <template>
     <div class="pa-4">
       <h2>VIP Seasons — List</h2>
       <p>Stub. Implementation pending.</p>
     </div>
   </template>
   ```

### Stage 2 Check

Confirm the routes table above. Run `yarn typecheck && yarn lint`. **Stop. Waiting for "do stage 3".**

---

## Stage 3: Menu

### Files
- `src/navigation/vertical/apps-and-pages/buildMenu.ts` — menu items.
- `src/plugins/i18n/locales/en.json` — title keys.

### What to Do

1. In `buildMenu.ts` in the group's `children` (e.g. `title: 'title.gamification'`):
   ```ts
   {
     title: 'title.vipSeasons.list',
     to: 'VipSeasonsList',
     permission: PermissionType.BackofficeSeasonVipStatus,
   },
   ```
   Place in the order specified by design/Figma — next to the neighbor given in the pre-flight.

2. In `en.json`, `title` section — add next to the neighboring section:
   ```json
   "vipSeasons": {
     "list": "VIP Seasons",
     "create": "VIP Season creation",
     "edit": "VIP Season editing"
   },
   ```
   All three keys are needed: `list` — menu + list breadcrumb; `create`/`edit` — inner page breadcrumbs.

### Stage 3 Check

Run `yarn typecheck && yarn lint`. Optionally `yarn dev` to verify the menu item appears and navigates to the stub. **Stop. Waiting for "do stage 4".**

---

## i18n Key Map

All i18n keys added across all stages — helpful to have the full picture:

```jsonc
// Stage 1 — permission label (roles screen)
"backoffice-season-vip-status": "VIP Seasons",

// Stage 3 — menu + breadcrumbs
"title": {
  "vipSeasons": {
    "list": "VIP Seasons",
    "create": "VIP Season creation",
    "edit": "VIP Season editing"
  }
},

// Stage 4 — column headers, filter labels
"page": {
  "vipSeasons": {
    "name": "Name",
    "status": "Status"
  }
},

// Stage 4 — empty list state (take exact text from Figma)
"emptyState": {
  "vipSeasons": "No VIP seasons created yet"
},

// Stage 4 — remove modal (choose one approach, see Stage 4.2)
"entities": { "VipSeasons": "VIP Season" },
// OR
"modal": {
  "removeVipSeasons": {
    "title": "Remove VIP Season",
    "description": "Are you sure you want to remove this VIP Season?"
  }
}
```

---

## Stage 4: List

At this stage we build **only the list page**. Create/edit form — Stage 5.

**Stage 4 is two sub-stages.** "Do stage 4" = run only 4.1. After receiving JSON from user → run 4.2.

---

### Stage 4.1: Minimal Skeleton (capture real API response)

> ⚠️ **CRITICAL — `pageName`**: Always pass `pageName` in `useList()` when `entityName` (backend hyphen format, e.g. `'Vip-ServiceSeasons'`) doesn't match the PascalCase route prefix (`'VipSeasons'`). Without it, BaseList derives the route name from `entityName` → `checkExistsPage` returns false → **Create / Edit / Make a copy buttons won't appear**, even with correct permissions.

Goal: get a working `BaseList` that makes a real API request so the user can copy the **full** JSON response from Network tab. Swagger/Postman schemas are often incomplete.

#### What to Ask

1. **`entityName`** — backend hyphen format (e.g. `'Vip-ServiceSeason-Vip-Status'`). Do not guess — the exact string determines the API type. Find it in Swagger or ask the backend team.

#### What to Do

1. Create minimal model `src/@model/<name>.ts` with `I<Name>ListData` (just `id` + one field):
   ```ts
   interface IVipSeasonListData { id: string; name: string }
   ```
   Project pattern: `IBannerListData`, `IAchievementsListData`, `IVipSeasonListData`.

2. Create `useSection.ts`:
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

3. Replace stub `list/index.vue` with minimal `BaseList`:
   ```vue
   <BaseList :list-config="listConfig" :use-list="useList" />
   ```
   `BaseListConfig` — minimal: `permissionKey` (explicit!), `withSearch: false`, `sidebar: false`.

   > ⚠️ **CRITICAL — `permissionKey`**: The fallback builds from `entityName` via `convertCamelCase` and almost never matches the real key. Always set `permissionKey: PermissionType.X` explicitly in `BaseListConfig` and `BaseSectionConfig`.

4. Do **not** add columns or filters yet — that's 4.2.

#### Check After 4.1

`yarn dev` → open list page → DevTools → Network → find `App.V2.<TransformedName>.List` → copy full JSON response. **Stop. Waiting from user: (a) JSON response + (b) Figma link.**

---

### Stage 4.2: Full List Implementation

#### What to Ask

1. **Real List JSON** from step 4.1 — exact field names as backend returns them.
2. **Figma link** to list design (`figma.com/design/<fileKey>/...?node-id=<nodeId>`). Fallback — screenshot.

#### What to Do

1. Extend model with all fields from JSON. Add `SideBar` class if sidebar is needed.
2. Extend `useList()` with all columns (`ListFieldType`), filters, `SideBarModel`.
3. Extend `BaseListConfig` — `filterList`, `withSearch`, `emptyText`, `sidebar`, etc.

   Before building a custom component for non-standard columns (period/progress/countdown, status badge, image with description) — **grep the project first**. They often exist in specific folders and can be imported by absolute path.

4. Add i18n keys (see [i18n Key Map](#i18n-key-map) above):
   - `page.<name>.*` — column headers.
   - `emptyState.<name>` — take exact text from Figma.
   - Remove modal — choose **one** approach:
     - `entities.<EntityName>` (generic template with `.toLowerCase()`) — **avoid if name has abbreviations** (VIP → vip).
     - `modal.remove<EntityName>.{title,description}` (literal text, no lowercasing) — use when exact Figma text is needed or name has abbreviations. Examples: `removeVip-Manager`, `removeNeocoreUsers`.
     - These are **mutually exclusive**: if `entities.<EntityName>` exists, the direct keys are ignored.

#### Check After 4.2

`yarn typecheck && yarn lint && yarn dev` → check columns, filters, search, Network. **Stop. Waiting for "do stage 5".**

---

### How entityName Becomes an API Type

`transformNameToType` in `cardona-core-service/src/stores/baseStoreCore.ts:17-34`:

| Rule | Action |
|---|---|
| First character | UPPERCASE |
| Hyphen | remove |
| Character immediately after hyphen | UPPERCASE stays, no dot added |
| Other UPPERCASE character | prefix `.` |

Examples:
- `'Levels'` → `App.V2.Levels.List`
- `'Vip-Manager'` → `App.V2.VipManager.List`
- `'AdminMax-Bet-Limit'` → `App.V2.Admin.MaxBetLimit.List`
- `'Vip-ServiceSeason-Vip-Status'` → `App.V2.VipService.SeasonVipStatus.List`
- `'Neo-core-Users'` → `App.V2.NeoCore.Users.List` *(each hyphen: next char UPPERCASE, no dot)*
- `'Players-BonusHistory'` → `App.V2.Players.BonusHistory.List` *(uppercase mid-word adds dot)*

`ApiTypePrefix` = `App.V2.` (`src/configs/productConfig.ts:4`). Override via `customApiPrefix` in `BaseListConfig`.

### File Structure

```
src/pages/<group>/<sectionName>/
├── list/index.vue
├── create/index.vue
├── update/index.vue
├── useSection.ts
└── _components/SectionForm.vue

src/@model/<group>/<name>.ts   # or src/@model/<name>.ts if no group
```

---

## Stage 5: Create / Update

### Before Starting — Request from User

1. **Sample `Read`/`GetById` response** — usually more fields than the list item.
2. **Sample `Create`/`Update` request body** — often not all fields from Read.
3. **Form structure** — fields, grouping (cards/sections), validation, dependent dropdowns, multilingual fields.

### What to Do

1. Extend model in `src/@model/<name>.ts`:
   - `I<Name>Data` interface (full entity).
   - `<Name>Form` class with constructor (defaults, date conversion, API parsing). Pattern: `src/@model/levels.ts`.

2. Extend `useSection.ts`:
   ```ts
   export const sectionConfig = new BaseSectionConfig({
     permissionKey: PermissionType.BackofficeSeasonVipStatus,
   })

   export const useForm = (): UseEntityType<VipSeasonsForm> => ({
     entityName,
     pageName,
     EntityFormClass: VipSeasonsForm,
   })
   ```

3. **`create/index.vue`** — `BaseSection` with `PageType.Create` + `SectionForm` slot. Pattern: `src/pages/gamification/levels/create/index.vue`.

4. **`update/index.vue`** — `BaseSection` with `PageType.Update` + `SectionForm` + Remove button (by `canRemove`). Pattern: `src/pages/gamification/levels/update/index.vue`.

5. **`_components/SectionForm.vue`** — form fields via `FormField`/`BaseField` from cardona-core-service.

6. Add i18n keys for field labels, placeholders, validation errors.

### Stage 5 Check

`yarn typecheck && yarn lint && yarn dev` → create → edit → delete an entity. Verify Network: `App.V2.<...>.Create`, `.Read`, `.Update`, `.Delete`. **Done.**

---

## Optional Tabs and Patterns

Added on top of stages 4–5 when design requires. Each is independent.

**Available patterns:** [Localization Tab](#localization-tab) | [SEO Tab](#seo-tab) | [Sidebar Preview](#sidebar-preview-list) | [GamesCard Tab](#gamescard-tab-game-selection)

### Localization Tab

Multilingual editing of selected fields. Reference: `src/pages/gamification/levels/`.

**Model (`<Name>Form`):**
- Each localizable field: `isLocalization: true` + `form: data`. Without `form: data` LocaleForm can't init.
- Two extra fields:
  ```ts
  fieldTranslations: TranslationForm
  localisationParameters: Record<string, object>
  ```
- At the **end** of constructor (after all BaseFields):
  ```ts
  this.fieldTranslations = getTranslationForm(this, data)
  this.localisationParameters = data?.localisationParameters || {}
  ```
- Imports: `TranslationForm`, `getTranslationForm` from `cardona-core-service/src/@model/translations`.
- Extend Read interface: `fieldTranslations?`, `localisationParameters?`.

**`SectionForm.vue`:**
```vue
<VWindowItem eager :value="FormTabs.Localization">
  <LocaleForm v-model="formData.fieldTranslations" :form="formData" type="vipSeasons" :disabled="isDisabledField" />
</VWindowItem>
```
`eager` is required. `LocaleForm` is auto-imported.

**i18n:** `locale.<type>.<fieldKey>` = label (e.g. `locale.vipSeasons.name` = "Content"). Without this, raw keys appear in UI.

`fieldTranslations` / `localisationParameters` serialize automatically via `transformFormData` — no `onSerializeFormCb` needed.

### SEO Tab

Meta fields: metaTitle / metaDescription / description. Used rarely (Games, StaticPages, Tournaments).
- Fields grouped into `seo` sub-object in payload.
- All three have `isLocalization: true` — go into `fieldTranslations` automatically.
- Permission key: `<entityNamePermission>-seo` — register on backend separately.
- If not needed: `ignoreSeoPermission: true` in `BaseSectionConfig`.

References: `src/@model/staticPages.ts`, `src/pages/promo/staticPages/_components/SectionForm.vue`.

### Sidebar Preview (List)

Right sidebar with item preview on row click.

- `SideBar` class in model with `ViewInfo` fields (`ViewType`: Text, Badge, Date, Status, Link, …).
- `useList()` returns `SideBarModel: SideBar`.
- `BaseListConfig`: `sidebar: true`. For accordion: `sidebarCollapseMode: true` + `SideBarCollapseItem`.
- Imports: `ViewInfo`, `ViewType` from `cardona-core-service/src/@model/view`.
- i18n title: `title.<entityName>.sidebarTitle`.

References: `src/pages/gamification/levels/`, `src/pages/adminSection/users/useSection.ts`.

### GamesCard Tab (Game Selection)

Two-panel game picker with drag-n-drop and locked positions. Used rarely.

References: `src/pages/games/categories/_components/GamesCategoriesForm.vue`, `src/pages/gamification/achievements/_components/SectionForm.vue`.

---

## Advanced Configs and Hooks

For less common patterns — see [`references/advanced-patterns.md`](references/advanced-patterns.md):

| Pattern | When to use |
|---|---|
| `staticFilters` | Hidden filters always sent to API (e.g. `playerId` in child list) |
| `selectable + withMultipleActions` | Checkboxes + bulk actions toolbar |
| `loadingEndpointArr` | Disable Save while external endpoints load |
| Custom `useStore` | Non-standard API endpoints (`.Get` instead of `.Read`) |
| Form lifecycle hooks | `onReceiveEntity`, `onSerializeFormCb`, `onBeforeSubmitCb`, `onSubmitCallback`, `validationErrorCb` |
| `backToTheHistoryLast` | Cancel goes back in history instead of to list |
| Color/gradient field | API returns single string: hex or `linear-gradient(...)` |
| Date range validation | `startDate ≤ endDate` via `custom_cb` |
| `transformFormData` nuance | `transformed` arg in `onSerializeFormCb` is already primitives |
| `BaseSectionSlots.Actions` | Hide Save by business condition (not permission) |

---

## Useful Commands

- `yarn dev` — dev server (proxy to cardona-development)
- `yarn typecheck` — TS check (vue-tsc)
- `yarn lint` — ESLint --fix
- `yarn test:unit` — vitest

## Naming Conventions

- camelCase section name: `vipSeasons`
- PascalCase route name: `VipSeasonsList`
- kebab-case URL: `/vip-seasons`
- Permission enum: `BackofficeSeasonVipStatus = 'backoffice-season-vip-status'`
- `entityName`: backend hyphen format `'Vip-ServiceSeason-Vip-Status'` — **ask, don't guess**