---
name: section-creator
description: Create a whole new CRUD section in a cardona-core-service backoffice, end to end — permissions, route, menu, list page, and create/update form. Use for "add a new section", "create section X", "make a list page with create/edit for Y", "заведи новый раздел", "новый раздел с CRUD". This is the orchestrator: it runs the focused sub-skills in order (backoffice-permissions → section-list → section-form) with a confirmation gate between stages. If the user only needs one piece (just a permission, just a list, just a form), use that sub-skill directly instead.
---

# Create a New Section (orchestrator)

The target is a Vue 3 + TS + Pinia + Vuetify backoffice built on `cardona-core-service`. A full CRUD section spans permissions, routing, menu, a list page, and a create/update form. That work is split across three focused, independently-usable skills; this skill orchestrates them into one guided flow for a brand-new section.

Each sub-skill also stands alone — if the task is only one of these, skip the orchestration and invoke that skill directly:
- **`backoffice-permissions`** — add the access key + localized label.
- **`section-list`** — the list route (list-only), menu item, list model, `useList`, `list/index.vue`.
- **`section-form`** — create/update routes + pages, form model, `useForm`, `SectionForm.vue`, remove modal.

## How to run it — stage by stage

**Work strictly one stage at a time. After each stage, stop, report what changed, run `yarn typecheck && yarn lint`, and wait for the user's confirmation before the next.** Do not do everything at once — each stage produces something the user should verify, and later stages depend on the exact names chosen earlier.

1. **Permissions** — load the `backoffice-permissions` skill and follow it. Adds the `PermissionType` key + group entry + `en.json` label. → confirm → stop.
2. **List** (route + menu + list) — load the `section-list` skill and follow it. Registers a **list-only route via a hand-written module file** (`src/plugins/2.router/modules/<section>.ts`) — not a generator entry, because the generator can't do list-only — plus the menu item and the `BaseList` page. It captures the real API JSON mid-way, so expect a pause to get the Network response + Figma from the user. → confirm → stop.
3. **Create/Update** — load the `section-form` skill and follow it. It **upgrades the routing** (if the section fits `sectionRouterGenerator`, it deletes the module file and adds a single generator entry giving list+create+update; otherwise it appends create/update routes to the module and tells the user why), creates the create/update pages, and **extends** the `useSection.ts` and `@model/<name>.ts` that Stage 2 produced (adds `useForm`/`sectionConfig`/`<Name>Form`). → confirm → done.

The confirmation gate matters because the sub-skills also need mid-flow input from the user (permission key from backend, real list JSON, Figma, sample Read/Create payloads) — surface those requests at each stage rather than guessing.

## Pre-flight — collect upfront

Gather these before Stage 1 so the stages flow without repeated round-trips (each sub-skill re-states what it needs, but having them ready helps):

1. **Section name** (camelCase) — e.g. `vipSeasons`. Drives route names (`VipSeasonsList/Create/Update`), menu `to`, folder.
2. **Permission key** (`backoffice-<...>`) — comes from the backend. **Do not guess.**
3. **Menu group** — existing group (`Gamification`, `Players`, `Promo`, `Settings`, …) + the neighbor to sit next to.
4. **Pages folder** — `src/pages/<folder>/`, usually the menu group.
5. **Page set** — usually full CRUD (List + Create + Update). A single standalone page → `section-list` with `isSingleRoute`; a card detail → `withCard`.
6. **`entityName`** — backend hyphen format (e.g. `'Vip-ServiceSeason-Vip-Status'`). Ask, don't guess.

## Naming conventions

- camelCase section: `vipSeasons` · PascalCase route: `VipSeasonsList` · kebab URL: `/vip-seasons` · permission enum: `BackofficeSeasonVipStatus = 'backoffice-season-vip-status'` · `entityName` backend hyphen: `'Vip-ServiceSeason-Vip-Status'`.

## Partial / non-standard cases

- **List-only section** (no form) — run only Stage 1 + Stage 2 and stop. A common shape.
- **Add a form to an existing list** — skip straight to `section-form`.
- **Only a permission** — just `backoffice-permissions`.
