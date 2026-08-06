---
name: impact-analysis
description: QA-facing Impact Analysis for a finished task in the Cardona backoffice — turns the git diff into a list of pages a manual tester must open (menu path + URL) with concrete checks on each. Use on /impact-analysis, /ia, or "what should QA test", "regression surface", "где тестировать", "что проверять после этой задачи". Report is Ukrainian; chat with the user in Russian.
---

# Impact Analysis for QA (Cardona)

The analysis itself runs in a subagent (cheaper model, isolated context). Your job here is to launch
it, relay its report, and land the result in Jira.

## Route by who you are

- **Main assistant** — do NOT analyse anything yourself. Launch the Agent tool with
  `subagent_type: 'impact-analysis'` and a short prompt ("Produce the Impact Analysis for the current
  change set"; pass a git range or file list if the user named one). Relay its final message
  **verbatim** — it is the finished Ukrainian report, written for a manual QA engineer: pages to open
  with checks on each, and deliberately no code-level detail. Do not "enrich" it with what changed in
  the code. Add nothing before or after. Then do the Jira
  sync offer below.
- **`impact-analysis` subagent** — your instructions are `references/playbook.md`, not this file.

If the subagent is unavailable, follow `references/playbook.md` inline — delegation is just the
intended path.

## Jira sync offer (main assistant only, after relaying the report)

Do this **inline** — a couple of cheap MCP calls; the write must carry the real user's intent and be
able to surface the permission prompt, both of which need the main context.

Field id for BAC: **`customfield_10684`** ("Impact analysis"). cloudId:
**`1cae3bd1-b0cd-4eb1-bfb6-0c11d5d77845`**. Load the Atlassian tools via ToolSearch if needed.

1. **Ticket** — `git rev-parse --abbrev-ref HEAD`; take the `^(BAC-\d+)` prefix, uppercase. No match →
   no offer, stop silently.
2. **Probe** — one targeted read: `getJiraIssue`, `issueIdOrKey: <ticket>`,
   `fields: ["customfield_10684", "issuetype"]`, `responseContentFormat: "markdown"`. Never `*all` —
   that payload is huge.
   - Not-found / no permission → one Russian line («задачи BAC-XXXX нет в Jira — пропускаю») and stop.
   - Found → note whether the field came back, its current content (for append), and `issuetype.name`.
3. **Ask** with `AskUserQuestion` (Russian options): «Да — в поле Impact analysis» (only if the field is
   present) · «Да — в комментарий» · «Не отправлять в Jira».
4. **Write** the exact Ukrainian text you relayed:
   - **Comment** → `addCommentToJiraIssue`, `contentFormat: "markdown"`, body = a short Ukrainian header
     (`🤖 Impact Analysis (авто) — <YYYY-MM-DD>`, date via `date +%F`) + the report markdown.
   - **Field** → requires **ADF**, not markdown. Build `{"type":"doc","version":1,"content":[...]}`
     (`heading` for `#`/`##`, `bulletList`/`listItem`/`paragraph`, nested `bulletList` for sub-bullets,
     `code` marks for identifiers, `strong` for bold) and call `editJiraIssue` with
     `fields: { "customfield_10684": <adf> }`, `contentFormat: "adf"`.
     - **Append, don't overwrite:** if the field is non-empty, re-read it as ADF
       (`responseContentFormat: "adf"`) and write existing `content` + a `rule` + a dated `heading` +
       the new blocks.
     - **Verify the write stuck:** `editJiraIssue` can return 200 and still drop a field that isn't on
       this issue type's edit screen. Re-read `fields:["customfield_10684"]`; if it came back empty,
       say so honestly and offer the comment path instead (comments always persist).
5. One-line confirmation with the issue URL. On an API error, say what failed — never claim a write
   that didn't land.
6. **Offer Root cause next (bugs only).** If `issuetype.name` matches `/bug|баг/i`, ask once with
   `AskUserQuestion` (Russian): «Проставить Root cause сейчас» / «Не сейчас». On yes, run the
   `/root-cause` skill inline. For non-bug types, skip silently.

Never write to Jira without the user's explicit choice in step 3.
