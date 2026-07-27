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

Goal: every exported callable (function, method, constructor) gets a JSDoc block that
makes IDE hover show **what each parameter means** and **what is returned**.

## What good hover looks like

When a developer hovers over `prepareDisplayedAmount(...)` in VS Code, they should see:

```
prepareDisplayedAmount(value, currency?, options?)
Formats a monetary amount for display using the uk-UA locale.

@param value — raw amount; treated as cents when `currency` is set (divided by 100)
@param currency — ISO 4217 code appended after a non-breaking space (e.g. 'UAH')
@param options — Intl.NumberFormat overrides; defaults to 2 decimal places with currency
@returns formatted string, e.g. '1 500,00 UAH'
```

That's the target. Clear params, clear return, no noise.

## Rules

**Never duplicate TypeScript types in @param.** TS already shows the type in the tooltip.

```ts
// ✗ Redundant — TS shows the type anyway
/** @param {string} key */

// ✓ Correct — just the name and description
/** @param key — the localStorage key to write under */
```

**Every exported symbol gets a JSDoc block** — even simple ones. Developers read hover
tooltips to understand intent, not just types.

**Keep descriptions short** — one line per @param fits better in IDE popups than long prose.

---

## Process

### 1. Read the file

Read the full file before writing anything.

### 2. Research when needed

If a parameter or return value is non-obvious:
- Read called helper functions to understand what they do
- Trace type definitions with LSP `goToDefinition` or Read to understand field shapes
- Only then write the @param description

This matters for accuracy: a wrong description is worse than no description.

### 3. Write JSDoc for each exported symbol

#### Functions and arrow functions

```ts
/**
 * One-line description of what the function does.
 *
 * @param paramName — what this param controls or represents
 * @param optionalParam — what happens when omitted
 * @returns what is returned; omit if void or self-evident
 */
```

#### Classes

```ts
/**
 * What this class represents (one sentence).
 */
class Foo {
  /**
   * @param data — raw API payload to build from; omit for a blank default instance
   */
  constructor(data?: FooInput) { ... }

  /**
   * What this method does.
   * @param id — ...
   * @returns ...
   */
  someMethod(id: number): string { ... }
}
```

#### Interfaces

Use inline `/** */` only for non-obvious fields — fields where the name alone
does not explain the shape or behavior:

```ts
export interface IConfig {
  /** Enables the search bar above the table */
  withSearch?: boolean
  id: number  // obvious — skip
}
```

#### Vue composables (`use*.ts`)

```ts
/**
 * One-line purpose.
 *
 * @param options — describe what can be configured
 * @returns object with reactive state and actions; list the key ones:
 *   `items` (reactive list), `isLoading`, `load()`, `reset()`
 */
```

#### Vue components (`<script setup>`)

Add a block at the top of `<script setup>` and inline comments on non-obvious props:

```vue
<script setup lang="ts">
/**
 * @component ComponentName
 * @description What this component does.
 */

interface Props {
  /** Pre-selects the annual plan on first render */
  annualDefault?: boolean
  items: Item[]  // obvious
}
```

#### Standalone utility / helper functions — add @example

```ts
/**
 * Compacts a large number into a short string with M / K suffix.
 *
 * @param value — raw numeric amount (string or number accepted)
 * @returns compact string: '1.5M', '25K', or the plain number for values < 10 000
 *
 * @example
 * amountFormatter(1_500_000)  // → '1.5M'
 * amountFormatter(25_000)     // → '25K'
 * amountFormatter(999)        // → '999'
 */
```

---

## Tags

| Tag | When |
|-----|------|
| `@param name` | Every parameter whose purpose isn't 100% obvious from its name |
| `@returns` | Whenever the return value meaning goes beyond its type |
| `@example` | Standalone utility/helper functions |
| `@remarks` | Non-obvious side effects, performance notes, known caveats |
| `@throws` | Only if callers must handle thrown errors |

**Never:** `@type`, `@property`, `@param {string} name` (type already in TS signature).

---

## After writing

Apply all changes via Edit. Then show:
1. Summary table: file → symbols documented
2. Anything skipped and why