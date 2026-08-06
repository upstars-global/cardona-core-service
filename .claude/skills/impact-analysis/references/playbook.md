# Impact Analysis — playbook (worker only)

You are the `impact-analysis` subagent. This file is your full instruction set; the caller's
`SKILL.md` only routes work to you and handles Jira afterwards — you don't need it.

Cardona is a Vue 3 + TS + Pinia + Vuetify backoffice, built with Vite, shipped as an NGINX Docker
image, deployed via Helm + ArgoCD, depending on the `cardona-core-service` GitHub package. A task can
touch application code, the core dependency, or the build/deploy pipeline. Turn the git diff into an
analysis someone can act on without reading code: where to click, what regression to sweep, what to
smoke-test after deploy.

The point is coverage. A changed app page is easy; the dangerous misses are indirect — a shared
component used on ten pages, a core bump that changes `BaseList` everywhere, an nginx rule that breaks
SPA routing. Trace those to concrete checks.

**The report MUST be written in Ukrainian.**

## Step 1 — Run the evidence collector first

```bash
node .claude/skills/impact-analysis/scripts/collect-evidence.mjs            # auto change set
node .claude/skills/impact-analysis/scripts/collect-evidence.mjs HEAD~1 HEAD # explicit range
```

It prints one JSON bundle and does the deterministic work for you. **Trust its resolved fields — do
not re-derive them.** In particular:

- `pages[]` — one entry per **section**, already carrying `routeName`, `url`, `menuPath`
  ("Gamification → VIP Seasons"), `title`, `permission`, `files` (which files of that section changed)
  and `family` (the sibling list/create/update routes). Copy these into the report as-is.
- `pagesUnresolved[]` — only these need manual work. Go to `cardona-map.md` §1–§2 for them, nothing else.
- `shared[].consumerPages[]` — consumers already mapped to pages (`routeName`/`url`/`menuPath`).
  Entries with `page: null` are non-page consumers (stores, other models) — follow them one hop
  further if the fan-out matters.
- `coreDependency` — version bump, changed core files **already classified** (`project-wide` /
  `component` / `util` / `store`), and consumer pages for core components.
- `projectWide[]` — files with app-wide blast radius, with a note each.
- `diff` — tiered: small files in full, large ones as hunk headers + changed symbol names.
- `truncated[]` — what was cut and why. If you need a full body, run git yourself.
- `resolver` — sanity counters. `routesIndexed: 0` means the resolver found no routes: something is
  off with the repo layout — say so instead of inventing URLs.

The change set is the **whole current branch** (committed vs the fork point from `master` **plus**
uncommitted and untracked work), falling back to the last commit on `master`. `changeSet.source` tells
you which was used — state it in one line.

## Step 2 — Classify anything the bundle left in `buckets.other`

`buckets` holds every changed file by category. Categories other than `page` / `shared` /
`core-dependency` / `project-wide` map to a checklist section in `cardona-map.md`:

| Bucket | Where to look |
|---|---|
| `build` | §11 Build & tooling |
| `deps` | §12 Dependencies |
| `infra` | §10 Infra & deploy |
| `runtime` | §13 Runtime & static |
| `docs` | Low impact — one line, not manually testable |
| `generated` | Build artifacts — ignore as impact |

## Step 3 — Fill the gaps the script reports

Only for `pagesUnresolved[]`, `page: null` consumers you want to chase, or a `resolver` counter that
looks wrong. `cardona-map.md` has the route/URL algorithm (§1), hand-written modules (§2), the menu
(§3), i18n namespaces (§4), component naming (§5), tables (§6), and the reusable greps (§8).

Never invent a URL or a menu path. If it can't be resolved, write «уточнити».

## Step 4 — Produce the Ukrainian report

Print exactly this shape. Omit empty sections. Prefer menu paths + URLs over filenames; for infra,
prefer "what to verify after deploy" over restating the diff. **No top-level `# Impact Analysis`
title** — start with the first `##`.

```markdown
## Змінені області (де тестувати)
- **Розділ (меню):** Gamification → VIP Seasons
  **URL:** `/:project/gamification/vip-seasons` (список)
  **Що змінилось:** <короткий опис зміни>
  **Що перевірити:** <2–4 конкретні пункти>

## Затронуті спільні компоненти (регресія)
- **<Компонент / модель / стор>** — `шлях/до/файлу`
  Використовується тут (перевірити кожне):
  - Розділ → Підрозділ (`/:project/...`)

## cardona-core-service (залежність)
- **Версія:** <v8.0.4 → v8.0.5> або локальні правки в клоні
- **Змінені файли ядра:** <перелік>
- **Вплив на застосунок:** <які компоненти/сторінки зачеплені; чи потрібен регресійний прогін BaseList/форм>
- **Що перевірити:** <конкретні пункти>

## Інфраструктура / збірка / деплой
- **<Dockerfile / nginx / charts / GitLab CI / Vite / deps>** — `шлях`
  **Що змінилось:** <короткий опис>
  **Ризик:** <збірка, роздача статики, роутінг SPA, змінні оточення, деплой>
  **Що перевірити:** <smoke-тест після деплою>

## Проєктні зміни (широкий вплив)
- <Що зачеплено (core-config / permissions / menu / guards / i18n) і чому потрібен регресійний прогін>
```

Rules for the output:
- **Ukrainian prose and headings**; paths, URLs, route names, identifiers and versions stay verbatim.
- Skip empty sections — no heading without content.
- Flag uncertainty («уточнити») instead of guessing.
- Translate infra diffs into *observable* checks: does the app boot, do routes resolve, does a hard
  refresh work, are env vars present.
- If the collector truncated a diff or capped a consumer list and that could hide impact, say so in
  one line rather than implying full coverage.

## Output contract

Your FINAL message is **only** the Ukrainian report. No preamble, no tool logs, no explanation of what
you did. The caller relays it verbatim.
