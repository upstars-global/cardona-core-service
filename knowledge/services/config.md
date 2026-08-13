---
title: ApiService config
type: service
source: src/services/api/config.ts
source_hash: 7389a1aa3289
tags: [api, config, types]
updated: 2026-07-27
---

# ApiService config

Типы и константы, которые используются в `ApiService.request`. Экспортируется из `src/services/api/index.ts` и потребляется во всех сторах, которые делают API-вызовы.

## API / Сигнатура

### Константы

```ts
ContentType.JSON      // 'application/json'   — дефолт для всех запросов
ContentType.FormData  // 'multipart/form-data' — для загрузки файлов

Method.GET | .POST | .PUT | .PATCH | .DELETE
```

---

### `IApiServiceRequestPayload`

Дескриптор запроса — первый аргумент `ApiService.request`.

| Поле | Обязательно | Описание |
|------|-------------|----------|
| `type` | ✓ | Dot-нотация пути, например `AppUsers.getList`. Конвертируется в URL: `App` → `/api`, camelCase → kebab-case. |
| `data` | — | Тело запроса (JSON). |
| `filter` | — | Объект фильтров. |
| `pagination` | — | Объект пагинации (`PaginationData`). |
| `sort` | — | Массив `IListSort`. |
| `formData` | — | Файловый payload; используется только при `contentType = ContentType.FormData`. |

---

### `IApiServiceConfig`

Поведенческие флаги — второй аргумент `ApiService.request`. Все поля опциональны.

| Поле | Дефолт | Описание |
|------|--------|----------|
| `method` | `Method.POST` | HTTP-метод. |
| `contentType` | `ContentType.JSON` | Content-Type; `ContentType.FormData` для файлов. |
| `withLoader` | `true` | Показывать глобальный лоадер на время запроса. |
| `withErrorToast` | `true` | Показывать тост при ошибке. |
| `withErrorNotFound` | `true` | Редиректить на `/not-found` при ошибке `NOT_FOUND`. |
| `withErrorDescriptionToast` | `false` | Показывать `error.description` строкой в тосте вместо i18n-ключа типа ошибки. |
| `withSuccessToast` | `false` | Показывать тост успеха после мутации. |
| `successToastTitle` | — | Переопределяет авто-заголовок тоста (иначе — action name или URL). |
| `successToastDescription` | — | Переопределяет авто-описание тоста. |
| `formRef` | `null` | VeeValidate form ref; `validationErrors` из ответа пишутся в поля формы. |
| `entityName` | `''` | i18n-ключ сущности для тостов, например `'user'` → `i18n.t('entities.user')`. |
| `rejectError` | `true` | `Promise.reject(error)` при ошибке; `false` — вернуть `undefined`. |
| `loaderSlug` | `''` | Суффикс к URL для уникального ключа лоадера (если несколько запросов на одном эндпоинте). |
| `responseType` | `'json'` | `'json'` или `'blob'` (загрузка файлов). |
| `withResponseHeaders` | `false` | Вернуть `{ data, headers }` вместо `data`. |
| `cache` | auto | Cache API, TTL 24 ч; авто-включается для URL, содержащих `'Dictionaries'`. |
| `cancelPrevious` | `false` | Отменять предыдущий запрос к тому же эндпоинту (`AbortController`). |
| `newAxiosInstance` | `false` | Создать новый экземпляр axios (обходит глобальные интерцепторы). |

---

### `IResponseError`

Форма ошибки от сервера.

```ts
interface IResponseError {
  type: string             // код ошибки: 'NOT_FOUND', 'UNAUTHORIZED', 'VALIDATION_ERROR', …
  description: string      // человекочитаемое сообщение
  validationErrors?: Array<IValidationError>
}
```

### `IValidationError`

Ошибка валидации по конкретному полю формы.

```ts
interface IValidationError {
  code: string                    // код правила: 'ALREADY_EXISTS', 'REQUIRED', …
  field: string                   // имя поля формы
  template: string                // шаблон сообщения с сервера
  params: Record<string, string>  // интерполяционные параметры i18n, например { currency: 'USD' }
}
```

## Пример

```ts
// Загрузка файла
await ApiService.request(
  { type: 'AppReports.download', data: { id } },
  { method: Method.GET, responseType: 'blob', withLoader: true },
)

// Создание с validation errors в форму
await ApiService.request(
  { type: 'AppUsers.create', data: form },
  { withSuccessToast: true, formRef: myFormRef, entityName: 'user' },
)
```

## Стандарты проекта

- `Method` и `ContentType` реэкспортируются через `src/services/api/index.ts` — импортировать оттуда (см. [[code-conventions]])
- Все вызовы `ApiService.request` — только в actions стора

## Связанные

- [[api]] — `ApiService` (основной класс)
