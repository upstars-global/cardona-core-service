# AI code review guide — Cardona backoffice family

Authoritative rule set for the automated reviewer running in the `code_review` CI job.
Wherever this guide and the generic checklist in the job template disagree, **this guide wins**.

Source of truth: `cardona-core-service` → `ai-review/review-guide.md`. The copies in
`cardona`, `alaro-panel`, `compostela-panel` and `marbella-panel` must stay identical apart from
the `## This repository

This is `cardona-core-service` itself — the library, not a panel. Everything above applies, plus:

**Public surface is whatever the panels import.** There is no single entry point: panels import deep
paths (`cardona-core-service/src/...`) and rely on auto-imports configured on their side. Treat every
exported symbol, component prop, emitted event and store action as public.

**Breaking changes are critical.** Removing or renaming an export, changing a prop or event name,
changing the signature of `ApiService`, `abilityCan` / `abilityCanInGroup`, a base store action or a
base component's slot, without keeping a compatible alias, breaks four panels at once
(`cardona`, `alaro-panel`, `compostela-panel`, `marbella-panel`). Say which consumers are affected.

**Defaults and fallbacks are load-bearing.** Panels depend on the fallback behaviour of
`sectionRouterGenerator`, `transformNameToType`, `checkExistsPage` and the permission-key derivation.
Changing a default silently changes behaviour in repositories this MR cannot see.

This repository's own wiki is `knowledge/`; the panels' wikis are separate vaults.
