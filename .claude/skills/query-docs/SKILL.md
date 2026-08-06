---
name: query-docs
description: Read the knowledge/ wiki BEFORE the source — the LLM-Wiki "query" step. Use when you need to understand what X is or how X works for a code entity (model, store, composable, component, config, service), or are about to open a source file just to learn how something works. Also on /query-docs.
---

# query-docs — consult the wiki before the source

This is the **query** operation of the project's LLM Wiki. The `knowledge/` vault holds a small,
prose page per entity (model / store / composable / component / config / service). A page is
denser and cheaper than its source file, so **read the page first**; open the source only when
the page is missing or stale. This keeps the context window small and your understanding correct.

Page prose is in **Russian** (English code identifiers) — read it as-is.

## Script path

- In `cardona-core-service`: `node scripts/docs-map.mjs …`
- In panels (cardona, marbella, compostela): `node node_modules/cardona-core-service/scripts/docs-map.mjs …`

Below it is written as `docs-map.mjs` — substitute the correct path for your repo.

## Steps

1. **Resolve the page** for the entity (by name or by source path):
   ```bash
   node docs-map.mjs --find PayoutsForm
   node docs-map.mjs --find src/@model/Payouts.ts
   ```
   Prints the page path and its status: `ok`, `устарела` (stale), or `нет страницы` (missing).
   The auto-injected index (`knowledge/index.md`, added to context at session start) is also a
   fast way to spot the right page.

2. **Read the page** if `--find` returned one that is `ok`. Answer / proceed from the page —
   do **not** open the source just to re-derive what the page already states.

3. **Fall back to source only when needed:**
   - `нет страницы` (missing) or `устарела` (stale) → read the source, then create/refresh the
     page via **/update-docs** so the next query is cheap.
   - The page exists but lacks a detail you need → read only the relevant part of the source,
     and consider adding that detail to the page via /update-docs.

4. **File valuable findings back into the wiki.** If a query led you to understand something not
   yet captured (a non-obvious relationship, an entity with no page), create/extend its page via
   /update-docs — LLM-Wiki query results are folded back so the knowledge compounds.

## When to use this reflexively

Before reading any entity's source to "figure out how it works", run `--find` first. Reserve
reading source for: code you are about to change, entities with no/stale page, or details the
page does not cover. Understanding-only reads should go through the wiki.
