---
title: permission (модель)
type: model
source: src/@model/permission.ts
tags: []
updated: 2026-07-16
---

# permission (модель)

Модель прав доступа: описывает единичное право (`target` + числовой `access`), обновляемые права типов `table`/`switch` и агрегатор `AllPermission` над всеми группами из `@permissions`. Используется системой контроля доступа для проверки уровней доступа пользователя.

## API / Сигнатура

Тип обновляемого права и перечисления уровней:
- `type PermissionUpdatableType = 'switch' | 'table'` — тип права.
- `enum PermissionLevel` — `noaccess | view | create | update | delete`.
- `enum ListPermissionLevel` — расширяет `PermissionLevel` уровнями для списков: `seo`, `seoCreate`, `seoUpdate`, `seoView`, `export`.

Классы:
- `class Permission` — базовое право. Поля: `target: string`, приватный `_access: number`.
  - `constructor(data: PermissionInput)` — `PermissionInput = { access: number, target: string }`.
  - `changeAccess(access: number): void` — меняет уровень доступа.
  - `get access(): number` — текущий уровень.
  - `toJSON(): { access, target }` — сериализация для отправки на бэкенд.
- `class PermissionUpdatableTable extends Permission` — обновляемое право с типом. Добавляет `type`, `trigger?`, `notAccessLevel?` (по умолчанию `[0]`), `forAccessLevelValue?` (по умолчанию `0`). `access` дефолтится в `0`.
- `class PermissionUpdatableTableList` — группа прав: `title?`, `permissions?: PermissionUpdatableTable[]`.
- `class AllPermission` — все права проекта (из `@permissions`).
  - `constructor(permission?: PermissionInput[])` — при наличии сразу проставляет уровни.
  - `setAccessAllPermission(permission: PermissionInput[]): void` — маппит `access` по `target`.
  - `toArray(): PermissionUpdatableTable[]` — плоский список.
  - `toPermissionArray(): Permission[]` — список `toJSON()`-объектов для сохранения.
  - `get allPermission` — сгруппированная структура.

## Пример
```ts
import { AllPermission, PermissionLevel } from '@model/permission'

// текущие права пользователя, пришедшие с бэкенда
const userPerms = [{ target: 'payouts', access: 3 }]

const all = new AllPermission(userPerms)

// подготовить массив для сохранения формы прав
const payload = all.toPermissionArray() // [{ access, target }, ...]

console.log(PermissionLevel.update) // 'update'
```

## Стандарты проекта
- Право — это класс с интерфейсом (`Permission`, `PermissionInput`), а не plain-объект (см. [[code-conventions]]).
- Для сравнения набора уровней используй массив + `includes`, а не цепочки `===`.

## Связанные
- [[access-control]]
- [[permissions]]
- [[model-class-pattern]]
- [[code-conventions]]
