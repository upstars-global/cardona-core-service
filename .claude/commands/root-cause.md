---
description: Проставить поле Root cause в Jira для текущей задачи-бага (по ветке BAC-XXXX)
---

Run the `root-cause` skill **inline in the main assistant** — do not hand the whole flow to a
subagent. Follow `.claude/skills/root-cause/SKILL.md`: derive the ticket from the branch, read the
issue type and the "Root cause" field + its options from Jira, delegate only the diff analysis to
the `root-cause` subagent, then write the field, verify it, and post the justifying comment
yourself. The Jira write must stay in the main context so it carries the real user's intent and can
surface the permission prompt.

If the task type isn't Bug/Sub-bug or there's no "Root cause" field, do nothing (just mark the diff
as handled and say so in one line).
