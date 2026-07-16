---
name: section-form
description: Add a create/update form to an EXISTING list section in a cardona-core-service backoffice — the create/update routes and pages, the form model class, `useForm`/`sectionConfig`, `SectionForm.vue`, plus the remove modal. Use when the user wants to make a section editable: "add create/edit to X", "make Y creatable", "add a form to the list", "add create and update pages", "сделай раздел редактируемым", "добавь форму создания". Also Stage 5 of building a full section. It extends the `useSection.ts` and `@model` that the list already produced — it does not create a section from scratch (use `section-list` first for that).
---

# Add a Create/Update Form

The target is a Vue 3 + TS + Pinia + Vuetify backoffice built on `cardona-core-service`. This skill turns a list-only section into full CRUD: it adds the create + update routes and pages, the form model, and the remove flow. It **extends** what `section-list` built — the same `useSection.ts` and `src/@model/<name>.ts` — rather than creating new files.

**Prerequisite:** a working list section must already exist (its `useSection.ts` with `useList`, `@model/<name>.ts` with the list model, `list/index.vue`, and a route). If it doesn't, run `section-list` first.

## Execution model — delegate to the worker subagent

This skill can run in a dedicated subagent so the main window stays clean and the work runs on a cheaper model (Sonnet). Route by who you are:

- **You are the main assistant**: gather the inputs first — which existing list section, the sample Read/GetById response, the sample Create/Update body, and the form structure (fields, grouping, validation, multilingual/tabs). Launch the Agent tool with `subagent_type: 'section-form'`, passing all of it in the prompt, and relay its final summary to the user. Gather inputs BEFORE launching — the subagent can't stop to ask.
- **You are the `section-form` subagent** (your system prompt says so): execute the steps below and return only the summary, per your system prompt.

If the subagent is unavailable, run the steps inline.

## Request from the user before starting

1. **Sample `Read`/`GetById` response** — usually more fields than the list item.
2. **Sample `Create`/`Update` request body** — often a subset of Read.
3. **Form structure** — fields, grouping (cards/sections), validation, dependent dropdowns, multilingual fields.

---

## Stage A — Routes: upgrade to the generator, or extend the module

`section-list` registered the list route as a hand-written module file (`src/plugins/2.router/modules/<section>.ts`) because the generator can't do list-only. Now that the section becomes full CRUD, first check whether it fits the standard generator — full CRUD is exactly what `sectionRouterGenerator` produces natively (one entry → list + create + update), and ~46 sections use it, so converging there keeps the codebase consistent.

**Decide by inspecting the module** (`modules/<section>.ts`). It fits the generator when **all** hold:
- URL is the standard shape `/:project/<sectionName>/<kebab-name>` (built from `sectionName` + `name`), or a variant expressible with `IRouterConfig` flags.
- Only standard routes are present (list, and — to be added — create/update, optionally card). No extra custom routes like `view`, `settings`, `sortList`.
- Component paths are the standard `@/pages/<sectionName>/<name>/{list,create,update}/index.vue`.
- Permission and URL shape are expressible via `IRouterConfig`: `name`, `sectionName`, `permission`, `withCard`, `isProject`, `isPermissionGroup`, `isConvertName`, `prefixName`, `withoutSectionNameInUrl`.

### Fits → replace the module with a generator entry
1. Delete `src/plugins/2.router/modules/<section>.ts`.
2. Remove its `import` and `...<section>` spread from `additional-routes.ts`.
3. Add one entry to the `sectionRouterGenerator([...])` array:
   ```ts
   { name: 'vipSeasons', sectionName: 'gamification', permission: PermissionType.BackofficeVipSeasons },
   ```
   This registers `VipSeasonsList` + `VipSeasonsCreate` + `VipSeasonsUpdate` (+ `Card` if `withCard`).
   > Always pass `permission` explicitly — the generator fallback builds `${permissionPrefix}-${convertCamelCase(name,'-')}`, which almost never matches the real key.

### Doesn't fit → keep the module, append create/update, and tell the user
Notify the user plainly, e.g. *"роут не ложится на генератор (кастомный `view`-роут / нестандартный путь) — дописываю create/update в существующий модуль"*, then append two route blocks to `modules/<section>.ts`, matching the existing list block (pattern: `modules/malagaChannels.ts`):

```ts
import { PermissionLevel } from 'cardona-core-service/src/@model/permission'
// ... existing list block ...
{
  path: `${path}/create/:type?/:id?`,
  name: `VipSeasonsCreate`,
  component: () => import(`@/pages/gamification/vipSeasons/create/index.vue`),
  meta: {
    title: `vipSeasons.create`,
    permission,
    level: PermissionLevel.create,
    breadcrumb: [{ to: { name: listPageName }, title: `vipSeasons.list` }, { title: `vipSeasons.create`, active: true }],
  },
},
{
  path: `${path}/update/:id`,
  name: `VipSeasonsUpdate`,
  component: () => import(`@/pages/gamification/vipSeasons/update/index.vue`),
  meta: {
    title: `vipSeasons.edit`,
    permission,
    breadcrumb: [{ to: { name: listPageName }, title: `vipSeasons.list` }, { title: `vipSeasons.edit`, active: true }],
  },
},
```

Either way, the create/update route names must be `<PascalName>Create` / `<PascalName>Update` so BaseList's buttons resolve them.

---

## Stage B — Model & composable: LOCATE-AND-EXTEND (the key seam)

The list and the form **share** two files. Do **not** create new ones — find and extend what `section-list` produced.

1. **`src/@model/<name>.ts`** — append the form model to the file that already holds the list model:
   - `I<Name>Data` interface (full entity, from the Read sample).
   - `<Name>Form` class with a constructor (defaults, date conversion, API parsing) built from core `*BaseField` classes. Pattern: `src/@model/levels.ts`.
2. **`useSection.ts`** — append `sectionConfig` + `useForm` alongside the existing `useList` (reuse the same `entityName`/`pageName` consts):
   ```ts
   export const sectionConfig = new BaseSectionConfig({
     permissionKey: PermissionType.BackofficeSeasonVipStatus, // explicit — same reason as the list
   })

   export const useForm = (): UseEntityType<VipSeasonsForm> => ({
     entityName,
     pageName,
     EntityFormClass: VipSeasonsForm,
   })
   ```

## Stage C — Pages & form component

1. **`create/index.vue`** — `BaseSection` with `PageType.Create` + the `SectionForm` slot. Pattern: `src/pages/gamification/levels/create/index.vue`.
2. **`update/index.vue`** — `BaseSection` with `PageType.Update` + `SectionForm` + a Remove button gated by `canRemove`. Pattern: `src/pages/gamification/levels/update/index.vue`.
3. **`_components/SectionForm.vue`** — form fields via `FormField`/`BaseField` from cardona-core-service.

## Stage D — Wire the list for create/delete

In the list's `BaseListConfig`, flip `withCreateBtn: true` and add `withRemoveModal: true` (the list skill left `withCreateBtn: false`).

## Stage E — i18n

- Field labels, placeholders, validation errors for the form.
- `title.<name>.create` and `title.<name>.edit` (the list skill added only `.list`).
- **Remove modal** — pick **one** (mutually exclusive; if `entities.<EntityName>` exists, the direct keys are ignored):
  - `entities.<EntityName>` — generic template, lowercased via `.toLowerCase()`. Avoid when the name has abbreviations (VIP → vip).
  - `modal.remove<EntityName>.{title,description}` — literal text, no lowercasing. Use for exact Figma wording or abbreviations. Examples: `removeVip-Manager`, `removeNeocoreUsers`.

## Check

`yarn typecheck && yarn lint && yarn dev` → create → edit → delete an entity. Verify Network: `App.V2.<...>.Create`, `.Read`, `.Update`, `.Delete`. Confirm `useSection.ts`/model were **extended**, not recreated.

## File structure (form part, added on top of the list)

```
src/pages/<group>/<section>/
├── create/index.vue
├── update/index.vue
├── useSection.ts            # + sectionConfig, useForm (extended)
└── _components/SectionForm.vue
src/@model/<group>/<name>.ts  # + I<Name>Data, <Name>Form (extended)
```

## Optional tabs & advanced patterns

Add on top of the base form when the design requires. Each is independent — read the relevant section of `references/advanced-form.md`:
- **Localization Tab** — multilingual editing of selected fields (`isLocalization`, `fieldTranslations`, `LocaleForm`).
- **SEO Tab** — metaTitle/metaDescription/description grouped under `seo`.
- **GamesCard Tab** — two-panel game picker with drag-n-drop.
- **Advanced configs/hooks** — `loadingEndpointArr`, custom `useStore` (create/update/delete), form lifecycle hooks (`onReceiveEntity`, `onSerializeFormCb`, `onBeforeSubmitCb`, `onSubmitCallback`, `validationErrorCb`), `transformFormData` nuance, `backToTheHistoryLast`, `onePermissionKey`/`noPermissionPrefix`, color/gradient field, date-range validation, `BaseSectionSlots.Actions`.

## Commands

`yarn dev` · `yarn typecheck` · `yarn lint` · `yarn test:unit`
