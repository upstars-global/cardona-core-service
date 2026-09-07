# Style Architecture Guide

## Three-layer architecture

```
components/          — global behavioral styles (structure, no color)
styles.scss          — layout color tokens (CSS vars) + global rules using those vars
layouts/*/components/ — layout-specific overrides (only what differs between layouts)
```

**Rule of thumb:**

| Situation | Where to put it |
|---|---|
| Same selector, same value in both layouts | `components/<component>.scss` (global) |
| Same selector, different value per layout | CSS var in `styles.scss` + consume globally |
| Only applies to one layout | `layouts/<layout>/components/<component>.scss` |

---

## CSS Custom Properties pattern

Tokens are defined on the layout root, consumed anywhere — file location doesn't matter.

### 1. Define tokens in `styles.scss`

```scss
body[data-layout="default"] {
  --c-text-base: rgba(var(--v-theme-grey-900), var(--v-body-opacity));
}
body[data-layout="island"] {
  --c-text-base: rgba(var(--v-theme-surface-invert), var(--v-high-emphasis-opacity));
}
```

### 2. Use the token in a global rule (anywhere — `styles.scss` or a separate file)

```scss
// styles.scss or components/typography.scss
.text-color-base { color: var(--c-text-base); }
```

### 3. Use the token in a layout-specific file

```scss
// layouts/island/components/base-input.scss
.v-input .v-field__input { color: var(--c-text-base); }
```

The token value switches automatically based on which `body[data-layout]` the page is in.

---

## Use cases

### Color

```scss
// styles.scss — define per layout
body[data-layout="default"] { --c-label-color: rgba(var(--v-theme-grey-900), var(--v-body-opacity)); }
body[data-layout="island"]  { --c-label-color: rgba(var(--v-theme-surface-invert), var(--v-high-emphasis-opacity)); }

// global rule — one declaration, works in both layouts
.v-selection-control label { color: var(--c-label-color) !important; } // [forced-vuetify]
```

### Width / height / spacing

Same pattern — if the value differs between layouts, make it a var:

```scss
body[data-layout="default"] { --c-sidebar-width: 240px; }
body[data-layout="island"]  { --c-sidebar-width: 280px; }

// layout-specific file or global rule
.sidebar { width: var(--c-sidebar-width); }
```

If the value is the same in both layouts, put it directly in `components/`.

### Behavior (only one layout)

No need for a token. Put it directly in the layout file:

```scss
// layouts/island/components/base-input.scss
.v-field__prepend-inner > .v-icon {
  color: rgba(var(--v-theme-surface-invert), var(--v-low-emphasis-opacity)) !important; // [forced-vuetify]
}
```

### Extending an existing global component for one layout

Global `components/v-input-base.scss` covers shared structure. To add island-only styles:

```scss
// layouts/island/components/base-input.scss
@mixin apply {
  // island-specific rules on top of the global base
  .v-input .v-field--variant-outlined .v-field__outline__start {
    border-color: rgba(var(--v-island-border-color));
  }
}
```

---

## `!important` classification

Every unavoidable `!important` must carry a comment explaining why specificity alone is not enough.

| Tag | When to use |
|---|---|
| `// [forced-vuetify]` | Vuetify sets the property via its own opacity/color chain that wins without `!important` |
| `// [forced-teleport]` | Element is rendered outside the layout root (portal/teleport), so `body[data-layout]` selector doesn't apply |
| `// [forced-pseudo]` | `::placeholder` and similar pseudo-elements ignore inherited specificity in some browsers |
| `// [forced-pseudo-element]` | `::after` / `::before` injected by a third-party library |

If none of these tags apply, the `!important` is likely removable — check specificity first.

---

## Specificity reference

`body[data-layout="default"] .my-selector` → `(0, 2, 0)` — beats Vuetify's single-class `(0, 1, 0)` without `!important`.

Use the layout scope for one extra layer of specificity before reaching for `!important`.
