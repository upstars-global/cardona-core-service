---
title: Code Conventions
type: standard
source: .claude/rules/code-conventions.md
source_hash: b6c81e5b475a
tags: [standard, conventions]
updated: 2026-08-27
---

# Code Conventions

Стандарты кода проектов Cardona. Полный источник — `.claude/rules/code-conventions.md`.

## Архитектура

- **API только в actions стора.** Все вызовы `ApiService` — внутри Pinia-actions, никогда
  напрямую из компонентов/composable-ов. См. [[apiservice-routing]].
- **Именование стора**: `use` + существительное во мн. числе + `Store` — `useGiftsStore`, `usePayoutsStore`.
- **Именование по backend-эндпоинтам**: папки/компоненты/роуты повторяют имена типов API
  (`ProjectsCreate`, `ProjectsUpdate`).

## TypeScript

- **Модели — классы, не голые объекты**: `new User({...})`, не `{ firstName: '...' }`. См. [[model-class-pattern]].
- **Именование**: интерфейс `I` + имя + `Data` (`IProjectsData`, `IProjectsListItemData`);
  класс — только имя сущности (`ProjectsListItem`, `ProjectsForm`).
- **Сравнение с 2+ значениями** — массив + `includes`, а не цепочки `===`/`||`. Одно значение → `===`.

## Vue / шаблоны

- Только иконки **Tabler**; mdi запрещены ESLint-правилом.

## Форматирование

Trailing commas, camelCase, одинарные кавычки.

## Пути (алиасы)

Используй алиасы: `@images` вместо `@/assets/images`, `@styles` вместо `@/assets/styles`.

## Связанные

- [[model-class-pattern]]
- [[pinia-store-pattern]]
- [[apiservice-routing]]
