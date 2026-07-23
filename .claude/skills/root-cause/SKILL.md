---
name: root-cause
description: Automatically set the Jira "Root cause" field for a completed Bug / Sub-bug task in the Cardona family of backoffices (cardona / marbella-panel / compostela-panel). The ticket key comes from the git branch name (BAC-XXXX). It reads the field's allowed options dynamically, analyses the whole branch diff vs master/main, picks the matching category, writes the field automatically and explains the choice; a justifying Jira comment is posted only if the user approves it. Use whenever a bug task is finished, when the Stop-hook asks to set the root cause, or on /root-cause — even phrased "проставь root cause", "первопричина бага", "заполни поле причины в Jira". Does nothing for non-bug types or when the field is absent.
---

# Root cause auto-fill (Jira) — Cardona family

## What this does

After a bug fix, set the Jira **"Root cause"** select field on the branch's task by analysing all
new code in the branch (diff vs `master`/`main`) and mapping it to one of the field's own options.
The ticket key is the `BAC-XXXX` prefix of the current branch name. The field is set automatically
and the choice is explained to the user; a justifying Jira comment (in Ukrainian) is posted **only
on the user's approval**. For non-bug task types, or when the task has no "Root cause" field, do
nothing.

Constants for the BAC project: cloudId **`1cae3bd1-b0cd-4eb1-bfb6-0c11d5d77845`**. The "Root cause"
custom-field id is **not hardcoded** — discover it per task (field ids can differ across projects).
Load the Atlassian tools via ToolSearch (`select:mcp__claude_ai_Atlassian__getJiraIssue,mcp__claude_ai_Atlassian__getJiraIssueTypeMetaWithFields,mcp__claude_ai_Atlassian__editJiraIssue,mcp__claude_ai_Atlassian__addCommentToJiraIssue`) if they aren't available yet.

## Execution model — Jira I/O stays inline

A background subagent **cannot write to Jira** — the permission system needs the real user's
interactive intent, which only lives in the main assistant. So split the work:

- **You are the main assistant** (user typed `/root-cause`, asked to set the root cause, or the
  Stop-hook `root-cause-guard` asked): do **all Jira reads and writes yourself, inline** (Steps 1–4,
  6–10). Delegate only the read-only diff analysis (Step 5) to the `root-cause` subagent.
- **You are the `root-cause` subagent**: your system prompt governs you — analyse the diff, return
  the chosen option + justification, never touch Jira. Ignore this SKILL's Jira steps.

Do not route the whole flow into a subagent (unlike `/ia`): the write must carry user intent and be
able to surface the permission prompt, both of which require the main context.

## Step 1 — Ticket from the branch

`git rev-parse --abbrev-ref HEAD`; take the `^(BAC-\d+)` prefix (case-insensitive), uppercase it.
No match → this isn't a task branch. Say so in one Russian line and stop. Do **not** mark the
signature (nothing to dedup).

> **Token discipline (important):** never fetch `fields: ["*all"]` — that payload is huge. Use the
> minimal targeted reads below, and don't echo whole Jira JSON blobs into your reasoning; extract
> only the handful of values you need. The expensive diff reading is delegated to the Sonnet
> subagent (Step 5) so it never enters this context.

## Step 2 — Read only the issue type (tiny) and gate early

One `getJiraIssue` with `issueIdOrKey: <ticket>`, `fields: ["issuetype"]`. Nothing else yet — this is
the cheapest possible probe and lets a non-bug task bail before any further work.

- Errors as not-found / no permission → the issue isn't actionable. One-line Russian note ("задачи
  BAC-XXXX нет в Jira — пропускаю") and stop. Do not mark the signature.
- **Gate on type:** proceed only if `issuetype.name` matches `/bug|баг/i` (covers "Bug", "Sub-bug",
  "Баг", localized variants; `issuetype.subtask` may also be set for Sub-bug). A feature/story/task →
  one-line Russian note, run Step 9 (mark the signature so the hook stops nagging), stop. If unsure
  of the exact type names, `getJiraProjectIssueTypesMetadata` for `BAC` lists them (do this once).
- Keep `issuetype.id` for Step 3.

## Step 3 — Discover the "Root cause" field, its options and editability (one meta call)

`getJiraIssueTypeMetaWithFields` for `projectIdOrKey: "BAC"`, `issueTypeId: <issuetype.id>`. This one
call gives everything about the field — no separate names-map lookup needed:
- Find the field whose **name** equals **"Root cause"** case-insensitively (also "Root Cause").
  Take its `customfield_XXXXX` id from there — never guess the id, beware decoy fields.
  Not present in the edit metadata → the field isn't on this issue type's edit screen (a write would
  silently no-op): one-line note, Step 9, stop.
- `allowedValues` → the option list `[{ id, value }, …]`. Empty/absent → nothing to choose from:
  one-line note, Step 9, stop.
- `schema.type` → **single** (`option`) vs **multi** (`array`) select. Remember for Step 6.

## Step 4 — Read the current field value (targeted)

One `getJiraIssue` with `fields: ["customfield_XXXXX"]` (just the one field). Note whether it already
has a value — needed only for the overwrite decision in Step 6.

## Step 5 — Delegate the diff analysis to the subagent

Launch the Agent tool with `subagent_type: 'root-cause'`. In the prompt pass:
- the ticket key,
- the allowed options as an explicit `{ id, value }` list (verbatim — it must pick one of these),
- whether the field is single- or multi-select.

The subagent runs `collect-diff.mjs`, analyses the whole-branch diff, and returns exactly:

```
CHOSEN_VALUE: <value>
CHOSEN_ID: <id>
CONFIDENCE: <high|medium|low>
JUSTIFICATION: <1–3 предложения на русском>
```

Parse those four fields. If the subagent is unavailable, fall back to running `collect-diff.mjs` and
categorising inline — delegation is just the token-saving default.

## Step 6 — Write the field (option, NOT ADF)

A select field takes an **option**, not ADF/markdown:
- **Single** (`schema.type: "option"`): `editJiraIssue` with `fields: { "customfield_XXXXX": { "id": "<id>" } }`
  (use `{ "value": "<value>" }` if you only have the value). `contentFormat` is irrelevant here.
- **Multi** (`schema.type: "array"`): `fields: { "customfield_XXXXX": [ { "id": "<id>" } ] }`.

Write behaviour (per user's decisions):
- **Field currently empty** → write automatically, no confirmation. (The first `editJiraIssue` call
  itself surfaces the permission prompt — that's the only gate.)
- **Field already has a value** → do **not** silently overwrite. Show the current value and the newly
  chosen one and ask via `AskUserQuestion` (Russian options): "Перезаписать на <новое>" /
  "Оставить <текущее>". Only overwrite on explicit choice; if "оставить" → skip the field write, go
  to Step 9.

After the field is set, **explain the choice to the user in chat (Russian):** which category you set
and why — relay the subagent's justification (concrete files/mechanism). This explanation is always
shown; it is separate from the Jira comment, which is offered only in Step 8.

## Step 7 — Verify the write stuck

`editJiraIssue` can return 200 yet silently drop a field that isn't on the edit screen. Re-read
`getJiraIssue fields:["customfield_XXXXX"]` and confirm the value is now the chosen option. If it
came back empty/unchanged, tell the user honestly — the field write didn't take — and rely on the
comment (Step 8), which always persists.

## Step 8 — Offer the justifying comment (only on approval, Ukrainian)

The field is set automatically, but a Jira **comment is posted only if the user approves it**. After
setting the field (Step 6) and showing the user your reasoning (in Russian, in chat), ask once with
`AskUserQuestion` (Russian options): "Добавить комментарий с обоснованием в Jira" / "Не добавлять".

- **Approved** → `addCommentToJiraIssue`, `contentFormat: "markdown"`, `commentBody` = a short
  **Ukrainian** note (team/QA-facing, consistent with impact-analysis). Get the date with `date +%F`:

  ```
  🤖 Root cause (авто) — <YYYY-MM-DD>
  **Категорія:** <chosen value>
  **Обґрунтування:** <the subagent's justification, translated to Ukrainian, 1–2 sentences>
  ```

- **Declined** → don't post anything. The field write stands on its own.

Never post the comment without this explicit approval.

## Step 9 — Mark the diff signature (silence the hook)

Whatever the outcome (field written / declined / not-a-bug / no field / verify failed), record the
current diff signature so the Stop-hook won't re-nag until the branch diff changes again:

```bash
node node_modules/cardona-core-service/scripts/root-cause-guard.mjs --mark
```

Skip this only in Step 1 (not a BAC branch) and Step 2's not-found case (nothing to dedup).

## Step 10 — Confirm

One Russian line: what was set (or why nothing was), plus the issue URL
(`https://upstars.atlassian.net/browse/<ticket>`). On any API error, say what failed honestly —
never claim a write that didn't land.
