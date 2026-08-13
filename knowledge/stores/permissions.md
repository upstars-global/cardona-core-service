---
title: permissions store
type: store
source: src/stores/permissions.ts
source_hash: 727a2fdb556c
tags: []
updated: 2026-07-16
---

# permissions store

Pinia store (`usePermissionsStore`) для чтения и обновления сущности прав доступа. Работает через `ApiService`: тип запроса строится из имени сущности с помощью `transformNameToType` и префикса `ApiTypePrefix`. При обновлении синхронизирует `permissions` в `userStore` через `setUserInfo`.

## API / Сигнатура
- `readEntity(payload: { type: string; id: string; customApiPrefix?: string }): Promise<data>` — запрашивает `...{Type}.Read` по `id` и возвращает `data`.
- `updateEntity(payload: { type: string; data: { form: any; formRef: any }; customApiPrefix?: string }): Promise<Response>` — сначала кладёт `form.permissions` в `userStore` (оптимистично), затем шлёт `...{Type}.Update` с `withSuccessToast` и `formRef` для серверной валидации формы.

## Пример
```ts
const permissionsStore = usePermissionsStore()

// чтение
const role = await permissionsStore.readEntity({ type: 'Roles', id: '42' })

// обновление
await permissionsStore.updateEntity({
  type: 'Roles',
  data: { form: role, formRef },
})
```

## Стандарты проекта
- API-вызовы только в actions стора (см. [[code-conventions]]).
- `type` мапится на API-тип через `transformNameToType` + `ApiTypePrefix`, без явных URL (см. [[apiservice-routing]]).

## Связанные
- [[access-control]]
- [[permission]]
- [[user]]
- [[apiservice-routing]]
- [[baseStoreCore]]
