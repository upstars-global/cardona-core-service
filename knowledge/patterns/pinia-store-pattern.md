---
title: Паттерн Pinia-стора
type: pattern
source: src/stores/baseStoreCore.ts
tags: []
updated: 2026-07-16
---

# Паттерн Pinia-стора

Базовый стор ядра `useBaseStoreCore` — универсальный набор CRUD-actions поверх `ApiService`. Определён через `defineStore` (options-стиль), инкапсулирует построение API-`type` из имени сущности (`transformNameToType`) и подстановку `project`/`productId`. Прикладные стора (`useXxxStore`) переиспользуют его actions, передавая только `type` сущности.

## API / Сигнатура
- `fetchEntityList(payload: { type, data: IRequestListPayload, options }): Promise<ListData>` — список с пагинацией/сортировкой/фильтром; заворачивает ответ в `ListData`.
- `fetchReport(payload: { type, data, customApiPrefix? }): Promise<Blob | string>` — выгрузка отчёта (`.Load.List.Report`), формат XLSX → `blob`, иначе JSON-строка.
- `readEntity(payload: { type, id, customApiPrefix?, project? }): Promise<any>` — чтение одной сущности (`.Read`); при ошибке редиректит на not-found.
- `fetchTypes(type: string): Promise<any>` — справочник типов (`.Types.List`).
- `createEntity` / `updateEntity(payload: { type, data: { form, formRef }, customApiPrefix? })` — создание/обновление (`.Create` / `.Update`) с success-toast и `formRef` для ошибок валидации.
- `toggleStatusEntity(payload)` — переключение активности (`.Active.Switch`).
- `multipleUpdateEntity` / `multipleDeleteEntity` — пакетные операции (`.Update.Multiple` / `.Delete.Multiple`).
- `deleteEntity(payload: { type, id, comment, ... })` — удаление (`.Delete`).
- `transformNameToType(type: string): string` — превращает `kebab-name` в `PascalDotType` для построения API-`type`.

## Пример
```ts
export const useBannersStore = defineStore('banners', () => {
  const baseStore = useBaseStoreCore()

  const fetchBanners = (data: IRequestListPayload): Promise<ListData> =>
    baseStore.fetchEntityList({ type: 'Banners', data, options: {} })

  const createBanner = (form: BannersForm, formRef: any) =>
    baseStore.createEntity({ type: 'Banners', data: { form, formRef } })

  return { fetchBanners, createBanner }
})
```

## Стандарты проекта
- Именование: `use` + существительное во множественном числе + `Store` (`useBannersStore`). См. [[code-conventions]].
- Все вызовы `ApiService` — только внутри actions стора, не в компонентах.
- URL не задаётся вручную: маршрутизация идёт по `type` (`ApiTypePrefix` + сущность + суффикс операции). См. [[apiservice-routing]].
- Ответы списков оборачиваются в модель `ListData`; формы — в model-классы.

## Связанные
- [[apiservice-routing]]
- [[code-conventions]]
- [[model-class-pattern]]
- [[architecture]]
