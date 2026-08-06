---
name: backoffice-permissions
description: Add or change an access permission in a cardona-core-service backoffice — the PermissionType enum key, its access-management group entry, and its English label. Use for "add a permission", "grant access to section X", "wire a backoffice-* access key", "добавь пермишен", "дай доступ к разделу". Also Stage 1 of creating a new section, but it stands alone.
---

# Add a Permission

Access in these backoffices is one string enum + a grouped config that also renders the roles screen.
Adding a permission means three edits in a fixed shape, so **a script does them** — you only gather the
inputs and check the result.

## Step 1 — Gather the inputs

| Input | Behavior |
|---|---|
| **Permission key** (`backoffice-<...>`) | **Must ask.** Comes from the backend, never derived from the section name. Do not guess. |
| **Label** (roles screen) | Suggest from the key (`backoffice-vip-seasons` → `"VIP Seasons"`) and confirm. |
| **Group + neighbour** | Which group (`gamification`, `players`, `promo`, `settings`, …) and which existing permission to sit **after**. Order = order on the roles screen = menu order, so the neighbour matters. |
| **Type** | `Table` (levels 0–4, default) or `Switch` (binary). |
| **`notAccessLevel`** | Forbidden levels, e.g. `2,4`, when the backend has no create/delete. Only if nearby sections in the same group already use it. |

## Step 2 — Run the script

```bash
node node_modules/cardona-core-service/scripts/permissions-add.mjs \
  --key backoffice-season-vip-status --label "VIP Seasons" \
  --group gamification --after backoffice-vip-seasons \
  [--type Switch] [--not-access-level 2,4] [--enum BackofficeSeasonVipStatus] [--dry-run]
```

(In `cardona-core-service` itself: `node scripts/permissions-add.mjs …`.)

It inserts the `PermissionType` member, the group entry in the right position, and the `en.json` label
under `"permission"`. It is idempotent, prints exactly what it changed, and refuses to write when the
files don't match the expected shape. `--after` accepts either a permission key or an enum member name.
Use `--enum` only when the auto-derived PascalCase name is wrong (the project has irregular pairs like
`BackofficGroups = 'backoffice-neocore-groups'`).

## Step 3 — Check and report

Run `yarn lint` on the two touched files and relay the script's summary to the user: which key, which
group, after which neighbour, what label.

Files touched: `src/configs/permissions.ts`, `src/plugins/i18n/locales/en.json`.

## When the script can't do it

Non-standard cases — a new group, reordering existing entries, a permission that isn't a plain
`{ type, target }` entry — the script will say it can't and stop. Then launch the Agent tool with
`subagent_type: 'backoffice-permissions'` (runs on Haiku), passing all the inputs plus what the script
reported; it edits the files by hand. Relay its summary verbatim.

## Next

If this permission is for a brand-new section, the next steps are `section-list`, then `section-form` —
but only continue if the user asked for the full section.
