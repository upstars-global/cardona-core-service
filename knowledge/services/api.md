---
title: ApiService
type: service
source: src/services/api/index.ts
tags: [api, http, axios]
updated: 2026-07-27
---

# ApiService

Статический сервис-слой для всех HTTP-запросов в бэкофисе. Оборачивает axios и обеспечивает
инфраструктуру: глобальный лоадер, тосты успеха/ошибки, отображение validation errors,
кэш ответов (Cache API), перенаправление при истёкшем токене и отмену дублирующих запросов.
Все обращения к API должны идти через `ApiService.request` из actions стора — никогда напрямую из компонентов.

## API / Сигнатура

### `ApiService.setHeaders(headers)`

Добавляет/перезаписывает заголовки, которые применяются ко всем последующим запросам.
Используется при инициализации (установка `Authorization`).

```ts
ApiService.setHeaders({ 'Content-Type': 'application/json' })
```

---

### `ApiService.request(payload, config?, retryCount?, retryDelay?)`

Основной метод. Принимает дескриптор запроса и набор флагов поведения.

**`payload: IApiServiceRequestPayload`**

| Поле | Обязательно | Описание |
|------|-------------|----------|
| `type` | ✓ | Dot-нотация пути запроса, например `AppDictionaries.getList`. Конвертируется в URL `/api/dictionaries/get-list`. Префикс `App` заменяется на `/api`, каждое слово переводится в kebab-case. |
| `data` | — | Тело запроса (объект) |
| `filter` | — | Объект фильтров |
| `pagination` | — | Объект пагинации |
| `sort` | — | Массив `IListSort` |
| `formData` | — | FormData или объект (используется когда `contentType = FormData`) |

**`config: IApiServiceConfig`** — все поля опциональны; полная таблица дефолтов — в [[config]]:

| Флаг | Дефолт | Описание |
|------|--------|----------|
| `method` | `Method.POST` | HTTP-метод |
| `contentType` | `ContentType.JSON` | Content-Type заголовок |
| `withLoader` | `true` | Показывать глобальный лоадер на время запроса |
| `withErrorToast` | `true` | Показывать тост при ошибке |
| `withErrorNotFound` | `true` | Редиректить на `/not-found` при ошибке `NOT_FOUND` |
| `withErrorDescriptionToast` | `false` | Показывать `error.description` строкой в тосте |
| `withSuccessToast` | `false` | Показывать тост при успехе |
| `successToastTitle` | `undefined` | Заголовок тоста успеха |
| `successToastDescription` | `undefined` | Описание тоста успеха |
| `formRef` | `null` | Ref формы; если задан — validation errors пишутся в поля формы |
| `newAxiosInstance` | `false` | Создать новый экземпляр axios (обходит глобальные интерцепторы) |
| `entityName` | `''` | Имя сущности для i18n-ключей тостов |
| `rejectError` | `true` | Делать `Promise.reject(error)` при ошибке; `false` — возвращать `undefined` |
| `loaderSlug` | `''` | Суффикс к URL для уникального ключа лоадера (несколько запросов на одном эндпоинте) |
| `responseType` | `'json'` | `'json'` или `'blob'` (загрузка файлов) |
| `withResponseHeaders` | `false` | Возвращать `{ data, headers }` вместо `data` |
| `cache` | auto | Кэшировать ответ через Cache API; авто-включается для URL, содержащих `'Dictionaries'` |
| `cancelPrevious` | `false` | Отменять предыдущий запрос к тому же URL (`AbortController`) |

**Возвращает** (Promise):
- `data` — тело ответа при обычном запросе
- `Blob` — когда `responseType = 'blob'` и `withResponseHeaders = false`
- `{ data, headers }` — когда `withResponseHeaders = true`
- `{}` (never-resolving Promise) — когда запрос отменён через `cancelPrevious`

## Пример

```ts
// В action стора — GET-список
const data = await ApiService.request(
  { type: 'AppUsers.getList', filter: { status: 'active' } },
  { method: Method.GET, withSuccessToast: false },
)

// Загрузка файла
const blob = await ApiService.request(
  { type: 'AppReports.download', data: { id } },
  { responseType: 'blob', withLoader: true },
)

// Создание с тостом и validation errors в форме
await ApiService.request(
  { type: 'AppUsers.create', data: form },
  { withSuccessToast: true, formRef: myFormRef, entityName: 'user' },
)
```

## Внутренняя механика

- **URL**: `payload.type` → `App` → `/api`, `convertCamelCase` по словам → kebab-case путь
- **requestId**: к каждому запросу добавляется `uuidv4()` для дедупликации на сервере
- **Кэш**: Cache API (`app-cache`), TTL 24 ч; `cachedAt` хранится внутри тела ответа
- **Ошибки токена**: при `UNAUTHORIZED`/`TOKEN_EXPIRED`/invalid-token очищает auth и редиректит на `/login`
- **retryCount / retryDelay**: параметры зарезервированы под retry-логику (TODO BAC-4018), сейчас не активны

## Стандарты проекта

- Все вызовы `ApiService.request` — **только в actions стора**, не в компонентах и не в composables (см. [[code-conventions]])
- `Method` и `ContentType` экспортируются из этого же файла и используются через него

## Связанные

- [[loader]] — стор лоадера (`useLoaderStore`)
- [[authCore]] — стор авторизации (`useAuthCoreStore`)
- [[baseSectionErrors]] — стор ошибок секций (`useBaseSectionErrorsStore`)
