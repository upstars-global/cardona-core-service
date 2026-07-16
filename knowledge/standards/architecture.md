---
title: Архитектура
type: standard
source: src/
tags: [standard, architecture]
updated: 2026-07-16
---

# Архитектура

`cardona-core-service` — ядро backoffice-SPA (Vue 3 + TS + Pinia + Vuetify), которое
переиспользуют панели: `cardona`, `marbella`, `compostela`. Панели подключают ядро как
git-зависимость и добавляют своё.

## Поток данных

```
Pages/Components → Composables & Stores (Pinia) → ApiService (HTTP) / Centrifuge (WS) → Backend
```

- HTTP идёт через `ApiService` с **type-based роутингом** (URL строится из `type`, а не задаётся явно).
  См. [[apiservice-routing]], [[useApi]].
- Реалтайм — через Centrifuge. См. [[websocket-centrifuge]].
- Запросы — только из actions стора, не из компонентов. См. [[code-conventions]].

## Ключевые слои

- `@model/` — модели данных как классы (интерфейс + класс). См. [[model-class-pattern]].
- `stores/` — Pinia composition-API сторы. Базовый — [[baseStoreCore]].
- `composables/`, `use/` — переиспользуемая логика. См. [[composable-pattern]].
- `services/` — [[apiservice-routing|api]] и [[websocket-centrifuge|ws]].
- Доступы — [[permissions]] (`abilityCan`, `abilityCanInGroup`).

## Распространение ядра в панели

- Скиллы/агенты Claude раздаются симлинками (`scripts/sync-core-claude.mjs`).
- Механизм этой документации (`scripts/docs-map.mjs`, `docs-guard.mjs`, скилл `update-docs`)
  живёт здесь и едет в панели через `node_modules/cardona-core-service`.

## Связанные

- [[code-conventions]]
- [[apiservice-routing]]
- [[permissions]]
