# CLAUDE.md

Guide for Claude Code when working in `cardona-core-service` — the core of the backoffice SPA (Vue 3 + TS +
Pinia + Vuetify), reused by the `cardona`, `marbella`, `compostela` panels.

## Language

- `knowledge/` documentation (Obsidian vault): Russian prose with English technical terminology — code identifiers, signatures, and examples stay in English.
- Everything you author — skills, agents, `CLAUDE.md`, settings and configuration files — is always written in English.
- Questions you ask the user are always in Russian.

## Path aliases

`$PROJECTS` = projects root directory for the current developer (resolve via `echo $PROJECTS`). Each developer sets this in their shell profile, e.g. `export PROJECTS="$HOME/projects"`.

When displaying file paths to the user, replace the prefix that `$PROJECTS` resolves to with the literal string `$PROJECTS`. Do not apply this substitution to bash commands or paths passed to tools — only to text shown in chat.

## Documentation (Obsidian, LLM Wiki)

**Canonical home** of the mechanism: scripts ship to the panels via `node_modules/cardona-core-service`,
skills/agents via symlinks made by each panel's `scripts/sync-core-claude.mjs`. This repo has its own
vault too (`knowledge/`), documenting the shared code.

Three layers: raw sources = `src/` -> wiki = `knowledge/` -> schema = `CLAUDE.md` + skills.
Three operations: **ingest** (`/update-docs`), **query** (`/query-docs`), **lint** (`docs-map.mjs --lint`).

**A page carries what you cannot cheaply derive from the source** — invariants and contracts, gotchas,
"why it is done this way", cross-cutting call order. Not field lists or signatures: retelling a file is
more expensive to read than the file and goes stale immediately. If a page is a retelling, the page
should not exist. Aim for <= ~2 KB per page.

**Ingest is push-driven:** `git commit` -> `post-commit` hook (`docs-queue.mjs --record` + rebuild of
`knowledge/index.md`) -> `git push` -> `docs-guard.mjs` Stop hook asks once -> `/update-docs` updates the
affected pages and calls `docs-guard.mjs --mark`. Uncommitted edits never nag.

Freshness is a **content hash** of the source (`source_hash` in the page frontmatter), not mtime —
mtime made half the vault "stale" after any `yarn install` or checkout. Pages without a hash fall back
to mtime until `docs-map.mjs --rehash`.

**Scripts** live in `scripts/` (`ls scripts/` for the list); each has a full header comment that
is its spec — read it before changing one.

Kill switch: `CARDONA_DOCS_GUARD=0` (also makes the git hook a no-op).

## Skills and agents — cost discipline

Canonical copies live in `.claude/`. Two rules keep them cheap:

1. **A SKILL.md contains only what the main assistant needs.** Everything a worker subagent needs
   lives in `references/playbook.md`, and the agent reads that instead. Otherwise the main context
   (the expensive model) pays for the whole playbook, and the subagent pays for it a second time.
2. **Deterministic work belongs in a script, not in a model.** `permissions-add.mjs`,
   `section-scaffold.mjs` and `collect-evidence.mjs` exist for exactly that reason.

Measure before and after with `node scripts/claude-budget.mjs --compare`.

## Root cause auto-fill (Jira)

Canonical home of the mechanism that fills the Jira **"Root cause"** select field for finished
**Bug / Sub-bug** tasks in the panels. Ticket key = the `BAC-XXXX` prefix of the git branch.

**Two layers, and the split is not optional:** a background subagent cannot write to Jira (the
permission system needs the real user's interactive intent), so all Jira I/O runs **inline in the main
assistant** (the `/root-cause` skill) and only the read-only diff classification is delegated to the
`root-cause` subagent.

Components: `scripts/root-cause-guard.mjs` (Stop hook, no AI — fires once per push of a `BAC-*` branch,
dedup signature in `.git/cardona-root-cause.state`, `--mark` silences it; push detection is shared with
the docs mechanism via `scripts/push-state.mjs`) - `.claude/skills/root-cause/` (the skill + its
`collect-diff.mjs` and the rare-path `references/field-discovery.md`) - `.claude/agents/root-cause.md`
(the classifier).

Each script's header comment is the detailed spec — read it before changing one.
Kill switch: `CARDONA_ROOT_CAUSE=0`.
