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

**Mechanism components (they live here):**
- `scripts/docs-map.mjs` — deterministic core (no AI): the code→page rule, collecting changes
  from git, `--pending`, `--build-index`, `--lint`, `--find`, `--log` (+ the `--check-links` alias).
- `scripts/docs-guard.mjs` — Stop hook (see `.claude/settings.json`): checks uncommitted
  changes against the pages and asks to update only the affected ones (ingest). Loop protection —
  `stop_hook_active`.
- `scripts/docs-inject.mjs` — SessionStart hook: injects `index.md` + the "read the wiki
  first" instruction into the session context (the automatic part of query).
- `.claude/skills/update-docs/SKILL.md` — the `/update-docs` skill (ingest): writes only the affected
  pages, reading only the needed source.
- `.claude/skills/query-docs/SKILL.md` — the `/query-docs` skill (query): reads the vault page
  instead of the source; the source is read only if the page is missing/outdated.

**Commands:**
- `node scripts/docs-map.mjs --pending` — what needs to be documented
- `node scripts/docs-map.mjs --build-index` — rebuild `knowledge/index.md`
- `node scripts/docs-map.mjs --lint` — broken `[[links]]` + orphans + stale
- `node scripts/docs-map.mjs --find <Name|src/path>` — find the page for an entity (query)
- `node scripts/docs-map.mjs --log "INGEST <pages>"` — append an entry to `knowledge/log.md`

**Disable the hooks (guard + inject):** `CARDONA_DOCS_GUARD=0`.

**Important about distribution:** the `scripts/docs-*.mjs` scripts reach the panels only after the
`cardona-core-service` dependency is updated in them (the package is installed as a full copy of the repository). Until it is updated,
the Stop hook in the panel simply does nothing (it does not interfere with work).

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
  no AI. On a `BAC-*` branch with a changed diff (vs the marked signature in `.git/cardona-root-cause.state`)
  it blocks the stop and asks the AI to run `/root-cause`. Loop protection — `stop_hook_active`.
  `--mark` records the current signature (the skill calls it at the end to silence re-nagging).
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
