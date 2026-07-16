---
title: Права доступа (abilityCan)
type: pattern
source: src/@model/permission.ts
tags: []
updated: 2026-07-16
---

# Права доступа (abilityCan)

Контроль доступа в проекте строится на правах текущего пользователя, которые хранятся в `useUserStore`. Проверка выполняется геттерами `abilityCan(target, level)` (одна цель) и `abilityCanInGroup(group, level)` (группа целей). Каждое право (`Permission`) имеет строковый `target` и числовой `access`.

## API / Сигнатура

- `abilityCan(target: string, access: number | PermissionLevel): boolean` — есть ли у пользователя по `target` доступ не ниже `access`.
- `abilityCanInGroup(group: PermissionGroup | string[], access: number | PermissionLevel, all = false): boolean` — проверка по группе/массиву целей; `all=true` требует все цели, `false` — хотя бы одну.
- Тип права `PermissionUpdatableType = 'switch' | 'table'`: `table` имеет уровни 0-4 (`noaccess`, `view`, `create`, `update`, `delete`), `switch` — 0-1 (`noaccess`, `view`).
- Уровни маппятся строкой через `accessLevels = ['noaccess','view','create','update','delete']`: строковый `access` переводится в индекс, поэтому в вызовы можно передавать и число, и `PermissionLevel`.

## Пример

```ts
import { useUserStore } from '@core/stores/user'
import { PermissionLevel } from '@model/permission'

const { abilityCan, abilityCanInGroup } = useUserStore()

// одна цель: можно ли редактировать (update = уровень 3)
if (abilityCan('payouts', PermissionLevel.update)) {
  // показать кнопку "Сохранить"
}

// группа целей: доступен ли хотя бы один раздел
if (abilityCanInGroup(['payouts', 'players'], PermissionLevel.view)) {
  // показать пункт меню
}
```

## Как берутся права

`fetchCurrentUser()` вызывает `App.V2.Users.Current.Read`, маппит `data.permissions` в `Permission[]` внутри `UserInfo` и раскладывает их по группам через `AllPermission.setAccessAllPermission()`. `abilityCan` ищет право по `target` в `userInfo.permissions`; `abilityCanInGroup` при передаче `PermissionGroup` берёт цели из `permissions.allPermission[group]`.

## Стандарты проекта

- Проверки прав — только через геттеры стора, не обращайся к `userInfo.permissions` напрямую в компонентах.
- Для 2+ уровней/целей используй массив + `includes`/`some`/`every` (см. [[code-conventions]]).
- `target` именуется по бэкенд-эндпоинтам (mirrors backend naming).

## Связанные

- [[user]]
- [[permissions]]
- [[permission]]
- [[pinia-store-pattern]]
- [[code-conventions]]
