# Code Conventions

## Architecture

### API calls in store actions only

All `ApiService` calls must be made inside store actions, never directly from components or composables.

### Store naming

Stores follow `use` + plural noun + `Store` pattern: `useGiftsStore`, `usePayoutsStore`.

### Naming mirrors backend endpoints

Folders, components, and routes follow API type names: `ProjectsCreate`, `ProjectsUpdate`, etc.

## TypeScript

### Models over plain objects

All data models are classes with interfaces. `new User({...})`, not `{ firstName: '...' }`.

### Interface and class naming

For entity `Projects`:

```ts
interface IProjectsData {}          // full shape (read/detail)
interface IProjectsListItemData {}  // reduced shape for list (only if different)

class ProjectsListItem {}           // list item model
class ProjectsForm {}               // form model
```

Interfaces: `I` prefix + entity name + `Data` suffix. Classes: entity name only, no prefix.

### Type-only imports

Use `import type` for type-only imports (`@typescript-eslint/consistent-type-imports`).

### Multi-value comparisons: array + `includes`

For 2+ values — use array + `includes` instead of `===`/`||` chains.

```ts
// ✓
const startedStatuses = [VipSeasonPeriod.Active, VipSeasonPeriod.Finished]
if (startedStatuses.includes(status)) { ... }

// ✗
if (status === VipSeasonPeriod.Active || status === VipSeasonPeriod.Finished) { ... }
```

Single value → `===`.

## Vue / Templates

### PascalCase in templates

Components in templates must be named in PascalCase (eslint-plugin-vue).

### Vuetify imports

Direct imports from `vuetify/components` are restricted by ESLint. Components are auto-imported — no manual imports needed.

### Tabler icons only

mdi icons are forbidden by ESLint rule.

## Formatting

No semicolons, 2-space indentation, trailing commas, camelCase, single quotes.

## Path aliases

Use aliases: `@images` not `@/assets/images`, `@styles` not `@/assets/styles`.