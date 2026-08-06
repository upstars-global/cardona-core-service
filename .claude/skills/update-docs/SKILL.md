---
name: update-docs
description: Update or create knowledge/ wiki pages for changed code — the LLM-Wiki "ingest" step. Use when the docs-guard Stop-hook says docs lag behind code, when asked to update documentation, or after adding a model/store/composable/component/config/service. Also on /update-docs.
---

# update-docs — ingest changed code into the wiki

The **ingest** operation of the LLM Wiki: raw sources = `src/`, wiki = `knowledge/`, schema =
`CLAUDE.md` + these skills. Deterministic work is done by scripts; you only write the prose of the
affected pages.

Page prose is **Russian**; code identifiers, signatures and examples stay English.

## Script path

- In `cardona-core-service`: `node scripts/docs-map.mjs …`
- In panels: `node node_modules/cardona-core-service/scripts/docs-map.mjs …`

Written as `docs-map.mjs` below — substitute the right prefix. Same for `docs-guard.mjs`.

## What a page is for — read this before writing one

A page earns its place only if it carries knowledge you **cannot cheaply derive from the source**:

- **инварианты и контракты** — что обязан соблюдать вызывающий код или бэкенд;
- **ловушки** — что сломается, если сделать «как кажется правильным»;
- **почему так** — решение и его причина;
- **порядок и связи** — кто кого дёргает и что должно случиться раньше.

**A page that retells the file must not be written.** Field lists, signatures and method inventories
are more expensive to read than the source and go stale immediately — that is what made the previous
vault useless. If, after reading the source, you have nothing non-obvious to say about an entity,
say so and skip it: an honest gap beats a filler page.

Keep pages ≤ ~2 KB. Reference: `knowledge/stores/games.md` (why an exclusion filter is inverted into a
whitelist, and why the "exclude everything" case short-circuits without a request).

## Steps

1. **Find out what to document:**
   ```bash
   node docs-map.mjs --pending
   ```
   Lines are `<reason> <origin> <source> → <page>`. `missing` — no page, `stale` — the source changed.
   `origin=queue` is the debt of the pushed commits, `origin=lint` are older divergences that piled up.
   Empty → nothing to do; go to step 5.

   `--working` inspects the uncommitted tree instead (manual check while coding; the hook never uses it).
   `node docs-hotpath.mjs` ranks undocumented entities by git churn — use it when *adding* coverage
   rather than repairing it.

2. **For each line, and only those:**
   - Read that one source file. Don't read the whole module.
   - Create/update the page from `knowledge/_templates/page.md`, following the doctrine above.
   - Code→page path rule (same as the script):
     `src/@model/**` → `knowledge/models/<Name>.md` · `src/stores/**` → `knowledge/stores/<name>.md` ·
     `src/{composables,use}/**` → `knowledge/composables/<name>.md` ·
     `src/components/**` → `knowledge/components/<Name>.md` (`Foo/index.vue` → `Foo`) ·
     `src/configs/**` → `knowledge/configs/<name>.md` · `src/services/**` → `knowledge/services/<name>.md` ·
     `src/{@core,@layouts}/**` → `knowledge/core/<name>.md` (core-service only).
   - **Name collisions:** Obsidian resolves `[[link]]` by basename, so `models/games.md` and
     `stores/games.md` are ambiguous. When the basename is already taken in another folder, suffix
     the new page with its type (`games-store.md`). `--lint` reports collisions.

3. **Stamp the hashes and lint:**
   ```bash
   node docs-map.mjs --rehash    # записать source_hash в обновлённые страницы
   node docs-map.mjs --lint      # битые [[ссылки]], orphans, stale, коллизии имён
   ```
   Freshness is tracked by the source's content hash, so **a page is not "done" until `--rehash` ran**
   — otherwise it will keep showing up as stale. Don't rebuild the index: the `post-commit` hook does it.

   A broken link is either a typo or a page not created yet — create a small stub only if that entity
   is worth a page under the doctrine; otherwise drop the link.

4. **Log the ingest:**
   ```bash
   node docs-map.mjs --log "INGEST <pages you created/updated>"
   ```

5. **Clear the debt** — always, even when there was nothing to document, or the reminder returns:
   ```bash
   node docs-guard.mjs --mark
   ```

## Frontmatter

`title`, `type`, `source` (relative path), `source_hash` (written by `--rehash`), `tags`, `updated`.
`source` is what lint uses to detect orphan/stale — keep it accurate, and never point it at
`node_modules/**`: such a page is narrative, so leave `source` out entirely.

## Triggering yourself

When you add a new `@model`/store/composable/component/config/service, or work out something
non-obvious about an undocumented one, write it down the same way — don't wait for the hook.
