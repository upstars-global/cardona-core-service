---
name: write-tests
description: Write Vitest unit tests for the cardona-core-service project. Use whenever asked to write, add or fix unit tests, create a spec file, or cover a component/helper/composable/store. Also on "test this", "add coverage for". Not for implementing features, fixing bugs or explaining code.
---

# Skill: Write Tests

## Step 1 — Gather inputs

| Input | Notes |
|---|---|
| **Source file path(s)** | Absolute or relative to project root. Required. |
| **Coverage requirements** | What to test: specific behaviours, edge cases, error states. If not specified, cover the public contract. |

If the user says "test this" without a path and a file is open in the IDE, use that file.

## Step 2 — Launch subagent

Launch the Agent tool with `subagent_type: 'write-tests'`. Pass:
- The absolute path(s) of the source file(s) to test
- Any coverage requirements the user specified
- The note that specs go to `tests/unit/<path mirroring src/>`

Relay the subagent's summary to the user verbatim.

If the subagent is unavailable, read `references/playbook.md` and do the work inline.
