---
title: WebSocket / Centrifuge
type: pattern
source: src/services/ws/index.ts
source_hash: 9dca31eee755
tags: []
updated: 2026-07-16
---

# WebSocket / Centrifuge

Реалтайм-слой поверх [Centrifuge](https://github.com/centrifugal/centrifuge-js). `WSService` — статический класс, который держит единственное подключение, подписывается на серверные каналы и маршрутизирует входящие publication-события в Pinia-сторы. Дев-режим подключается к локальному lens-порту (`ws://localhost:{LENS_PORT}`), прод — к `wss://{host}/ws`.

## API / Сигнатура
- `WSService.connect(channel, { needRefresh?, stores }): Promise<Centrifuge>` — создаёт клиента, при `needRefresh` предварительно обновляет JWT через `useAuthCoreStore().refreshAuth`, подписывается на каналы из `channel` и вешает обработчики (`error`, `subscribed`, `publication`, `connected`). При коде ошибки `109` / `token expired` авто-реконнект с `needRefresh: true`.
- `WSService.disconnect(): void` — рвёт соединение.
- `WSService.subscribe(channel: string): void` — добавляет канал в `WSListSubscribe` и подписывается; если клиента ещё нет — ретрай через `setTimeout(500)`.
- `WSService.unsubscribe(channel: string): void` — отписывается и убирает канал из `WSListSubscribe`.
- `WSService.send(text)` / `WSService.publish(channel, message)` — низкоуровневая отправка.
- `WSService.parseData(message)` — по `message.channel` находит стор в `this.stores` и по `message.data.type` (`TyperRequest`) вызывает `createWSData` / `setWSData` / `deleteWSData`.
- `enum TyperRequest { Updated, Created, Deleted, ReportDownload }` — типы входящих событий.

## Пример
```ts
import WSService from '@core/services/ws'

// channel: map ключей → имён серверных каналов
// stores: map «имя канала → store», у стора должны быть
// createWSData / setWSData / deleteWSData
await WSService.connect(
  { payouts: 'payouts-feed' },
  { stores: { 'payouts-feed': usePayoutsStore() } },
)

WSService.subscribe('payouts-feed')
// ...
WSService.unsubscribe('payouts-feed')
WSService.disconnect()
```

## Стандарты проекта
- Токены берутся из `axios-jwt` (`getAccessToken` / `getRefreshToken`); перед `connect` проверяется `checkIsLoggedIn()`.
- Обработку данных держим в сторе (методы `*WSData`), не в компонентах — см. [[code-conventions]] и [[pinia-store-pattern]].
- `messageTypes` (config.ts) — enum протокольных типов сообщений Centrifuge.

## Связанные
- [[pinia-store-pattern]]
- [[code-conventions]]
- [[architecture]]
- [[access-control]]
