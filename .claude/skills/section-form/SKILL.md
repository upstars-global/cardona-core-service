---
name: section-form
description: Add a create/update form to an EXISTING list section in a cardona-core-service backoffice — create/update routes and pages, the form model, useForm/sectionConfig, SectionForm.vue, remove modal. Use for "add create/edit to X", "make Y creatable", "сделай раздел редактируемым", "добавь форму создания". Also Stage 5 of a full section; run `section-list` first if no list exists.
---

# Add a Create/Update Form

Turns a list-only section into full CRUD by **extending** what `section-list` built — the same
`useSection.ts` and `src/@model/<name>.ts`, not new parallel files.

**Prerequisite:** a working list section must exist (`useSection.ts` with `useList`,
`@model/<name>.ts`, `list/index.vue`, and a route). If it doesn't, run `section-list` first.

## Step 1 — Gather the inputs (before launching; the subagent can't ask)

1. **Which section** — name and its paths.
2. **Sample `Read`/`GetById` response** — usually more fields than the list item.
3. **Sample `Create`/`Update` request body** — often a subset of Read.
4. **Form structure** — fields, grouping (cards/sections), validation, dependent dropdowns,
   multilingual fields, any Localization / SEO / GamesCard tab.

## Step 2 — Delegate

Launch the Agent tool with `subagent_type: 'section-form'`, passing all of the above. Relay its final
summary to the user verbatim.

The worker decides the routing upgrade (replace the hand-written list-only module with a single
`sectionRouterGenerator` entry when the section fits, otherwise append create/update routes and say
why), extends the model and `useSection.ts`, creates the create/update pages and `SectionForm.vue`,
flips `withCreateBtn`/`withRemoveModal` on the list, and adds the i18n keys.

If the subagent is unavailable, follow `references/playbook.md` inline.

## Step 3 — Verify with the user

`yarn dev` → create → edit → delete an entity. In Network, confirm `App.V2.<...>.Create`, `.Read`,
`.Update`, `.Delete`. Confirm the worker **extended** `useSection.ts` and the model rather than
recreating them.
