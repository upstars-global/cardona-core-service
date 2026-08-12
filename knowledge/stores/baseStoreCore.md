---
title: baseStoreCore
type: store
source: src/stores/baseStoreCore.ts
source_hash: 76444c6e05d2
tags: []
updated: 2026-07-16
---

# baseStoreCore

Базовый Pinia-стор (`useBaseStoreCore`) для CRUD-секций. Предоставляет универсальные actions поверх `ApiService`: список, чтение, создание, обновление, удаление и выгрузку отчётов. URL не задаётся явно — `type` собирается из имени секции через `transformNameToType` и префикса `ApiTypePrefix`.

## API / Сигнатура
- `fetchEntityList(payload: { type, data: IRequestListPayload, options: { customApiPrefix?, listItemModel?, cancelPrevious? } }): Promise<ListData>` — запрос `.List` с pagination/sort/filter, оборачивает ответ в `ListData`.
- `fetchReport(payload: { type, data, customApiPrefix? }): Promise<Blob | string>` — `.Load.List.Report`; `blob` для `ExportFormat.XLSX`, JSON-строка для `ExportFormat.JSON`.
- `readEntity(payload: { type, id, customApiPrefix?, project? }): Promise<any>` — `.Read` по `id`; при ошибке пытается редиректнуть на not-found страницу.
- `fetchTypes(type: string): Promise<any>` — `.Types.List` (справочники).
- `createEntity(payload: { type, data: { form, formRef }, customApiPrefix? }): Promise<any>` — `.Create`, добавляет `project` и `productId`, показывает success-toast.
- `updateEntity(payload)` — `.Update` (аналогично create).
- `toggleStatusEntity(payload)` — `.Active.Switch`.
- `multipleUpdateEntity(payload: { type, data: Array<{ id, isActive }>, customApiPrefix? })` — `.Update.Multiple`.
- `deleteEntity(payload: { type, id, comment, customApiPrefix?, inlineFilters? })` — `.Delete`.
- `multipleDeleteEntity(payload: { type, ids, customApiPrefix? })` — `.Delete.Multiple`.

Экспортируется также хелпер `transformNameToType(type: string): string` — переводит kebab-имя секции в dot-нотацию типа (`some-name` → `SomeName`).

## Пример
```ts
const baseStore = useBaseStoreCore()

// список
const list: ListData = await baseStore.fetchEntityList({
  type: 'Banners',
  data: { page: 1, perPage: 20, sort, filter },
  options: { listItemModel: BannersListItem },
})

// чтение по id
const data = await baseStore.readEntity({ type: 'Banners', id })
```

## Стандарты проекта
- Все вызовы `ApiService` — только внутри actions стора (см. [[code-conventions]]).
- `type` не хардкодится URL-ом, а строится из имени секции — см. [[apiservice-routing]].
- Конкретные секционные сторы делегируют CRUD этому базовому стору.

## Связанные
- [[apiservice-routing]]
- [[pinia-store-pattern]]
- [[code-conventions]]
- [[filtersCore]]
