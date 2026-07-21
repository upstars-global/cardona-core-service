---
title: ApiService: type-based роутинг
type: pattern
source: src/services/api/index.ts
tags: []
updated: 2026-07-16
---

# ApiService: type-based роутинг

Единый HTTP-слой проекта. URL не передаётся явно — он строится из строкового `type` payload-а (например `App.V2.Banners.Types.List`). `ApiService.request` берёт на себя авторизацию, лоадер, кэш словарей, toast-уведомления и разбор ошибок бэкенда.

## API / Сигнатура
- `ApiService.request(payload: IApiServiceRequestPayload, config?: IApiServiceConfig, retryCount?, retryDelay?)` — выполняет запрос; возвращает `data` (или `{ data, headers }` при `withResponseHeaders`, или `Blob` при `responseType: 'blob'`).
- `ApiService.setHeaders(headers: RequestHeaders)` — задаёт общие заголовки (мержится в `this.headers`).
- `payload.type: string` — источник URL. Правило сборки: `App` → `/api`, точка → `/`, каждый сегмент через `convertCamelCase(word, '-')`. Итог: `App.V2.Banners.Types.List` → `/api/v2/banners/types/list`. `convertedType[2]` берётся как `entity` для локализации toast-ов.
- `config` (`IApiServiceConfig`) — флаги поведения: `method` (default `Method.POST`), `contentType`, `withLoader`, `withErrorToast`, `withSuccessToast`, `cache`, `cancelPrevious`, `responseType`, `rejectError` и др.

Отдельно `useApi` (`src/composables/useApi.ts`) — `createFetch` от `@vueuse/core`: `baseUrl = VITE_API_BASE_URL || '/api'`, в `beforeFetch` подставляет `Authorization: Bearer <accessToken>` из cookie, в `afterFetch` парсит тело через `destr`. Используется для лёгких fetch-запросов вне основного `ApiService`.

## Пример
```ts
// внутри action стора
const { data } = await ApiService.request(
  { type: 'App.V2.Banners.Types.List', filter, pagination },
  { cancelPrevious: true },
)
// POST /api/v2/banners/types/list; тело — JSON payload + requestId (uuid)
```

## Стандарты проекта
- Запросы вызывать ТОЛЬКО из actions стора, не из компонентов и не из composables (см. [[code-conventions]]).
- URL никогда не пишется руками — только через `type`; имена сущностей мируют бэкенд-эндпоинты.
- Ошибки бэкенда (`error.type`, `validationErrors`) разбираются централизованно: 401/`TOKEN_INVALID` чистят auth и редиректят на `/login`, `NOT_FOUND` — на `/not-found`.
- `type`, содержащий `Dictionaries`, по умолчанию кэшируется в Cache Storage на 1 день.

## Связанные
- [[architecture]]
- [[useApi]]
- [[pinia-store-pattern]]
- [[baseStoreCore]]
