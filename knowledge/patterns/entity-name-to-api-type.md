---
title: entityName → тип запроса (transformNameToType)
type: pattern
source: src/stores/baseStoreCore.ts
source_hash: 76444c6e05d2
tags: [api, apiservice, entityName, baseStoreCore]
updated: 2026-08-06
---

# entityName → тип запроса

`ApiService` не принимает URL: адрес собирается из строки `type` вида `App.V2.Games.List`.
Эту строку строит `transformNameToType` из `entityName`, который раздел задаёт в `useList`/`useForm`.

## Что неочевидно

**Правила несимметричны, и это главный источник ошибок.** Посимвольно:

1. первый символ — в верхний регистр;
2. дефис — **удаляется**;
3. заглавная буква сразу **после дефиса** остаётся заглавной и точку перед собой **не получает**;
4. любая другая заглавная буква получает точку перед собой;
5. остальное — как есть.

То есть дефис и CamelCase значат разное: дефис склеивает, camelCase — разделяет точкой.

| `entityName` | результат |
|---|---|
| `Levels` | `App.V2.Levels.List` |
| `Vip-Manager` | `App.V2.VipManager.List` |
| `Vip-ServiceSeason-Vip-Status` | `App.V2.VipService.SeasonVipStatus.List` |
| `Neo-core-Users` | `App.V2.NeoCore.Users.List` |
| `Players-BonusHistory` | `App.V2.Players.BonusHistory.List` |

**`entityName` нельзя выводить из имени раздела.** Одна лишняя или недостающая заглавная буква даёт
существующий, но чужой тип запроса — ошибка проявится 404-ым или пустым списком, а не падением
сборки. Строку берут из Swagger или у бэкенда.

**Префикс `App.V2.` живёт в `productConfig.ts`** (`ApiTypePrefix`) и переопределяется per-раздел через
`customApiPrefix` в `BaseListConfig` — для эндпоинтов, которые живут вне общего пространства имён.

**Суффикс добавляет вызывающий код**, а не `transformNameToType`: `.List`, `.Read`, `.Create`,
`.Update`, `.Delete`. Поэтому один `entityName` обслуживает весь CRUD раздела.

## Связанные

- [[apiservice-routing]] — как `type` превращается в HTTP-запрос
- [[baseStoreCore]] — где вызывается
