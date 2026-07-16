---
title: Code Conventions
type: standard
source: .claude/rules/code-conventions.md
tags: [standard, conventions]
updated: 2026-07-16
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
- **`import type`** для type-only импортов (`@typescript-eslint/consistent-type-imports`).
- **Сравнение с 2+ значениями** — массив + `includes`, а не цепочки `===`/`||`. Одно значение → `===`.

## Vue / шаблоны

- Компоненты в шаблонах — **PascalCase**.
- Прямые импорты из `vuetify/components` запрещены ESLint — компоненты авто-импортируются.
- Только иконки **Tabler**; mdi запрещены ESLint.

## Форматирование

Без точек с запятой, отступ 2 пробела, trailing commas, camelCase, одинарные кавычки.

## Пути (алиасы)

Используй алиасы: `@images` вместо `@/assets/images`, `@styles` вместо `@/assets/styles`.

## Связанные

- [[architecture]]
- [[model-class-pattern]]
- [[pinia-store-pattern]]
- [[apiservice-routing]]
