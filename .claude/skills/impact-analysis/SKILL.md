---
name: impact-analysis
description: Generate a QA-facing Impact Analysis for a completed task in the Cardona backoffice — from a git diff of ANY changed files, tell the QA/DevOps engineer exactly WHERE and WHAT to test. Covers app pages (menu path + URL), shared components/models/stores (regression surface), the cardona-core-service dependency (diff its changes too), AND infrastructure — Docker, nginx, Helm charts, GitLab CI, Vite/build config, env, deps. Use this skill whenever a task is finished and someone asks "what should QA test", "impact analysis", "QA report", "regression surface", "affected areas", "где тестировать", or "что проверять после этой задачи" — even without the words "impact analysis". The report text MUST be written in Ukrainian; talk to the user in Russian.
---

# Impact Analysis for QA (Cardona)

## Execution model — delegate to the subagent

This analysis runs in a dedicated subagent so the main window stays clean and the work runs on a cheaper model (Sonnet). Route by who you are:

- **You are the main assistant** (the user typed `/impact-analysis` or `/ia`, or asked what QA should test): do NOT run Steps 1–5 yourself. Launch the Agent tool with `subagent_type: 'impact-analysis'` and a short prompt (e.g. "Produce the Impact Analysis for the current change set"; pass a specific git range or file list if the user gave one). When it returns, relay its final message **verbatim** to the user — it is already the finished Ukrainian report. Add nothing before or after it. Then run the **Jira sync offer** below.
- **You are the `impact-analysis` subagent** (your system prompt says so): execute Steps 1–5 below and return only the Ukrainian report, as your system prompt requires. Do NOT do the Jira offer — that's the main assistant's job.

If the subagent is unavailable for any reason, fall back to running the steps inline — but delegation is the intended path.

### Jira sync offer (main assistant only, after relaying the report)

Every completed Impact Analysis should offer to land in the branch's Jira issue. Do this **inline** — it's a couple of cheap MCP calls; a subagent isn't worth the overhead, and the write must carry the real user's intent (which lives here) and be able to surface the permission prompt.

The field id is stable for the BAC project: **`customfield_10684`** ("Impact analysis"). cloudId: **`1cae3bd1-b0cd-4eb1-bfb6-0c11d5d77845`**. Load the Atlassian tools via ToolSearch if they aren't available yet.

1. **Ticket** — `git rev-parse --abbrev-ref HEAD`; take the `^(BAC-\d+)` prefix (uppercase). No match → no Jira offer, stop silently.
2. **Probe** — one targeted read: `getJiraIssue` with `issueIdOrKey: <ticket>`, `fields: ["customfield_10684"]`, `responseContentFormat: "markdown"`. (Targeted, not `*all` — keeps it tiny.)
   - Errors as not-found / no permission → the issue isn't actionable. One-line Russian note ("задачи BAC-XXXX нет в Jira — пропускаю") and stop.
   - Found → note whether `customfield_10684` came back (field present) and its current content (for append).
3. **Ask** with `AskUserQuestion` (options in Russian):
   - **"Да — в поле Impact analysis"** — only if the field is present.
   - **"Да — в комментарий"** — always.
   - **"Не отправлять в Jira"** — always.
4. **Write** the **exact Ukrainian report text** you relayed:
   - **Comment** → `addCommentToJiraIssue`, `contentFormat: "markdown"`, `commentBody` = a short Ukrainian header (e.g. `🤖 Impact Analysis (авто) — <YYYY-MM-DD>`, date via `date +%F`) + the report markdown. Comments take markdown directly.
   - **Field** → the field requires **ADF**, not markdown (`editJiraIssue` rejects a raw markdown string). Build an ADF doc (`{"type":"doc","version":1,"content":[...]}`: `heading` for `#`/`##`, `bulletList`/`listItem`/`paragraph`, nested `bulletList` for sub-bullets, `code` marks for identifiers, `strong` for bold) and call `editJiraIssue` with `fields: { "customfield_10684": <adfDoc> }`, `contentFormat: "adf"`.
     - **Append, don't overwrite:** if current content is non-empty, fetch it as ADF (`getJiraIssue fields:["customfield_10684"] responseContentFormat:"adf"`), then set the field to existing `content` + a `rule` block + a dated `heading` + the new blocks. If empty, just write the new ADF.
     - **Verify the write stuck:** `editJiraIssue` can return 200 yet silently drop a custom field that isn't on this issue type's edit screen. After writing, re-read `getJiraIssue fields:["customfield_10684"]` and confirm the content is non-empty. If it came back empty, the field write didn't take — tell the user honestly and offer the comment path instead (comments always persist).
   - **"Не отправлять"** → do nothing.
5. Report a one-line confirmation with the issue URL. On an API error, say what failed honestly — never claim a write that didn't land.

Never write to Jira without the user's explicit choice in step 3.

---

Cardona is a Vue 3 + TS + Pinia + Vuetify backoffice, built with Vite, shipped as an NGINX Docker image, deployed via Helm charts + ArgoCD, and it depends on the `cardona-core-service` GitHub package. A completed task can touch any layer — application code, the core dependency, or the build/deploy pipeline — and each has its own way of reaching the running product. This skill turns a git diff into an Impact Analysis someone can act on without reading code: where to click, what regression to sweep, and what to smoke-test after deploy.

The point is coverage. A changed app page is easy to spot; the dangerous misses are the *indirect* ones — a shared component used on ten pages, a core-service bump that changes `BaseList` everywhere, an nginx rule that breaks SPA routing, a Vite change that alters the bundle. Trace those to concrete things to verify.

**The report you produce MUST be written in Ukrainian.** The user reads Russian; the QA engineer reads Ukrainian. Keep your own chat commentary short and in Russian, but the analysis block itself is Ukrainian.

For exact rules (route/URL algorithm, table internals, infra checklists, core-service diffing, reusable greps) read `references/cardona-map.md` — pull it in as soon as you start classifying, don't reconstruct the rules from memory.

> **Fast path:** `node .claude/skills/impact-analysis/scripts/collect-evidence.mjs [range]` does Steps 1–2 and gathers the evidence for 3–4b as one JSON bundle (change set, classification, route/menu/i18n matches, consumer lists, core-service diff). Run it first and read the bundle; the steps below are the rules for interpreting it and filling gaps.

## Step 1 — Determine the change set

The unit of work is the **whole current branch** — everything it contains that `master` doesn't, **including uncommitted work**. Pick the source in this order and tell the user which one you used:

1. **Whole branch (default)** — committed diff since the fork point **plus** uncommitted changes. Fork point: `base=$(git merge-base master HEAD)`. Files = `git diff --name-only "$base"` (committed-since-base + staged + unstaged) ∪ `git ls-files --others --exclude-standard` (untracked new files). Diff body: `git diff "$base"`.
2. **Last commit** — if you're on `master` (or the branch has no diff vs master), use `git diff --name-only HEAD~1 HEAD`.

This is a **union**, not a priority pick: committed branch work and pending edits are analyzed together. Grab the diff body too (`git diff "$base"`) — you need it to describe *what* changed; for untracked new files (no diff), read the file if you need specifics.

## Step 2 — Classify EVERY changed file by blast radius

Classify all files, not just `src/`. Each row points at the step or reference that explains what to verify.

| File pattern | Category | Action |
|---|---|---|
| `src/pages/<group>/<section>/…` | App page | Map to a UI location (Step 3). |
| `src/components/…`, `src/@model/…`, `src/stores/…`, `src/composables/…` | Shared app code | Trace consumers (Step 4), map each. |
| `package.json` line `cardona-core-service` changed, or `cardona-core-service/src/…` | **Core dependency** | Diff the core package (Step 4b). |
| `src/configs/productConfig.ts`, `permissions.ts`, `2.router/guards.ts`, `navigation/**/buildMenu.ts`, `i18n/locales/en.json` | **Project-wide app** | Regression sweep; for `en.json` grep the key (Step 4). |
| `vite.config.mts`, `tsconfig*.json`, `.eslintrc*`, `.prettierrc`, `stylelint.config.js`, `vitest.setup.ts`, `jest.config.js`, `themeConfig.ts`, `*.d.ts` | Build / tooling | See references §Build & tooling. |
| `package.json` (other deps), `yarn.lock` | Dependencies | See references §Dependencies. |
| `Dockerfile`, `nginx/**`, `charts/**`, `.gitlab-ci.yml`, `gitlab-ci/**` | **Infra / deploy** | See references §Infra & deploy. |
| `.env`, `passport.yaml`, `public/**`, `server/**`, `index.html` | Runtime config / static | See references §Runtime & static. |
| `*.spec.ts`, `tests/**`, `*.md`, `.gitignore`, `.claude/**` | Docs / tests / tooling | Low; not manually testable in the UI — note briefly. |

**Generated files** (`components.d.ts`, `typed-router.d.ts`, `auto-imports.d.ts`, `coverage/**`, `dist/**`) are build artifacts — ignore them as impact, they only reflect other changes.

## Step 3 — Map an app page to a UI location

Turn `src/pages/<group>/<section>/…` into a menu path + URL. Full algorithm in `references/cardona-map.md`; short path:

1. `grep -n "name: '<section>'" src/plugins/2.router/additional-routes.ts` → `sectionName`, `permission`, flags. If absent, it's a hand-written route — search `src/plugins/2.router/modules/` (payouts, transactions, adminSection, logging, and more live there and skip the generator).
2. Derive the route name (`<PascalSection>List`/`Create`/`Update`, `prefixName` prepended if set) and URL (kebab-case path, prefix `/:project/…` unless `isProject: false`). Keep `:project` literal in the report.
3. `grep -n "to: '<RouteName>'" src/navigation/vertical/apps-and-pages/buildMenu.ts`, read upward to the nearest parent `title:`, and resolve both i18n keys against `title.*` / `page.*` in `en.json` for the labels QA sees.

If a page can't be resolved to a route, say so — don't invent a URL.

## Step 4 — Trace consumers of shared app code

For each shared file, find who uses it, then run each consuming page through Step 3 so QA gets UI locations, not filenames.

```bash
grep -rln "@model/<name>\|@/@model/<name>" src        # model consumers
grep -rln "use<Name>Store" src                          # store consumers
grep -rln "<FooBar\|foo-bar\|components/Foo/Bar" src    # component (Foo/Bar.vue -> <FooBar/>; Foo/index.vue -> <Foo/>)
grep -rln "PermissionType.<Name>" src                   # permission consumers
grep -rn  "<key>" src                                    # i18n key
```

Deduplicate by section. If a change fans out to many sections, list them all — that breadth is the point.

## Step 4b — Analyze cardona-core-service changes

`cardona-core-service` is a pinned GitHub dependency (`package.json`, e.g. `#v8.0.4`) providing `BaseList`, `BaseSection`, `ApiService`, `@core` components/composables, permissions, layouts. Its `src/**` is Vite-watched in dev, so its changes are as real as the app's. Two triggers, both must be checked — see references §cardona-core-service for the exact commands:

- **Version bump** — the `package.json` pin changed (`#v8.0.4` → `#v8.0.5`). Diff the two tags in the local clone (`../cardona-core-service-github`, fallback `../cardona-core-service`): `git -C <clone> diff --name-only <old> <new>`. That gives the real changed core files.
- **Local core edits** — during development the clone may have uncommitted changes Vite is serving: `git -C <clone> status --porcelain` / `diff`.

Then classify each changed core file and map it to the app:
- Core **component** (`src/components/…`, `@core/components`) — auto-imported into the app; grep its name in the app `src/` (Step 4) to find pages, then Step 3 each.
- Core **`BaseList`/`BaseSection`/`ApiService`/permissions/layouts/utils** — project-wide; flag a regression sweep of representative list/detail/form pages.

If no local clone is available, say the core version changed, flag it project-wide, and recommend a broad smoke test rather than inventing specifics.

## Step 5 — Produce the Ukrainian report

Print this block in chat (Ukrainian). Omit any empty section. Prefer concrete menu paths + URLs over filenames; for infra, prefer concrete "what to verify after deploy" over restating the diff. **Do not add a top-level `# Impact Analysis` title** — start directly with the first `##` section (the report already lives under an "Impact analysis" field / the reader knows what it is).

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
  **Ризик:** <на що може вплинути: збірка, роздача статики, роутінг SPA, змінні оточення, деплой>
  **Що перевірити:** <smoke-тест після деплою: застосунок піднявся, сторінки відкриваються, роутінг/refresh працює, env підхопились тощо>

## Проєктні зміни (широкий вплив)
- <Що зачеплено (core-config / permissions / menu / guards / i18n) і чому потрібен регресійний прогін ключових розділів>
```

Rules for the output:
- **Ukrainian text.** Prose and headings in Ukrainian; keep paths, URLs, route names, identifiers, versions verbatim.
- Skip empty sections — no heading without content.
- Flag uncertainty ("уточнити") instead of guessing; don't invent URLs or deploy effects you couldn't verify.
- For infra/deploy changes, always translate the diff into *observable* checks (does the app boot, do routes resolve, does a hard refresh work, are env vars present) — that's what makes the report actionable for whoever validates the deploy.
