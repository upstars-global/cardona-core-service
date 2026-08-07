# CLAUDE.md

Guide for Claude Code when working in `cardona-core-service` — the core of the backoffice SPA (Vue 3 + TS +
Pinia + Vuetify), reused by the `cardona`, `marbella`, `compostela` panels.

## Language

- `knowledge/` documentation (Obsidian vault): Russian prose with English technical terminology — code identifiers, signatures, and examples stay in English.
- Everything you author — skills, agents, `CLAUDE.md`, settings and configuration files — is always written in English.
- Questions you ask the user are always in Russian.

## Documentation (Obsidian, LLM Wiki)

This is the **canonical home** of the Obsidian documentation mechanism: from here it is distributed to the panels
(scripts — via `node_modules/cardona-core-service`, skills — via symlinks through
`scripts/sync-core-claude.mjs` in the panels).

The mechanism implements the **LLM Wiki** principle (Karpathy): three layers — **raw sources** = `src/` →
**wiki** = `knowledge/` → **schema** = `CLAUDE.md` + skills. The AI maintains the wiki and, importantly,
**reads it first** to save context. Three operations: **ingest** (`/update-docs`),
**query** (`/query-docs` + auto-injected index), **lint** (`--lint`). Special vault files:
`index.md` (content map, generated) and `log.md` (append-only chronicle of operations).

The knowledge base is an Obsidian vault in `knowledge/` (markdown + `[[wikilinks]]`). Pages are small and
specific: one entity each. Page text is in **Russian** (English only for code identifiers).
This is where the shared core code is documented (@core, @layouts, services, base stores/composables/models).

**Ingest is triggered by git, not by the editor.** The chain is:

```
git commit → post-commit hook → docs-queue.mjs --record   (debt accumulates, no AI)
git push   → remote tip moves → docs-guard.mjs (Stop hook) → /update-docs   (once per push)
/update-docs → … → docs-guard.mjs --mark                  (debt cleared, reminder silenced)
```

A commit is the unit of finished work, so that is where the changed files are captured; a push is
when the work becomes shared, so that is when the reminder fires. **Uncommitted edits never trigger
anything** — documenting code that is still in motion is premature (the old behaviour did exactly
that and nagged on every response).

**Mechanism components (they live here):**
- `scripts/docs-map.mjs` — deterministic core (no AI): the code→page rule, collecting changes
  from git, `--pending` (the committed debt; `--pending --working` for the working tree),
  `--build-index`, `--lint`, `--find`, `--log` (+ the `--check-links` alias).
- `scripts/push-state.mjs` — shared "fire once per push" mechanics: the remote-tracking tip
  (`@{upstream}` → `origin/<branch>`) only moves on `git push`, so the signature derived from it
  ignores local commits and working-tree edits. Used by both `docs-guard.mjs` and
  `root-cause-guard.mjs`, each with its own `.git/*.state` file.
- `scripts/docs-queue.mjs` — the debt queue (`.git/cardona-docs-queue.txt`): `--record` appends a
  commit's documentable files (merge commits skipped, non-documentable paths filtered out via
  `mapSourceToDoc`), `--list`, `--clear`. `debtFiles()` is the single source of truth for "what do
  we owe" — queue first, falling back to the pushed range `base..remoteHead` when the queue is
  empty (hook not installed yet, or commits predate it).
- `scripts/docs-hooks-install.mjs` — installs the `post-commit` hook (`.git/hooks` is not
  versioned, so it must be deployed per clone). Idempotent and cheap → registered as a
  SessionStart hook. An existing foreign hook is preserved once as `post-commit.pre-cardona` and
  chained from ours.
- `scripts/docs-guard.mjs` — Stop hook (see `.claude/settings.json`): fires once per push of the
  branch, maps the debt to pages and asks to update only the affected ones (ingest). Loop
  protection — `stop_hook_active`. `--mark` records the signature and clears the queue. When the
  debt maps to no stale page it marks silently, so nothing is re-computed until the next push.
- `scripts/docs-inject.mjs` — SessionStart hook: injects `index.md` + the "read the wiki
  first" instruction into the session context (the automatic part of query).
- `.claude/skills/update-docs/SKILL.md` — the `/update-docs` skill (ingest): writes only the affected
  pages, reading only the needed source, then calls `docs-guard.mjs --mark`.
- `.claude/skills/query-docs/SKILL.md` — the `/query-docs` skill (query): reads the vault page
  instead of the source; the source is read only if the page is missing/outdated.

**Commands:**
- `node scripts/docs-map.mjs --pending` — what needs to be documented (committed debt)
- `node scripts/docs-map.mjs --pending --working` — same for the uncommitted working tree
- `node scripts/docs-map.mjs --build-index` — rebuild `knowledge/index.md`
- `node scripts/docs-map.mjs --lint` — broken `[[links]]` + orphans + stale
- `node scripts/docs-map.mjs --find <Name|src/path>` — find the page for an entity (query)
- `node scripts/docs-map.mjs --log "INGEST <pages>"` — append an entry to `knowledge/log.md`
- `node scripts/docs-queue.mjs --list` — inspect the current debt queue
- `node scripts/docs-hooks-install.mjs --status` — is the `post-commit` hook installed?
- `node scripts/docs-guard.mjs --mark` — clear the debt and silence the reminder until the next push

**Disable everything (guard + inject + queue + installer):** `CARDONA_DOCS_GUARD=0`.

**Important about distribution:** the `scripts/docs-*.mjs` scripts reach the panels only after the
`cardona-core-service` dependency is updated in them (the package is installed as a full copy of the repository). Until it is updated,
the Stop hook in the panel simply does nothing (it does not interfere with work). The
**`post-commit` git hook** is installed by the SessionStart hook in each panel, so registering
`docs-hooks-install.mjs` in the panel's `.claude/settings.json` is a manual, per-panel step (like the
Stop-hook registration).

## Root cause auto-fill (Jira)

Canonical home of the mechanism that auto-fills the Jira **"Root cause"** select field for
completed **Bug / Sub-bug** tasks across the panels. The ticket key is the `BAC-XXXX` prefix of the
git branch. It analyses the whole branch diff (vs `master`/`main`), maps it to one of the field's
own options, writes the field automatically and explains the choice; a justifying Ukrainian comment
is posted only if the user approves it.

**Two-layer design** (a background subagent cannot write to Jira — the permission system needs the
real user's interactive intent): all Jira I/O runs **inline in the main assistant** (the skill);
only the read-only diff analysis is delegated to the `root-cause` subagent.

**Components (they live here):**
- `scripts/root-cause-guard.mjs` — Stop hook (see the panels' `.claude/settings.json`): deterministic,
  no AI. On a `BAC-*` branch that has been **pushed** (the remote-tracking tip `@{upstream}` /
  `origin/<branch>` moved vs the marked signature in `.git/cardona-root-cause.state`) it blocks the
  stop and asks the AI to run `/root-cause`. The trigger is push-based — local unpushed commits and
  uncommitted edits do not fire it; it reads the local remote-tracking ref, no network call. The
  push mechanics themselves live in the shared `scripts/push-state.mjs` (the docs mechanism uses the
  same module); this script only adds the `BAC-\d+` ticket regex on top. Loop protection —
  `stop_hook_active`. `--mark` records the current remote-tip signature (the skill calls it at the
  end to silence re-nagging).
- `.claude/skills/root-cause/SKILL.md` — the `/root-cause` skill (orchestration): derive ticket →
  read issue type + the "Root cause" field & its options dynamically (`getJiraIssueTypeMetaWithFields`,
  field id is **not** hardcoded) → delegate diff analysis → write the field (as an **option**, not
  ADF) → verify → comment. Gate: does nothing for non-bug types or when the field is absent.
- `.claude/skills/root-cause/scripts/collect-diff.mjs` — deterministic diff collector for the subagent.
- `.claude/agents/root-cause.md` — the read-only classifier subagent (Sonnet): picks one option +
  justification, never touches Jira or the repo.
- `.claude/commands/root-cause.md` — the `/root-cause` command (runs the skill inline).

**Disable auto-reminders:** `CARDONA_ROOT_CAUSE=0`.

**Distribution:** the skill/agent/command ride the standard sync (symlinks via
`scripts/sync-core-claude.mjs`); `scripts/root-cause-guard.mjs` reaches a panel with the dependency
bump (like `docs-*.mjs`). The **Stop-hook registration in each panel's `.claude/settings.json` is
NOT synced** — it is added manually per panel (`cardona`, `marbella-panel`, `compostela-panel`).
