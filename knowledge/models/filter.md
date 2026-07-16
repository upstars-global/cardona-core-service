---
title: filter (модель)
type: model
source: src/@model/filter.ts
tags: []
updated: 2026-07-16
---

# filter (модель)

Модуль описывает типы и вспомогательные модели фильтров списков. Содержит перечисление `FilterType` (все поддерживаемые виды фильтров), тип payload'а `PayloadFilters` для отправки на бэкенд и набор небольших класс-моделей отдельных фильтров.

## API / Сигнатура
- `type PayloadFilters = Record<string, string | string[] | boolean>` — форма фильтров в запросе к API (ключ фильтра → значение).
- `enum FilterType` — виды фильтров: `Admin`, `Group`, `Status`, `Date`, `PaymentSystem`, `SumRange`, `DateRangeCreative`, `GameId`, `DemoType` и др.
- `class FilterID` — `new FilterID({ id: string })`, `readonly id`.
- `class FilterSearch` — `new FilterSearch({ search?: string })`, `readonly search`.
- `class FilterProject` — `new FilterProject({ project: string })`, `readonly project`.
- `interface IDefaultFilter` — `{ readonly type: string; readonly fields: string[] }` — дефолтный фильтр с типом и списком полей.

## Пример
```ts
import { FilterType, type PayloadFilters, FilterSearch } from '@model/filter'

const payload: PayloadFilters = {
  [FilterType.Status]: ['active', 'blocked'],
  [FilterType.Name]: 'John',
}

const searchFilter = new FilterSearch({ search: 'John' })
```

## Стандарты проекта
- Модели — классы с интерфейсами, а не plain-объекты (см. [[code-conventions]]).
- Для сравнения с 2+ значениями `FilterType` используйте массив + `includes`.

## Связанные
- [[filtersCore]]
- [[baseStoreCore]]
- [[model-class-pattern]]
- [[code-conventions]]
