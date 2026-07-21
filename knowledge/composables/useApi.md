---
title: useApi
type: composable
source: src/composables/useApi.ts
tags: []
updated: 2026-07-16
---

# useApi

Преднастроенная обёртка над `createFetch` из `@vueuse/core`. Задаёт `baseUrl`, дефолтные заголовки, автоматически подставляет `Bearer`-токен из cookie и парсит JSON-ответ через `destr`. Возвращает готовый composable для выполнения HTTP-запросов.

## API / Сигнатура
- `useApi(url): UseFetchReturn` — реактивный fetch-инстанс с общими настройками
- `baseUrl` — `import.meta.env.VITE_API_BASE_URL || '/api'`
- `fetchOptions.headers` — `Accept: 'application/json'` по умолчанию
- `options.refetch: true` — повторный запрос при изменении реактивного url
- `beforeFetch` — читает `useCookie('accessToken')`, при наличии добавляет `Authorization: Bearer <accessToken>`
- `afterFetch` — парсит `data` через `destr(data)`, при ошибке логирует в консоль и возвращает `null`

## Пример
```ts
import { useApi } from '@core/composables/useApi'

const { data, isFetching, error } = useApi('users/me').json()
```

## Стандарты проекта
- Основной слой HTTP-запросов — `ApiService` с type-based роутингом; `useApi` используется как низкоуровневая обёртка (см. [[apiservice-routing]]).
- Запросы делаются из store actions, не из компонентов (см. [[code-conventions]]).

## Связанные
- [[apiservice-routing]]
- [[code-conventions]]
