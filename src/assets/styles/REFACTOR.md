# Styles Refactor

## 1. Layout-specific styles split

**Problem:** `styles.scss` imported component styles globally, but most of them used `grey-*` tokens — default layout colors. Island layout had to override them.

**Solution:** Moved default-specific files from `components/` → `layouts/default/components/` as `@mixin apply`. Added island equivalents with `surface-invert` tokens.

| File | Before | After |
|------|--------|-------|
| `v-input.scss` | global | `default/components/` |
| `vue-select.scss` | global | `default/components/` |
| `v-card.scss` | global | `default/components/` |
| `v-list.scss` | global | `default/components/` + island override |
| `v-check.scss` | global | `default/components/` + island override |
| `v-switch.scss` | global | `default/components/` + island override |
| `code-view-editor.scss` | global | `default/components/` |

Utility classes and layout-specific rules moved from `styles.scss` → `layouts/default/index.scss`:
- `.text-color-base/mute/placeholder-disabled` (island overrides added in `island/index.scss` with `surface-invert`)
- `hr` border-top color
- `.input-field`
- `.layout-wrapper .navbar-blur` block

`check-field.scss` deleted — rule merged into `v-check.scss` mixin.

`.v-counter` moved from `v-textarea.scss` → `v-input.scss` (default) + `base-input.scss` (island).

---

## 2. Bug fixes

**`v-btn.scss` — broken selectors**
`.v-btn .v-btn--size-default` → `&.v-btn--size-default` (descendant selector never matched — Vuetify puts both classes on the same element). Removed no-op `transform: scale(1)`.

**`transitions.scss` — Vue 2 class names**
`.zoom-fade-enter` → `.zoom-fade-enter-from`, `.fade-enter` → `.fade-enter-from` (Vue 3 renamed these hooks).

---

## 3. Dead code cleanup

**`vue-select.scss`** — `.vs__dropdown-menu` defined twice. `border`, `border-radius`, `padding-top` in the first block were immediately overridden by the second. Merged into one block.

**`base-list.scss` (island)** — `position: relative` duplicated twice on `.c-table__header-cell-icon-wrapper`.

**`sidebar/_theme.scss`** — removed 3 commented-out blocks and an empty `{}` rule. Replaced hardcoded `white` with `rgb(var(--v-theme-on-sidebar))`.

**`per-page-select.scss` (island)** — replaced hardcoded `$selected-option-color: white` with `rgb(var(--v-theme-on-primary))`.

---

## 4. Orphan file

`toastification.scss` — was not imported by any SCSS file, but **is** imported by `src/plugins/3.toast.ts` (a direct TS import). Mistakenly deleted, restored from git.
