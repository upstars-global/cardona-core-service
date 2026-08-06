# Cardona file → UI mapping reference

Detailed rules for turning a changed file into a UI location and for finding what a shared change affects. Read this when Step 3/Step 4 of the skill needs precise behavior.

## Содержание
1–4. Роут, URL, меню, i18n — считает скрипт (ручной фолбэк)
5. Компоненты (auto-import → grep потребителей)
6. Таблицы / list-страницы
7. Пути с широким радиусом поражения
8. Переиспользуемые grep-паттерны
9. Анализ изменений cardona-core-service
10. Инфраструктура и деплой (Docker, nginx, Helm, GitLab CI)
11. Сборка и тулинг
12. Зависимости
13. Runtime и статика

---

## 1–4. Роут, URL, меню, i18n — считает скрипт

`collect-evidence.mjs` реализует алгоритм `sectionRouterGenerator` (`src/helper/router.ts`), разбирает
рукописные модули `src/plugins/2.router/modules/`, строит дерево `buildMenu.ts` и резолвит подписи по
`en.json`. Готовые `routeName` / `url` / `menuPath` / `title` приходят в `pages[]` — **выводить их
заново не нужно**.

Этот раздел нужен только когда скрипт вернул файл в `pagesUnresolved[]` или роут без имени.

### Как разрешить вручную

1. **Секция в реестре?** `grep -n "name: '<section>'" src/plugins/2.router/additional-routes.ts`.
   Есть → имя роута `<prefixName><PascalSection>List|Create|Update|Card`; URL = `importSTR`
   (`<sectionName>/<name>`), разбитый по `/`, дедуплицированный, каждый сегмент в kebab-case,
   с префиксом `/:project/` — если только не `isProject: false`. `withoutSectionNameInUrl: true`
   вырезает сегмент `sectionName`. Ключ заголовка — `<key>.list|create|edit|card` в неймспейсе `title.*`.
2. **Нет в реестре** → роут рукописный, ищи в `src/plugins/2.router/modules/` (`payouts`,
   `transactions`, `adminSection`, `logging`, `malagaChannels`, `malagaTemplates`, `supportService`,
   `cashbackStatsDetail`, `dashboard`, `auth`, `error`, `noAccess`). Там бывают фабрики, где `name`
   вычисляется, — тогда скрипт и не мог его разобрать, бери из кода.
3. **Путь в меню** — `grep -n "to: '<RouteName>'" src/navigation/vertical/apps-and-pages/buildMenu.ts`,
   поднимись к ближайшему родительскому `title:`, оба ключа резолвь по `en.json`. Админское меню —
   `buildAdminMenu.ts` (переключается по `appConfigCoreStore.isMenuTypeMain`).
4. **i18n-неймспейсы:** `title.*` — меню и breadcrumbs; `page.<section>.*` — заголовки колонок и
   контент; `emptyState.<section>`, `placeholder.*`, `modal.*`, `entities.*`, `permission.*`.

Если роут не разрешается — так и напиши («уточнити»). URL не выдумывать.

## 5. Components (auto-import)

- **Config:** `vite.config.mts` (`Components({ dirs: ['src/components', <core '@core/components'>, <core 'components'>] })`, `dts: true` → generates `components.d.ts`).
- **Naming (PascalCase, enforced by eslint-plugin-vue):** `unplugin-vue-components` derives the name from the path; nested dirs are prefixed. `src/components/Foo/Bar.vue` → `<FooBar />`; `src/components/Foo/index.vue` → `<Foo />`. Direct Vuetify imports and mdi icons are ESLint-forbidden.
- **Find usages** of `src/components/Foo/Bar.vue`:
  - `grep -rln "FooBar\|foo-bar\|Foo/Bar" src/pages src/components`
  - For an `index.vue` component, grep the folder name: `grep -rln "<Foo\b\|foo\b" src`.
  - Some files import directly: `grep -rln "components/Foo/Bar" src`.
  - Unsure of the registered name? `grep -n "Bar" components.d.ts`.

## 6. Tables / list pages

- **Renderer:** `cardona-core-service/src/components/templates/BaseList/index.vue`, imported as `BaseList` in each list `index.vue`. Find all table pages: `grep -rln "BaseList" src/pages`.
- **Per-section config:** `src/pages/<group>/<section>/useSection.ts` exports `useList()` returning `{ entityName, pageName, fields, ListItemModel, ... }`. `fields` defines the columns.
- **Columns:** `new TableField({ key, title, type, sortable, size })`. `type` is `ListFieldType`, `size` is `ListSize` — both in `cardona-core-service/src/@model/templates/tableFields.ts`.
  - `ListFieldType`: `status, pill-status, name-with-id, name-with-short-id, email, date, date-with-seconds, statement, priority, badges, percent, action, button, sum-and-currency, comment, image, image-full, period, copy, copy-short`.
  - `ListSize`: `sm, md, full`. `AlignType`: `left, center, right`.
- **Titles** are i18n keys, typically `page.<section>.<field>`.
- **Config classes:** `BaseListConfig` / `BaseSectionConfig` from `cardona-core-service/src/@model/templates/baseList.ts` / `baseSection.ts` (control `withSearch`, `withSettings`, `emptyText`, `filterList`, `permissionKey`, …).
- **Which page renders a changed column/model:** the section's `useSection.ts` `fields` + the sibling `list/index.vue` are the only renderer. Custom cells use `<template #cell(<key>)="{ item }">` inside `BaseList`. A changed model/column → test `src/pages/<group>/<section>/list/` and any `#cell(...)` overrides there.

## 7. High-blast-radius paths (project-wide triage)

A change in any of these can affect many pages — flag it as a regression sweep, don't try to enumerate every consumer by hand:

- **`cardona-core-service/src/…`** — `BaseList`, `BaseSection`, `TableField`, `ApiService`, permission system, `@core` components/composables, layouts. Every list/detail/form page consumes these.
- **`src/configs/productConfig.ts`** — `permissionPrefix`, `ApiTypePrefix='App.V2.'`, `productName`/`productId`. Feeds the router generator's default permission and ApiService type routing → project-wide.
- **`src/configs/permissions.ts`** (`PermissionType` enum) — referenced by `additional-routes.ts`, `buildMenu.ts`, every `useSection`/list config. A changed enum member affects routes + menu visibility + page guards. `grep -rln "PermissionType.<Name>" src`.
- **`src/plugins/2.router/guards.ts`** — auth/permission redirects for all routes.
- **`buildMenu.ts` / `buildAdminMenu.ts`** — the whole sidebar.
- **`src/plugins/i18n/locales/en.json`** — a changed/removed key affects every page referencing it.

**Triage summary:**
- Changed `src/pages/<group>/<section>/…` → one section; map via §1–§4.
- Changed `useSection.ts` or `list/index.vue` → table columns/behavior on that one list page (§6).
- Changed `src/@model/<x>.ts`, `src/stores/<x>.ts`, or a `src/components/` file → run consumer greps (§8), map every consumer.
- Changed anything in `cardona-core-service/src/`, `productConfig.ts`, `permissions.ts`, `guards.ts`, `buildMenu.ts`, or `en.json` → PROJECT-WIDE / regression sweep.

## 8. Reusable grep patterns

```bash
# model consumers
grep -rln "@model/<name>\|@/@model/<name>" src
# store consumers
grep -rln "use<Name>Store" src
# component usages (see §5 for naming)
grep -rln "<FooBar\|foo-bar\|components/Foo/Bar" src
# permission consumers (routes, menu, page guards)
grep -rln "PermissionType.<Name>" src
# route name -> menu group
grep -n "to: '<RouteName>'" src/navigation/vertical/apps-and-pages/buildMenu.ts
# section config (flags, permission, folder mapping)
grep -n "name: '<section>'" src/plugins/2.router/additional-routes.ts
# i18n label / key impact
grep -rn "<key>" src
```

## 9. cardona-core-service change analysis

`cardona-core-service` is a pinned GitHub dependency declared in `package.json`:
```
"cardona-core-service": "github:upstars-global/cardona-core-service#v8.0.4"
```
It is installed under `node_modules/cardona-core-service` (no `.git`), and its `src/**` is Vite-watched in dev (`vite.config.mts` `server.watch.ignored: ['!**/node_modules/cardona-core-service/src/**']`). It provides `BaseList`, `BaseSection`, `TableField`, `ApiService`, the permission system, `@core` components/composables, `@layouts`, `@images`, `@styles` — consumed by nearly every page.

**Locate the local clone** (a real git repo with tags, used to compute what changed): prefer `../cardona-core-service-github`, fallback `../cardona-core-service`. Verify: `git -C <clone> rev-parse --is-inside-work-tree`.

**Trigger A — version bump.** If the `cardona-core-service` line in `package.json` changed, extract old and new tags (the `#vX.Y.Z` suffix) and diff them in the clone:
```bash
git -C ../cardona-core-service-github fetch --tags --quiet
git -C ../cardona-core-service-github diff --name-only <oldTag> <newTag>   # e.g. v8.0.4 v8.0.5
git -C ../cardona-core-service-github log --oneline <oldTag>..<newTag>     # commit intent
```

**Trigger B — local core edits** (dev mode, Vite serving the clone's working tree):
```bash
git -C ../cardona-core-service-github status --porcelain
git -C ../cardona-core-service-github diff --name-only
```

**Map core files to the app.** For each changed core file:
- Core **component** (`src/components/…`, `src/@core/components/…`) — auto-imported into the app by the same PascalCase rule (§5). Grep its name across the app `src/` to find consuming pages, then map each via §3. Example: `src/components/TextEditorWysiwyg/index.vue` → `<TextEditorWysiwyg/>` → `grep -rln "TextEditorWysiwyg" src`.
- Core **composable/util** (`@core/composable`, `@core/utils`, `src/composables`, `src/utils`) — grep its exported name in the app `src/`.
- Core **`BaseList` / `BaseSection` / `ApiService` / permission system / layouts** — project-wide. Don't enumerate every page; flag a regression sweep across representative list, detail, and form pages.

If no local clone exists, report that the core version changed, flag it project-wide, and recommend a broad smoke test instead of inventing specifics. Note: local clones may sit on a feature branch (not the pinned tag) — mention that the diff reflects the clone's state, so the analysis is best-effort.

## 10. Infra & deploy

The pipeline: GitLab CI builds a Docker image (`node:20.18.1` build → NGINX serve) → Helm chart → ArgoCD. `master` → staging, then manual prod. A change here does not show up on a specific page — it affects whether the app boots, serves, routes, and gets the right runtime config. Translate every infra diff into **observable post-deploy checks**.

| Path | What it controls | What to verify after deploy |
|---|---|---|
| `Dockerfile` | Build stage (node version, `yarn build`), final NGINX image, copied assets | Image builds; `dist` served; app loads; no missing assets/404s. |
| `nginx/nginx.conf` | Static serving, SPA fallback (`try_files … /index.html`), headers, gzip, caching | Deep links open on refresh (SPA routing); assets load; security/cache headers as intended; no 404 on client routes. |
| `charts/Chart.yaml`, `charts/values*.yaml`, `charts/values/<env>/**` | Helm release: image tag, replicas, resources, env vars, hostnames per env | Correct env values applied; pods healthy; env vars present in the running container; right hostname/domain. |
| `charts/templates/deployment*.yaml` | Pod spec, probes, resources, env injection | Rollout succeeds; liveness/readiness pass; no crashloop. |
| `charts/templates/ingress*.yaml`, `service*.yaml`, `certificate.yaml` | Routing into the cluster, TLS, service exposure | Domain reachable over HTTPS; cert valid; internal vs public ingress correct. |
| `.gitlab-ci.yml`, `gitlab-ci/*.sh` (`from_ci_envs.sh`, `prepare-dyn-env.sh`) | Pipeline stages, dynamic env prep, build/deploy jobs | Pipeline passes; correct branch→env mapping; dynamic env vars generated as expected. |

Environments (per CLAUDE.md): `develop` → cardona-develop.os.show; `master` → cardona-staging.os.show → manual prod via ArgoCD.

## 11. Build & tooling

These change how the bundle is produced or how code is checked — impact is the whole app, verified by "does it still build and run", not by a page.

| Path | Impact | Verify |
|---|---|---|
| `vite.config.mts` | Aliases, plugins, auto-import dirs, proxy (`/api` → dev backend), build output, chunking | `yarn build` succeeds; dev proxy works; aliases resolve; auto-imported components/composables still resolve. |
| `tsconfig*.json` | Type-checking scope/paths | `yarn typecheck` passes; path aliases resolve. |
| `.eslintrc*`, `.prettierrc`, `stylelint.config.js` | Lint/format rules | `yarn lint` passes; no mass reformatting side effects. |
| `vitest.setup.ts`, `jest.config.js` | Test env (Vuetify/Pinia/i18n globals) | `yarn test:unit` passes. |
| `themeConfig.ts` | Global theme defaults (Vuetify) | App-wide visual smoke: colors, layout, dark/light. |
| `*.d.ts` (`shims`, `auto-imports`, `components`, `typed-router`) | Ambient/generated types | Generated ones are artifacts — ignore as impact; hand-written `shims.d.ts` affects typecheck only. |

## 12. Dependencies

- `package.json` — a changed dependency version (other than core-service) can shift runtime behavior of whatever imports it. Grep the library's import sites to scope it: `grep -rln "from '<lib>'" src`. Flag build + smoke test.
- `yarn.lock` — resolved dependency tree. A lockfile-only change (transitive bump) is usually low-risk but still warrants a build + smoke test; call it out so nobody assumes "lockfile = no impact".

## 13. Runtime & static

| Path | Impact | Verify |
|---|---|---|
| `.env` | Runtime env vars (API base, keys, flags) | Correct values per env; app connects to the intended backend; feature flags as expected. |
| `passport.yaml` | Auth/SSO config | Login flow works. |
| `public/**`, `index.html` | Static assets served as-is, HTML shell | Assets load; favicon/manifest/meta correct. |
| `server/**` | Any Node/preview server helper | Behavior of that server path. |

## Key files
- `src/helper/router.ts` — `sectionRouterGenerator` (URL/route-name algorithm)
- `src/plugins/2.router/additional-routes.ts` — section registry
- `src/plugins/2.router/index.ts` + `modules/` — router assembly, hand-written routes
- `src/navigation/vertical/apps-and-pages/buildMenu.ts` (+ `buildAdminMenu.ts`, `model.ts`, `useAppsAndPages.ts`)
- `src/plugins/i18n/locales/en.json`
- `src/configs/productConfig.ts`, `src/configs/permissions.ts`
- `vite.config.mts` (auto-import config)
- `cardona-core-service/src/@model/templates/tableFields.ts`, `baseList.ts`, `baseSection.ts`
- `cardona-core-service/src/components/templates/BaseList/index.vue`
- Example section to model against: `src/pages/gamification/vipSeasons/` (`useSection.ts`, `list/index.vue`)
