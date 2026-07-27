---
name: jsdoc-cover
description: |
  Generates JSDoc documentation for TypeScript (.ts) and Vue (.vue) files so that
  IDE hover tooltips (VS Code, WebStorm) show parameter names, descriptions, and
  return value info for every exported function, method, class, and composable.

  Covers: exported functions and arrow functions, class constructors and public methods,
  interfaces (inline property comments), Vue composables (use*.ts), Vue components
  (props/emits via <script setup>).

  For complex or non-obvious code, reads called functions and type definitions first
  to write accurate parameter descriptions. Adds @example only for standalone utility
  functions where a quick usage sample helps.

  Trigger whenever the user wants IDE hover support, parameter hints, JSDoc, code docs:
  "add JSDoc", "document this", "cover with docs", "хочу hover підказки",
  "додай документацію", "документируй", "покрой JSDoc", "добавь описание параметров".
  Works on a single file path or a glob (e.g. src/helpers/**/*.ts).
---

# JSDoc Cover

Goal: every exported callable gets a JSDoc block that makes IDE hover show **what each parameter means** and **what is returned**.

## Rules

- **Never duplicate TypeScript types in @param** — TS already shows the type; write only the name and description (`@param key — the localStorage key`, not `@param {string} key`)
- **Every exported symbol gets a JSDoc block** — even simple ones; developers read hover to understand intent, not just types
- **Keep descriptions short** — one line per @param fits IDE popups better than long prose

## Process

1. Read the full file first
2. For non-obvious params/returns — trace called helpers or type definitions via LSP `goToDefinition` or Read before writing (wrong description is worse than none)
3. Write JSDoc for each exported symbol per the patterns below
4. Apply all changes via Edit

## Patterns by symbol type

**Functions & arrow functions** — one-line summary + `@param name — description` for each non-obvious param + `@returns` if not void/self-evident.

**Classes** — one-sentence class description; constructor `@param data — raw API payload; omit for default instance`; public method docs same as functions.

**Interfaces** — inline `/** */` only for non-obvious fields; skip fields where the name alone explains the shape (e.g. `id: number`).

**Vue composables (`use*.ts`)** — one-line purpose + `@param options — what can be configured` + `@returns` listing key exposed values: `` `items`, `isLoading`, `load()` ``.

**Vue components (`<script setup>`)** — top-of-script block with `@component Name` + `@description`; inline comments only on non-obvious props.

**Standalone utility helpers** — same as functions + `@example` showing 2–3 representative calls with expected output.

## Tags

| Tag | When |
|-----|------|
| `@param name` | Purpose isn't obvious from name alone |
| `@returns` | Return value meaning goes beyond its type |
| `@example` | Standalone utility/helper functions |
| `@remarks` | Side effects, performance notes, known caveats |
| `@throws` | Only if callers must handle thrown errors |

Never use: `@type`, `@property`, `@param {Type} name`.

## After writing

Show:
1. Summary table: file → symbols documented
2. Anything skipped and why