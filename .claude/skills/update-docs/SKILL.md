---
name: update-docs
description: Updates/creates Obsidian documentation pages in knowledge/ for changed code — the LLM-Wiki "ingest" operation. Triggers — the docs-guard Stop-hook reported the docs lag behind code; the user asks to update/create documentation; you added new functionality (@model, store, composable, component, config, service) or ran into an undocumented entity. Also trigger on /update-docs.
---

# update-docs — ingest changed code into the Obsidian wiki

This is the **ingest** operation of the project's LLM Wiki (see Karpathy's LLM-Wiki
principle): raw sources = `src/`, wiki = `knowledge/`, schema = `CLAUDE.md` + these skills.
The wiki is kept current **surgically and cheaply**: deterministic work is done by scripts,
you only write the prose of the affected pages.

Page prose stays in **Russian** (the wiki is read in Russian); this skill and its steps are
in English, but the pages you write are Russian text + English code identifiers.

## Token-saving principle

- **Don't read the whole module.** One entity = one page. Read only the source file you are
  documenting.
- **Don't scan the vault by hand.** The script gives you the list to update. It also builds the
  index and lints links — never hand-edit `index.md`.
- Update **only** the pages in the pending list. Leave everything else alone.

## Script path

- In `cardona-core-service`: `node scripts/docs-map.mjs …`
- In panels (cardona, marbella, compostela): `node node_modules/cardona-core-service/scripts/docs-map.mjs …`

Below it is written as `docs-map.mjs` — substitute the correct path for your repo.

## Steps

1. **Find out what to document:**
   ```bash
   node docs-map.mjs --pending
   ```
   Prints lines `<reason> <source> → <page>`. `missing` — no page yet, `stale` — source is newer.
   If empty — nothing to document, stop.

2. **For each line** (and only those):
   - Read the given source (one file).
   - Create/update the page at its path, using the template `knowledge/_templates/page.md`.
   - Code→page path rule (identical to the script):
     - `src/@model/**` → `knowledge/models/<Name>.md`
     - `src/stores/**` → `knowledge/stores/<name>.md`
     - `src/{composables,use}/**` → `knowledge/composables/<name>.md`
     - `src/components/**` → `knowledge/components/<Name>.md` (for `Foo/index.vue` → `Foo`)
     - `src/configs/**` → `knowledge/configs/<name>.md`
     - `src/services/**` → `knowledge/services/<name>.md`
     - `src/{@core,@layouts}/**` → `knowledge/core/<name>.md` (only in cardona-core-service)

3. **Rebuild the index and lint the vault** (via the script, no manual edits):
   ```bash
   node docs-map.mjs --build-index
   node docs-map.mjs --lint
   ```
   `--lint` reports broken `[[links]]`, orphan pages (their `source:` no longer exists) and
   stale pages. A broken link is either a typo or a target page not created yet — create it as
   a small stub if the entity matters.

4. **Log the ingest** (append-only chronicle — the LLM-Wiki `log.md`):
   ```bash
   node docs-map.mjs --log "INGEST <pages you created/updated>"
   ```
   e.g. `--log "INGEST models/PayoutsForm.md, stores/payouts.md"`.

## Page standard

- **Small and specific**: one entity (class/store/composable/component/config/method). If the
  entity is large — describe the key methods/params/sections, not the whole file verbatim.
- **Language**: Russian prose; English only for code identifiers, signatures, examples, terms.
- **Frontmatter is required**: `title`, `type`, `source` (relative source path), `tags`,
  `updated` (today). `source` is what `--lint` uses to detect orphan/stale — keep it accurate.
- **Sections**: Назначение → `API / Сигнатура` → `Пример` (minimal working) → `Стандарты проекта`
  → `Связанные`.
- **Cross-linking**: in the «Связанные» section add `[[page-name]]` to adjacent entities (e.g. a
  store links to its models and composables). A link to a not-yet-created page is allowed — it
  marks something worth adding later.
- Take standards from [[code-conventions]] and `CLAUDE.md` — don't invent them.

## When to trigger yourself (without the hook)

As soon as you add a new `@model`/store/composable/component/config/service or figure out an
undocumented entity during a task — create/update its page with the same process, without
waiting for the hook's reminder.
