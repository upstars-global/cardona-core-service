---
name: backoffice-permissions
description: Add or modify an access permission in a cardona-core-service backoffice — a new PermissionType enum key, its access-management group entry, and its English label on the roles screen. Use this whenever the user wants to add/register a permission, grant access to a section, wire a `backoffice-*` access key, or edit the permissions config — even phrased as "add access for X", "new permission key", "дай доступ к разделу", "добавь пермишен". Also the first stage when creating a whole new section, but it stands alone: reach for it any time only a permission needs to change, without touching routes, menu, or pages.
---

# Add a Permission

The target is a Vue 3 + TS + Pinia + Vuetify backoffice built on `cardona-core-service`. Access is driven by a single enum + a grouped config that also renders the roles/access-management screen. This skill adds one permission end to end: the enum key, the group entry (in the right order), and the localized label.

This is a self-contained task. It is Stage 1 of creating a new section, but most of the time you only need a permission — do just this and stop.

## Files

- `src/configs/permissions.ts` — the `PermissionType` string enum + the `default` export object of permission *groups* (each an array of entry objects). This file only builds the access-management UI; nothing in it imports routes/menu/list, so editing it is safe in isolation.
- `src/plugins/i18n/locales/en.json` — the human-readable name shown on the roles screen.

## What to ask

| What | Behavior |
|---|---|
| **Permission key** (`backoffice-<...>`) | **Must ask** — comes from the backend, not derived from the section name. Do not guess. |
| **Localized name** (en.json value) | Suggest from the key/section (`vipSeasons` → `"VIP Seasons"`) and confirm. |
| **Enum name** (PascalCase) | Derive from the key: `backoffice-season-vip-status` → `BackofficeSeasonVipStatus`. |
| **Group + placement** | Which group (`Gamification`, `Players`, `Promo`, `Settings`, …) and which neighbor to sit after. |
| **Type** | `Table` (access levels 0–4) or `Switch` (binary). Default `Table`. |

## What to do

1. Add to `enum PermissionType`, near thematically related keys:
   ```ts
   BackofficeSeasonVipStatus = 'backoffice-season-vip-status',
   ```

2. Add to the group's `default` array. **Order matters — it must match the intended menu order, because the roles screen renders in this same order:**
   ```ts
   {
     target: PermissionType.BackofficeSeasonVipStatus,
     type: PermissionFormType.Table,
   },
   ```
   - `type`: `PermissionFormType.Table` (levels 0–4) or `PermissionFormType.Switch` (binary on/off).
   - `notAccessLevel: [2, 4]` — forbidden levels when the backend doesn't support create/delete. Only add if similar nearby sections already use it; otherwise default to `Table` with no restrictions.

3. Add to `en.json` among the other `backoffice-*` keys:
   ```json
   "backoffice-season-vip-status": "VIP Seasons",
   ```

## Check

Confirm to the user: added `<key>` (enum `<EnumName>`) to group `<group>` after `<sibling>`, label `"<Label>"`. Run `yarn typecheck && yarn lint`.

If this permission is for a brand-new section, the next steps are the `section-list` skill (list page) and then `section-form` skill (create/update) — but only continue if the user asked for the full section.
