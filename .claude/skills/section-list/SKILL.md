---
name: section-list
description: Create a list page (BaseList) for a section in a cardona-core-service backoffice — route, menu item, list model, useList, list/index.vue. Use for "make a list-only section", "add a list page for X", "show a table of Y", "раздел только со списком", "список без формы". Also Stage 4 when building a full section; the create/update form is `section-form`.
---

# Create a List Section

Two phases: a **scripted skeleton** (deterministic, no model tokens), then a **subagent pass** that
turns the real API response into columns and filters. Many sections in this app are list-only, so this
is a complete deliverable on its own.

**Prerequisite:** the permission key must already exist in `src/configs/permissions.ts`. If not, run
the `backoffice-permissions` skill first.

## Step 1 — Gather the inputs (before anything else)

| Input | Notes |
|---|---|
| **Section name** (camelCase) | e.g. `vipSeasons`. Drives route name, menu `to`, folder. |
| **Permission** | the `PermissionType` member. |
| **Menu group + neighbour** | group key (`gamification`, `players`, `promo`, …) and which item to sit after. |
| **Pages folder** | `src/pages/<folder>/`, usually the menu group. |
| **i18n prefix** | `title.<key>` / `page.<key>`. Suggest from the section name and confirm — established keys sometimes differ. |
| **`entityName`** | backend hyphen format, e.g. `'Vip-ServiceSeason-Vip-Status'`. **Ask, don't guess** — it determines the API type. |
| **Label** | menu label / `title.<key>.list`. |

## Step 2 — Scaffold (script)

```bash
node node_modules/cardona-core-service/scripts/section-scaffold.mjs \
  --section vipSeasons --folder gamification --permission BackofficeVipSeasons \
  --entity-name 'Vip-ServiceSeasons' --menu-group gamification --label 'VIP Seasons' \
  [--menu-after VipManagerList] [--i18n-prefix vipSeasons] [--prefix Malaga] \
  [--model src/@model/gamification/vipSeasons.ts] [--no-project] [--dry-run]
```

(In `cardona-core-service` itself: `node scripts/section-scaffold.mjs …`.)

It writes the list-only route module and wires it into `additional-routes.ts`, adds the menu item,
`title.<key>.list` + `emptyState.<key>`, a model stub, `useSection.ts` with `useList`, and
`list/index.vue` with a minimal `BaseList`. Idempotent — it never overwrites existing files.

Naming stays identical to what `sectionRouterGenerator` would produce, so `section-form` can later
swap the module for a single generator entry.

## Step 3 — Capture the real API response (the user's step)

Skeletons can't invent columns, and Swagger is often incomplete. Ask the user to:

1. `yarn dev`, open the new list URL (the script prints it),
2. DevTools → Network → find `App.V2.<...>.List`,
3. copy the **full** JSON response, and share the Figma link.

## Step 4 — Full list (subagent)

With the JSON + Figma in hand, launch the Agent tool with `subagent_type: 'section-list'`. Pass: the
inputs from Step 1, the real JSON, the column/filter spec, and the note that the skeleton already
exists. Relay its summary to the user. The subagent can't stop to ask — give it everything.

If the subagent is unavailable, follow `references/playbook.md` inline.

## Next

To make entities creatable/editable, use `section-form` — it extends the `useSection.ts` and
`@model/<name>.ts` produced here.
