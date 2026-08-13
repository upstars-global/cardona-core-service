# Индекс документации

> Карта содержимого (MOC). Файл **генерируется** скриптом
> `node scripts/docs-map.mjs --build-index` — не редактируйте вручную.
> Хроника операций — в [[log]] (append-only журнал ingest/query/lint).

## Composables

- [[useApi]] — useApi

## Models

- [[filter]] — filter (модель)
- [[permission]] — permission (модель)

## Patterns

- [[access-control]] — Права доступа (abilityCan)
- [[apiservice-routing]] — ApiService: type-based роутинг
- [[composable-pattern]] — Паттерн composable
- [[entity-name-to-api-type]] — entityName → тип запроса (transformNameToType)
- [[model-class-pattern]] — Паттерн модели-класса
- [[pinia-store-pattern]] — Паттерн Pinia-стора
- [[websocket-centrifuge]] — WebSocket / Centrifuge

## Services

- [[api]] — ApiService
- [[config]] — ApiService config

## Standards

- [[architecture]] — Архитектура
- [[code-conventions]] — Code Conventions

## Stores

- [[baseStoreCore]] — baseStoreCore
- [[filtersCore]] — filtersCore store
- [[permissions]] — permissions store
- [[user]] — user store
