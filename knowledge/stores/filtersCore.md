---
title: filtersCore store
type: store
source: src/stores/filtersCore.ts
tags: []
updated: 2026-07-16
---

# filtersCore store

Pinia store (`filters-core`) с состоянием системы фильтров списков. Хранит контекст текущего списка (`entityName`, `listPath`), применённые фильтры и сохранённые пользовательские дефолтные фильтры (`defaultFilters`), а также синхронизирует последние с бэкендом.

## API / Сигнатура

State:
- `entityName: string` — имя сущности текущего списка
- `listPath: string` — путь списка
- `listFilters: BaseField[]` — применённые фильтры списка
- `defaultFilters: IDefaultFilter[]` — сохранённые пользовательские фильтры

Getters:
- `listEntityName / getListPath / appliedListFilters / defaultFiltersList` — read-only доступ к state
- `isExistsEntityDefaultFilters(keyStorage: string): boolean` — есть ли непустой дефолтный фильтр с `type === keyStorage`

Actions:
- `setListEntityName(entityName?: string)` / `setListPath(path?: string)` / `setListFilters(filters?: BaseField[])` — установка контекста списка
- `setDefaultFilters(filters: IDefaultFilter[])` — заменить весь список дефолтных фильтров
- `setDefaultFilter(filter: IDefaultFilter)` — upsert одного фильтра по `type` (локально)
- `saveDefaultFilter(filter: IDefaultFilter): Promise<void>` — сохранить на бэкенде (`App.V2.Users.Filters.Store`) и обновить локально
- `fetchDefaultFilters(): Promise<IDefaultFilter[]>` — загрузить с бэкенда (`App.V2.Users.Filters.List`), кэшируется если уже загружены
- `clearLocalDefaultFilters()` — очистить локальные дефолтные фильтры

## Пример
```ts
const filtersStore = useFiltersStore()

await filtersStore.fetchDefaultFilters()

if (filtersStore.isExistsEntityDefaultFilters('players-list'))
  console.log('есть сохранённый фильтр')

await filtersStore.saveDefaultFilter({ type: 'players-list', fields })
```

## Стандарты проекта
- Store следует паттерну `use` + plural + `Store` (`useFiltersStore`), см. [[pinia-store-pattern]].
- Все вызовы `ApiService` — только внутри actions, роутинг по `type`, см. [[apiservice-routing]] и [[code-conventions]].

## Связанные
- [[filter]]
- [[pinia-store-pattern]]
- [[apiservice-routing]]
- [[code-conventions]]
